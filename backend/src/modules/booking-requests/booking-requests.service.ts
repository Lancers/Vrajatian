import { randomUUID } from 'crypto';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { PackagesService } from '../packages/packages.service';
import { BookingRequestInput, BookingRequestResponse, BookingRequestUpdate, TravelerDetail } from './booking-request.dto';

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
  status: 'new' | 'contacted';
  traveler_details: TravelerDetail[] | null;
  created_at: string;
}

const SELECT_COLS =
  'id, package_id, package_title, package_price, start_date, travelers, ' +
  'full_name, email, phone, special_requests, status, traveler_details, created_at';

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
      travelerDetails: row.traveler_details ?? [],
      createdAt: row.created_at,
    };
  }

  /** Honeypot caught it — pretend success without touching the DB or the bot gets a signal to adapt. */
  private fakeSuccessResponse(input: BookingRequestInput): BookingRequestResponse {
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
      travelerDetails: [],
      createdAt: new Date().toISOString(),
    };
  }

  // ── Public ──────────────────────────────────────────────────────────────
  async create(input: BookingRequestInput): Promise<BookingRequestResponse> {
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

  // ── Admin ───────────────────────────────────────────────────────────────
  async listAll(): Promise<BookingRequestResponse[]> {
    const { data, error } = await this.db
      .from('booking_requests')
      .select(SELECT_COLS)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as BookingRequestRow[]).map((r) => this.toResponse(r));
  }

  async markContacted(id: string): Promise<BookingRequestResponse> {
    const { data, error } = await this.db
      .from('booking_requests')
      .update({ status: 'contacted' })
      .eq('id', id)
      .select(SELECT_COLS)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Booking request not found.');
    return this.toResponse(data as unknown as BookingRequestRow);
  }

  async update(id: string, patch: BookingRequestUpdate): Promise<BookingRequestResponse> {
    const record: Record<string, unknown> = {};
    if (patch.startDate !== undefined) record.start_date = patch.startDate;
    if (patch.travelers !== undefined) record.travelers = patch.travelers;
    if (patch.fullName !== undefined) record.full_name = patch.fullName;
    if (patch.email !== undefined) record.email = patch.email;
    if (patch.phone !== undefined) record.phone = patch.phone;
    if (patch.specialRequests !== undefined) record.special_requests = patch.specialRequests;
    if (patch.status !== undefined) record.status = patch.status;
    if (patch.travelerDetails !== undefined) record.traveler_details = patch.travelerDetails;

    const { data, error } = await this.db
      .from('booking_requests')
      .update(record)
      .eq('id', id)
      .select(SELECT_COLS)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Booking request not found.');
    return this.toResponse(data as unknown as BookingRequestRow);
  }

  async remove(id: string): Promise<void> {
    const { error, count } = await this.db
      .from('booking_requests')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw error;
    if (!count) throw new NotFoundException('Booking request not found.');
  }
}
