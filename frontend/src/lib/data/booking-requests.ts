import { api } from "src/lib/api"

export interface BookingRequestInput {
  packageId: string
  startDate: string
  travelers: number
  fullName: string
  email: string
  phone: string
  specialRequests?: string
  /** Honeypot — must stay empty. Real users never see or fill this field. */
  website?: string
  /** Unused today — reserved for a future CAPTCHA (Turnstile/reCAPTCHA) integration. */
  captchaToken?: string
}

/**
 * One traveler's name/age, added by an admin after confirming with the
 * customer — never collected on the public booking form. Kept as a single
 * object so future fields (e.g. an ID document) are just another optional
 * key here, not another migration.
 */
export interface TravelerDetail {
  name: string
  age?: number
}

export interface BookingRequest {
  id: string
  packageId: string | null
  packageTitle: string
  packagePrice: number
  startDate: string
  travelers: number
  fullName: string
  email: string
  phone: string
  specialRequests: string
  status: "new" | "contacted"
  travelerDetails: TravelerDetail[]
  createdAt: string
}

/** Submit a booking request — public, no auth required. */
export async function createBookingRequest(input: BookingRequestInput): Promise<BookingRequest> {
  return api.post<BookingRequest>("/booking-requests", input)
}

/** Every booking request — admin only (the API enforces admin access). */
export async function getAllBookingRequests(): Promise<BookingRequest[]> {
  return api.getAuthed<BookingRequest[]>("/admin/booking-requests")
}

/** Mark a booking request as contacted. */
export async function markBookingRequestContacted(id: string): Promise<BookingRequest> {
  return api.patchAuthed<BookingRequest>(`/admin/booking-requests/${id}/contacted`, {})
}

export interface BookingRequestUpdate {
  startDate?: string
  travelers?: number
  fullName?: string
  email?: string
  phone?: string
  specialRequests?: string
  status?: "new" | "contacted"
  travelerDetails?: TravelerDetail[]
}

/** Edit a booking request's customer-submitted fields and/or status. */
export async function updateBookingRequest(
  id: string,
  patch: BookingRequestUpdate,
): Promise<BookingRequest> {
  return api.patchAuthed<BookingRequest>(`/admin/booking-requests/${id}`, patch)
}

/** Permanently delete a booking request. */
export async function deleteBookingRequest(id: string): Promise<void> {
  await api.del(`/admin/booking-requests/${id}`)
}
