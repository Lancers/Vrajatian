import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Shared by AdminGuard and AuthGuard: pulls the bearer token off the request,
 * verifies it against Supabase, and returns the user — or throws 401. Neither
 * guard should duplicate this parsing/verification logic.
 */
export async function getAuthedUser(req: Request, supabase: SupabaseService): Promise<User> {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new UnauthorizedException('Missing bearer token.');
  }

  const user = await supabase.getUserFromToken(token);
  if (!user) throw new UnauthorizedException('Invalid or expired session.');

  return user;
}
