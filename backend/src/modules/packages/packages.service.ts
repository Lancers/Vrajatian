import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageInput, PackageResponse } from './package.dto';
import { PackageRow, PackagesRepository } from './packages.repository';

@Injectable()
export class PackagesService {
  constructor(private readonly repo: PackagesRepository) {}

  private toResponse(row: PackageRow): PackageResponse {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? '',
      image: this.repo.publicImageUrl(row.cover_image_path),
      price: Number(row.price),
      duration: row.duration,
      rating: row.rating == null ? 0 : Number(row.rating),
      location: row.location,
      region: row.region,
      type: row.type,
      difficulty: row.difficulty,
      groupSize: row.group_size,
      isFeatured: row.is_featured,
      specialRequestAllowed: row.special_request_allowed,
      inclusions: row.inclusions ?? [],
      exclusions: row.exclusions ?? [],
      itinerary: row.itinerary ?? [],
      tiers: row.tiers ?? [],
      status: row.status,
    };
  }

  // ── Public ──────────────────────────────────────────────────────────────
  async listPublished(type?: string): Promise<PackageResponse[]> {
    return (await this.repo.listPublished(type)).map((r) => this.toResponse(r));
  }

  async getPublishedBySlug(slug: string): Promise<PackageResponse> {
    const row = await this.repo.findPublishedBySlug(slug);
    if (!row) throw new NotFoundException('Package not found.');
    return this.toResponse(row);
  }

  /** Used by booking-requests to validate a packageId and snapshot its title/price. */
  async getPublishedById(id: string): Promise<PackageResponse> {
    const row = await this.repo.findById(id);
    if (!row || row.status !== 'published') throw new NotFoundException('Package not found.');
    return this.toResponse(row);
  }

  // ── Admin ───────────────────────────────────────────────────────────────
  async listAll(type?: string): Promise<PackageResponse[]> {
    return (await this.repo.listAll(type)).map((r) => this.toResponse(r));
  }

  async create(input: PackageInput, image: Express.Multer.File): Promise<PackageResponse> {
    const coverPath = await this.repo.uploadCover(image);
    const row = await this.repo.insert(input, coverPath);
    return this.toResponse(row);
  }

  async update(
    id: string,
    input: PackageInput,
    image?: Express.Multer.File,
  ): Promise<PackageResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Package not found.');

    let newPath: string | null = null;
    if (image) newPath = await this.repo.uploadCover(image);

    let row: PackageRow;
    try {
      row = await this.repo.update(id, input, newPath);
    } catch (err) {
      // Update failed — don't leave the freshly uploaded image orphaned.
      if (newPath) await this.repo.removeCover(newPath);
      throw err;
    }

    // Update succeeded — remove the image the new one replaced.
    if (newPath && existing.cover_image_path && existing.cover_image_path !== newPath) {
      await this.repo.removeCover(existing.cover_image_path);
    }
    return this.toResponse(row);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Package not found.');
    await this.repo.delete(id);
    await this.repo.removeCover(existing.cover_image_path);
  }
}
