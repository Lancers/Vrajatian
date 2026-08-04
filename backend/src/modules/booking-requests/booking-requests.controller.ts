import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { BookingRequestsService } from './booking-requests.service';
import { BookingRequestResponse, bookingRequestInputSchema } from './booking-request.dto';

interface AuthedRequest extends Request {
  user?: { id: string; email?: string };
}

/**
 * POST is PUBLIC — no auth required, any site visitor can submit a booking
 * request. If a bearer token happens to be present it's used to link the
 * request to that account, but a missing/invalid token must never reject the
 * submission — that would break the guest-booking path.
 *   POST /api/v1/booking-requests
 *   GET  /api/v1/booking-requests/mine  (requires auth)
 */
@Controller('booking-requests')
export class BookingRequestsController {
  constructor(
    private readonly bookingRequests: BookingRequestsService,
    private readonly supabase: SupabaseService,
  ) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @HttpCode(201)
  async create(@Req() req: Request, @Body() body: Record<string, unknown>): Promise<BookingRequestResponse> {
    const userId = await this.resolveOptionalUserId(req);
    return this.bookingRequests.create(parseWithSchema(bookingRequestInputSchema, body), userId);
  }

  @Get('mine')
  @UseGuards(AuthGuard)
  listMine(@Req() req: AuthedRequest): Promise<BookingRequestResponse[]> {
    return this.bookingRequests.listForUser(req.user!.id);
  }

  private async resolveOptionalUserId(req: Request): Promise<string | null> {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

    const user = await this.supabase.getUserFromToken(token);
    return user?.id ?? null;
  }
}
