import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { AdminPackagesController } from './admin-packages.controller';
import { PackagesService } from './packages.service';
import { PackagesRepository } from './packages.repository';

@Module({
  controllers: [PackagesController, AdminPackagesController],
  providers: [PackagesService, PackagesRepository],
  exports: [PackagesService],
})
export class PackagesModule {}
