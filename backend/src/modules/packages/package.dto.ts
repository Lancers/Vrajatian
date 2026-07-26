import { z } from 'zod';

/** One itinerary day as stored/sent. */
export const itineraryDaySchema = z.object({
  day: z.coerce.number().int(),
  title: z.string(),
  description: z.string().default(''),
});

/**
 * Validated package input. Multipart form fields arrive as strings, so array
 * fields are JSON-parsed and numeric fields coerced before validation.
 */
const jsonArray = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess((v) => {
    if (typeof v === 'string') {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    }
    return v ?? [];
  }, z.array(inner));

/** Multipart sends booleans as the strings "true"/"false". */
const formBoolean = z.preprocess(
  (v) => (typeof v === 'string' ? v === 'true' || v === '1' : (v ?? false)),
  z.boolean(),
);

export const packageInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().default(''),
  price: z.coerce.number().nonnegative('Price must be zero or more'),
  duration: z.string().trim().min(1, 'Duration is required'),
  location: z.string().trim().min(1, 'Location is required'),
  region: z.string().trim().min(1, 'Region is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Easy'),
  groupSize: z.coerce.number().int().positive().default(10),
  rating: z.coerce.number().min(0, 'Rating must be 0–5').max(5, 'Rating must be 0–5').default(4.8),
  isFeatured: formBoolean.default(false),
  inclusions: jsonArray(z.string()).default([]),
  itinerary: jsonArray(itineraryDaySchema).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type PackageInput = z.infer<typeof packageInputSchema>;

/** Shape returned to clients — camelCase, cover path resolved to a public URL. */
export interface PackageResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  location: string;
  region: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  groupSize: number;
  isFeatured: boolean;
  inclusions: string[];
  itinerary: z.infer<typeof itineraryDaySchema>[];
  status: 'draft' | 'published';
}
