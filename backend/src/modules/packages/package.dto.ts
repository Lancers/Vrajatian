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

/** One optional price tier (Basic/Value/Deluxe) as stored/sent. */
export const tierSchema = z.object({
  name: z.enum(['Basic', 'Value', 'Deluxe']),
  price: z.coerce.number().nonnegative('Tier price must be zero or more'),
  description: z.string().default(''),
});

export const packageTypes = ['trip', 'activity', 'education', 'corporate'] as const;

export const packageInputSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().default(''),
    price: z.coerce.number().nonnegative('Price must be zero or more'),
    duration: z.string().trim().min(1, 'Duration is required'),
    location: z.string().trim().min(1, 'Location is required'),
    region: z.string().trim().min(1, 'Region is required'),
    type: z.enum(packageTypes).default('trip'),
    // Difficulty only applies to activities — optional here, enforced below.
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    groupSize: z.coerce.number().int().positive().default(10),
    rating: z.coerce.number().min(0, 'Rating must be 0–5').max(5, 'Rating must be 0–5').default(4.8),
    isFeatured: formBoolean.default(false),
    specialRequestAllowed: formBoolean.default(true),
    inclusions: jsonArray(z.string()).default([]),
    exclusions: jsonArray(z.string()).default([]),
    itinerary: jsonArray(itineraryDaySchema).default([]),
    tiers: jsonArray(tierSchema).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'activity' && !data.difficulty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['difficulty'],
        message: 'Difficulty is required for activities',
      });
    }
    if (data.tiers.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tiers'],
        message: 'At most 3 tiers (Basic/Value/Deluxe)',
      });
    }
  })
  .transform((data) => ({
    ...data,
    // Difficulty only makes sense for activities — drop it for every other type
    // so switching a package's type away from "activity" doesn't leave a stale value.
    difficulty: data.type === 'activity' ? data.difficulty : undefined,
  }));

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
  type: (typeof packageTypes)[number];
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  groupSize: number;
  isFeatured: boolean;
  specialRequestAllowed: boolean;
  inclusions: string[];
  exclusions: string[];
  itinerary: z.infer<typeof itineraryDaySchema>[];
  tiers: z.infer<typeof tierSchema>[];
  status: 'draft' | 'published';
}
