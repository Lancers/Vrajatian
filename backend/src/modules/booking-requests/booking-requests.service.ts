import { randomUUID } from 'crypto';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { PackagesService } from '../packages/packages.service';
import {
  AdminBookingStatusUpdateInput,
  BookingRequestInput,
  BookingRequestResponse,
  BookingRequestStatus,
} from './booking-request.dto';

interface BookingRequestRow {
  id: string;
  package_id: string | null;
  package_title: string;
  package_price: number | string;
  start_date: string;
  travelers: number;
  full_name: string;
  email: string;
  phone: string;
  special_requests: string | null;
  status: BookingRequestStatus;
  user_id: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

const SELECT_COLS =
  'id, package_id, package_title, package_price, start_date, travelers, ' +
  'full_name, email, phone, special_requests, status, user_id, admin_note, created_at, updated_at';

/**
 * No separate repository layer here, unlike packages/ — this module is just
 * insert-row/list-rows/flip-a-status-flag with no retries, uploads, or cache
 * to justify splitting DB access out from the (already thin) business logic.
 */
@Injectable()
export class BookingRequestsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly packages: PackagesService,
  ) {}

  private get db() {
    return this.supabase.admin;
  }

  private toResponse(row: BookingRequestRow): BookingRequestResponse {
    return {
      id: row.id,
      packageId: row.package_id,
      packageTitle: row.package_title,
      packagePrice: Number(row.package_price),
      startDate: row.start_date,
      travelers: row.travelers,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      specialRequests: row.special_requests ?? '',
      status: row.status,
      userId: row.user_id,
      adminNote: row.admin_note,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /** Honeypot caught it — pretend success without touching the DB or the bot gets a signal to adapt. */
  private fakeSuccessResponse(input: BookingRequestInput): BookingRequestResponse {
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      packageId: input.packageId,
      packageTitle: '',
      packagePrice: 0,
      startDate: input.startDate,
      travelers: input.travelers,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      specialRequests: input.specialRequests,
      status: 'new',
      userId: null,
      adminNote: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  // ── Public ──────────────────────────────────────────────────────────────
  /**
   * `userId` comes from an optional bearer token the controller already
   * verified (or null for a guest submission) — never from the request body,
   * so a client can never link a request to someone else's account.
   */
  async create(input: BookingRequestInput, userId: string | null): Promise<BookingRequestResponse> {
    if (input.website) return this.fakeSuccessResponse(input);

    // TODO(CAPTCHA): once a Turnstile/reCAPTCHA site key exists, verify
    // input.captchaToken here (call the provider's siteverify endpoint) and
    // throw a BadRequestException on failure — before the package lookup.
    // captchaToken is accepted above but currently unvalidated.

    const pkg = await this.packages.getPublishedById(input.packageId);

    const record = {
      package_id: pkg.id,
      package_title: pkg.title,
      package_price: pkg.price,
      start_date: input.startDate,
      travelers: input.travelers,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      special_requests: input.specialRequests,
      user_id: userId,
    };

    const { data, error } = await this.db
      .from('booking_requests')
      .insert(record)
      .select(SELECT_COLS)
      .single();

    if (error) {
      // Supabase's PostgrestError comes back as a plain {code, message, ...}
      // object, not a real Error instance — check the message structurally.
      if (/rate_limited/i.test(error.message)) {
        throw new HttpException(
          'Too many booking requests — please wait a few minutes and try again.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw error;
    }

    return this.toResponse(data as unknown as BookingRequestRow);
  }

  async listForUser(userId: string): Promise<BookingRequestResponse[]> {
    const { data, error } = await this.db
      .from('booking_requests')
      .select(SELECT_COLS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as BookingRequestRow[]).map((r) => this.toResponse(r));
  }

  // ── Admin ───────────────────────────────────────────────────────────────
  async listAll(): Promise<BookingRequestResponse[]> {
    const { data, error } = await this.db
      .from('booking_requests')
      .select(SELECT_COLS)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as BookingRequestRow[]).map((r) => this.toResponse(r));
  }

  async updateStatus(id: string, input: AdminBookingStatusUpdateInput): Promise<BookingRequestResponse> {
    const { data, error } = await this.db
      .from('booking_requests')
      .update({ status: input.status, admin_note: input.adminNote ?? null })
      .eq('id', id)
      .select(SELECT_COLS)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Booking request not found.');
    return this.toResponse(data as unknown as BookingRequestRow);
  }
}
