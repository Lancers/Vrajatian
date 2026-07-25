import { z } from 'zod';

/**
 * Typed, validated environment config. Parsed once at boot so a missing or
 * malformed variable fails fast with a clear message instead of surfacing as a
 * confusing runtime error later.
 */
const schema = z.object({
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PACKAGE_IMAGE_BUCKET: z.string().default('package-images'),
});

export type AppConfig = z.infer<typeof schema> & { corsOrigins: string[] };

export function loadConfig(): AppConfig {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return {
    ...parsed.data,
    corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  };
}

export const CONFIG = Symbol('APP_CONFIG');
