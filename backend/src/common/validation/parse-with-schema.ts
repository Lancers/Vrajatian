import { BadRequestException } from '@nestjs/common';
import { ZodType, ZodTypeDef } from 'zod';

/**
 * Validates `body` against `schema`, throwing a 400 with field messages on
 * failure. Typed as ZodType<T, ZodTypeDef, any> rather than the simpler
 * ZodSchema<T> — the latter binds Input to the same T as Output, which loses
 * the "required after .default()" narrowing on the inferred return type.
 */
export function parseWithSchema<T>(schema: ZodType<T, ZodTypeDef, any>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestException(parsed.error.issues.map((i) => i.message));
  }
  return parsed.data;
}
