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
