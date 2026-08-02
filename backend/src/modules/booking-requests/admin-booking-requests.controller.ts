import { Body, Controller, Delete, Get, HttpCode, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/auth/admin.guard';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { BookingRequestsService } from './booking-requests.service';
import { BookingRequestResponse, bookingRequestUpdateSchema } from './booking-request.dto';

/**
 * ADMIN management endpoints — guarded (Supabase JWT + admin allow-list).
 *   GET    /api/v1/admin/booking-requests
 *   PATCH  /api/v1/admin/booking-requests/:id/contacted
 *   PATCH  /api/v1/admin/booking-requests/:id
 *   DELETE /api/v1/admin/booking-requests/:id
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ): Promise<BookingRequestResponse> {
    return this.bookingRequests.update(id, parseWithSchema(bookingRequestUpdateSchema, body));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.bookingRequests.remove(id);
  }
}
