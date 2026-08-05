import { z } from 'zod';

export const profileUpdateInputSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateInputSchema>;

/** Shape returned to clients — camelCase. */
export interface ProfileResponse {
  id: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}
