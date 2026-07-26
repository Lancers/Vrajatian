import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { BookingRequestsService } from './booking-requests.service';
import { BookingRequestResponse, bookingRequestInputSchema } from './booking-request.dto';

/**
 * PUBLIC — no auth. Any site visitor can submit a booking request.
 *   POST /api/v1/booking-requests
 */
@Controller('booking-requests')
export class BookingRequestsController {
  constructor(private readonly bookingRequests: BookingRequestsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @HttpCode(201)
  create(@Body() body: Record<string, unknown>): Promise<BookingRequestResponse> {
    return this.bookingRequests.create(parseWithSchema(bookingRequestInputSchema, body));
  }
}
