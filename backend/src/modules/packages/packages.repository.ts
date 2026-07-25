import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { PackageInput } from './package.dto';

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
  difficulty: 'Easy' | 'Medium' | 'Hard';
  group_size: number;
  is_featured: boolean;
  inclusions: string[] | null;
  itinerary: { day: number; title: string; description: string }[] | null;
  status: 'draft' | 'published';
}

const SELECT_COLS =
  'id, slug, title, description, cover_image_path, price, duration, rating, ' +
  'location, region, difficulty, group_size, is_featured, inclusions, itinerary, status';

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
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  publicImageUrl(path: string | null): string {
    if (!path) return '';
    return this.db.storage.from(this.supabase.bucket).getPublicUrl(path).data.publicUrl;
  }

  async listPublished(): Promise<PackageRow[]> {
    const { data, error } = await this.db
      .from('packages')
      .select(SELECT_COLS)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as PackageRow[];
  }

  async listAll(): Promise<PackageRow[]> {
    const { data, error } = await this.db
      .from('packages')
      .select(SELECT_COLS)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as PackageRow[];
  }

  async findPublishedBySlug(slug: string): Promise<PackageRow | null> {
    const { data, error } = await this.db
      .from('packages')
      .select(SELECT_COLS)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as PackageRow) ?? null;
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

  async uploadCover(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await this.db.storage
      .from(this.supabase.bucket)
      .upload(path, file.buffer, { contentType: file.mimetype, cacheControl: '3600', upsert: false });
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
      difficulty: input.difficulty,
      group_size: input.groupSize,
      is_featured: input.isFeatured,
      inclusions: input.inclusions,
      itinerary: input.itinerary,
      status: input.status,
    };

    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
      const { data, error } = await this.db
        .from('packages')
        .insert({ ...record, slug })
        .select(SELECT_COLS)
        .single();
      if (!error) return data as unknown as PackageRow;
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
      difficulty: input.difficulty,
      group_size: input.groupSize,
      is_featured: input.isFeatured,
      inclusions: input.inclusions,
      itinerary: input.itinerary,
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
    return data as unknown as PackageRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('packages').delete().eq('id', id);
    if (error) throw error;
  }
}
