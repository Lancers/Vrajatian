import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/auth/admin.guard';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { BookingRequestsService } from './booking-requests.service';
import { adminBookingStatusUpdateSchema, BookingRequestResponse } from './booking-request.dto';

/**
 * ADMIN management endpoints — guarded (Supabase JWT + admin allow-list).
 *   GET   /api/v1/admin/booking-requests
 *   PATCH /api/v1/admin/booking-requests/:id/status
 */
@Controller('admin/booking-requests')
@UseGuards(AdminGuard)
export class AdminBookingRequestsController {
  constructor(private readonly bookingRequests: BookingRequestsService) {}

  @Get()
  listAll(): Promise<BookingRequestResponse[]> {
    return this.bookingRequests.listAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: Record<string, unknown>): Promise<BookingRequestResponse> {
    return this.bookingRequests.updateStatus(id, parseWithSchema(adminBookingStatusUpdateSchema, body));
  }
}
