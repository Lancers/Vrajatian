import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/auth/admin.guard';
import { BookingRequestsService } from './booking-requests.service';
import { BookingRequestResponse } from './booking-request.dto';

/**
 * ADMIN management endpoints — guarded (Supabase JWT + admin allow-list).
 *   GET   /api/v1/admin/booking-requests
 *   PATCH /api/v1/admin/booking-requests/:id/contacted
 */
@Controller('admin/booking-requests')
@UseGuards(AdminGuard)
export class AdminBookingRequestsController {
  constructor(private readonly bookingRequests: BookingRequestsService) {}

  @Get()
  listAll(): Promise<BookingRequestResponse[]> {
    return this.bookingRequests.listAll();
  }

  @Patch(':id/contacted')
  markContacted(@Param('id') id: string): Promise<BookingRequestResponse> {
    return this.bookingRequests.markContacted(id);
  }
}
