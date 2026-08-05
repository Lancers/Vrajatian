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

export type BookingRequestStatus = "new" | "contacted" | "confirmed" | "declined"

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
  status: BookingRequestStatus
  travelerDetails: TravelerDetail[]
  userId: string | null
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Submit a booking request — public, no auth required. If the visitor is
 * logged in, the request is additionally linked to their account so it shows
 * up on their profile.
 */
export async function createBookingRequest(input: BookingRequestInput): Promise<BookingRequest> {
  return api.postOptionalAuth<BookingRequest>("/booking-requests", input)
}

/** The logged-in user's own trip requests. */
export async function getMyBookingRequests(): Promise<BookingRequest[]> {
  return api.getAuthed<BookingRequest[]>("/booking-requests/mine")
}

/** Every booking request — admin only (the API enforces admin access). */
export async function getAllBookingRequests(): Promise<BookingRequest[]> {
  return api.getAuthed<BookingRequest[]>("/admin/booking-requests")
}

/** Admin: move a request to contacted/confirmed/declined, optionally with a note the traveller sees. */
export async function updateBookingRequestStatus(
  id: string,
  status: Exclude<BookingRequestStatus, "new">,
  adminNote?: string,
): Promise<BookingRequest> {
  return api.patchAuthed<BookingRequest>(`/admin/booking-requests/${id}/status`, { status, adminNote })
}

/** @deprecated kept only for the not-yet-rewritten AdminTripRequests row action; drop once that's updated. */
export async function markBookingRequestContacted(id: string): Promise<BookingRequest> {
  return updateBookingRequestStatus(id, "contacted")
}

/** Shared status -> StatusBadge tone mapping (profile + admin views agree on this). */
export const STATUS_TONE: Record<BookingRequestStatus, "positive" | "neutral" | "accent" | "negative"> = {
  new: "neutral",
  contacted: "accent",
  confirmed: "positive",
  declined: "negative",
}

export const STATUS_LABEL: Record<BookingRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  declined: "Declined",
}

export interface BookingRequestUpdate {
  startDate?: string
  travelers?: number
  fullName?: string
  email?: string
  phone?: string
  specialRequests?: string
  status?: BookingRequestStatus
  travelerDetails?: TravelerDetail[]
}

/**
 * Edit a booking request's customer-submitted fields and/or traveler
 * details. Status transitions go through `updateBookingRequestStatus`
 * instead — kept separate so there's one place that changes status.
 */
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
