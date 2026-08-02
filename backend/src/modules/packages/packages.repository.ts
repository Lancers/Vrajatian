import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { CacheService } from '../../common/cache/cache.service';
import { PackageInput } from './package.dto';
import { sniffImageType } from './image-sniff';

const PUBLIC_CACHE_TTL_SECONDS = 60;
const PUBLIC_CACHE_PREFIX = 'packages:';

export interface PackageRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_path: string | null;
  price: number | string;
  duration: string;
  rating: number | string | null;
  location: string;
  region: string;
  type: 'trip' | 'activity' | 'education' | 'corporate';
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  group_size: number;
  is_featured: boolean;
  special_request_allowed: boolean;
  inclusions: string[] | null;
  exclusions: string[] | null;
  itinerary: { day: number; title: string; description: string }[] | null;
  tiers: { name: 'Basic' | 'Value' | 'Deluxe'; price: number; description: string }[] | null;
  status: 'draft' | 'published';
}

const SELECT_COLS =
  'id, slug, title, description, cover_image_path, price, duration, rating, ' +
  'location, region, type, difficulty, group_size, is_featured, special_request_allowed, ' +
  'inclusions, exclusions, itinerary, tiers, status';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** All SQL / storage access for packages lives here — isolated from business logic. */
@Injectable()
export class PackagesRepository {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly cache: CacheService,
  ) {}

  private get db() {
    return this.supabase.admin;
  }

  publicImageUrl(path: string | null): string {
    if (!path) return '';
    return this.db.storage.from(this.supabase.bucket).getPublicUrl(path).data.publicUrl;
  }

  async listPublished(type?: string): Promise<PackageRow[]> {
    const cacheKey = `${PUBLIC_CACHE_PREFIX}published:${type ?? 'all'}`;
    const cached = this.cache.get<PackageRow[]>(cacheKey);
    if (cached) return cached;

    let query = this.db.from('packages').select(SELECT_COLS).eq('status', 'published');
    if (type) query = query.eq('type', type);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const rows = (data ?? []) as unknown as PackageRow[];
    this.cache.set(cacheKey, rows, PUBLIC_CACHE_TTL_SECONDS);
    return rows;
  }

  async listAll(type?: string): Promise<PackageRow[]> {
    let query = this.db.from('packages').select(SELECT_COLS);
    if (type) query = query.eq('type', type);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as PackageRow[];
  }

  async findPublishedBySlug(slug: string): Promise<PackageRow | null> {
    const cacheKey = `${PUBLIC_CACHE_PREFIX}slug:${slug}`;
    const cached = this.cache.get<PackageRow | null>(cacheKey);
    if (cached !== undefined) return cached;

    const { data, error } = await this.db
      .from('packages')
      .select(SELECT_COLS)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;

    const row = (data as unknown as PackageRow) ?? null;
    this.cache.set(cacheKey, row, PUBLIC_CACHE_TTL_SECONDS);
    return row;
  }

  async findById(id: string): Promise<PackageRow | null> {
    const { data, error } = await this.db
      .from('packages')
      .select(SELECT_COLS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as PackageRow) ?? null;
  }

  /**
   * Type is determined from the file's actual bytes, not the client-declared
   * Content-Type/filename — both are attacker-controlled on a multipart
   * upload, and either could otherwise steer the stored extension/Content-Type.
   */
  async uploadCover(file: Express.Multer.File): Promise<string> {
    const sniffed = sniffImageType(file.buffer);
    if (!sniffed) {
      throw new BadRequestException('Cover image must be a JPEG, PNG, or WebP.');
    }
    const path = `${crypto.randomUUID()}.${sniffed.ext}`;
    const { error } = await this.db.storage
      .from(this.supabase.bucket)
      .upload(path, file.buffer, { contentType: sniffed.mime, cacheControl: '3600', upsert: false });
    if (error) throw error;
    return path;
  }

  async removeCover(path: string | null): Promise<void> {
    if (path) await this.db.storage.from(this.supabase.bucket).remove([path]);
  }

  /** Insert, retrying the slug on unique-violation. Cleans up the image on hard failure. */
  async insert(input: PackageInput, coverImagePath: string): Promise<PackageRow> {
    const base = slugify(input.title) || 'package';
    const record = {
      title: input.title,
      description: input.description,
      cover_image_path: coverImagePath,
      price: input.price,
      duration: input.duration,
      rating: input.rating,
      location: input.location,
      region: input.region,
      type: input.type,
      difficulty: input.difficulty ?? null,
      group_size: input.groupSize,
      is_featured: input.isFeatured,
      special_request_allowed: input.specialRequestAllowed,
      inclusions: input.inclusions,
      exclusions: input.exclusions,
      itinerary: input.itinerary,
      tiers: input.tiers,
      status: input.status,
    };

    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
      const { data, error } = await this.db
        .from('packages')
        .insert({ ...record, slug })
        .select(SELECT_COLS)
        .single();
      if (!error) {
        this.cache.delByPrefix(PUBLIC_CACHE_PREFIX);
        return data as unknown as PackageRow;
      }
      // 23505 = unique_violation (slug taken) — try the next suffix.
      if (error.code !== '23505') {
        await this.removeCover(coverImagePath);
        throw error;
      }
    }
    await this.removeCover(coverImagePath);
    throw new Error('Could not generate a unique slug. Try a different title.');
  }

  /** Update fields, optionally swapping the cover image path. Slug is left unchanged. */
  async update(
    id: string,
    input: PackageInput,
    newCoverImagePath: string | null,
  ): Promise<PackageRow> {
    const record: Record<string, unknown> = {
      title: input.title,
      description: input.description,
      price: input.price,
      duration: input.duration,
      rating: input.rating,
      location: input.location,
      region: input.region,
      type: input.type,
      difficulty: input.difficulty ?? null,
      group_size: input.groupSize,
      is_featured: input.isFeatured,
      special_request_allowed: input.specialRequestAllowed,
      inclusions: input.inclusions,
      exclusions: input.exclusions,
      itinerary: input.itinerary,
      tiers: input.tiers,
      status: input.status,
    };
    if (newCoverImagePath) record.cover_image_path = newCoverImagePath;

    const { data, error } = await this.db
      .from('packages')
      .update(record)
      .eq('id', id)
      .select(SELECT_COLS)
      .single();
    if (error) throw error;
    this.cache.delByPrefix(PUBLIC_CACHE_PREFIX);
    return data as unknown as PackageRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('packages').delete().eq('id', id);
    if (error) throw error;
    this.cache.delByPrefix(PUBLIC_CACHE_PREFIX);
  }
}
