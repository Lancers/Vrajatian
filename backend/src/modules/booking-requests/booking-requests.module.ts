import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PackagesModule } from '../packages/packages.module';
import { BookingRequestsController } from './booking-requests.controller';
import { AdminBookingRequestsController } from './admin-booking-requests.controller';
import { BookingRequestsService } from './booking-requests.service';

@Module({
  imports: [
    PackagesModule,
    // Scoped to this module only — /packages, /admin/*, /health are unaffected.
    ThrottlerModule.forRoot([{ ttl: 600_000, limit: 5 }]),
  ],
  controllers: [BookingRequestsController, AdminBookingRequestsController],
  providers: [BookingRequestsService],
})
export class BookingRequestsModule {}
