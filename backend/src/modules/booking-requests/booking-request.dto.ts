import { z } from 'zod';

/**
 * Validated booking-request input. `website` is a honeypot — real users never
 * see or fill it; a non-empty value marks the submission as a bot (see
 * BookingRequestsService.create). `captchaToken` is accepted but not yet
 * verified — see the TODO(CAPTCHA) note in booking-requests.service.ts.
 */
export const bookingRequestInputSchema = z.object({
  packageId: z.string().uuid('A valid package is required.'),
  startDate: z.string().trim().min(1, 'Departure date is required.'),
  travelers: z.coerce.number().int().positive('Must have at least 1 traveller.'),
  fullName: z.string().trim().min(1, 'Full name is required.').max(120),
  email: z.string().trim().email('Please provide a valid email.').max(200),
  phone: z.string().trim().min(6, 'Please provide a valid phone number.').max(40),
  specialRequests: z.string().trim().max(2000).default(''),
  website: z.string().optional().default(''),
  captchaToken: z.string().optional(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestInputSchema>;

/** Shape returned to clients — camelCase. */
export interface BookingRequestResponse {
  id: string;
  packageId: string | null;
  packageTitle: string;
  packagePrice: number;
  startDate: string;
  travelers: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
  status: 'new' | 'contacted';
  createdAt: string;
}
