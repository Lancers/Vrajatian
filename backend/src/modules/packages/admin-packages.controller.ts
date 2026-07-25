import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../common/auth/admin.guard';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { PackagesService } from './packages.service';
import { PackageResponse, packageInputSchema } from './package.dto';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

// Cheap fail-fast check. The authoritative type check (real file bytes, not
// the client-declared Content-Type) happens in PackagesRepository.uploadCover.
function validateImageSize(file: Express.Multer.File) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new BadRequestException('Cover image must be 5 MB or smaller.');
  }
}

/**
 * ADMIN management endpoints — guarded (Supabase JWT + admin allow-list).
 *   GET    /api/v1/admin/packages
 *   POST   /api/v1/admin/packages         (multipart: fields + `image`)
 *   PATCH  /api/v1/admin/packages/:id     (multipart: fields + optional `image`)
 *   DELETE /api/v1/admin/packages/:id
 */
@Controller('admin/packages')
@UseGuards(AdminGuard)
export class AdminPackagesController {
  constructor(private readonly packages: PackagesService) {}

  @Get()
  listAll(): Promise<PackageResponse[]> {
    return this.packages.listAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() body: Record<string, unknown>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<PackageResponse> {
    if (!image) throw new BadRequestException('A cover image is required.');
    validateImageSize(image);
    return this.packages.create(parseWithSchema(packageInputSchema, body), image);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<PackageResponse> {
    if (image) validateImageSize(image);
    return this.packages.update(id, parseWithSchema(packageInputSchema, body), image);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.packages.remove(id);
  }
}
