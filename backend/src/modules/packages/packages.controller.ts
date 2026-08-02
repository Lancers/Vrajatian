import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackageResponse } from './package.dto';

/**
 * PUBLIC catalog endpoints — no auth. Only ever return published packages.
 *   GET /api/v1/packages
 *   GET /api/v1/packages/:slug
 */
@Controller('packages')
export class PackagesController {
  constructor(private readonly packages: PackagesService) {}

  @Get()
  list(@Query('type') type?: string): Promise<PackageResponse[]> {
    return this.packages.listPublished(type);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string): Promise<PackageResponse> {
    if (!slug) throw new BadRequestException('Slug is required.');
    return this.packages.getPublishedBySlug(slug);
  }
}
