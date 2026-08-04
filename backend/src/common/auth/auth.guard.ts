import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { getAuthedUser } from './get-authed-user';

/**
 * Protects routes that any signed-in traveller may use (not just admins) —
 * e.g. /profile and /booking-requests/mine. Verifies the Supabase JWT and
 * attaches the user; unlike AdminGuard, it does not check the admin allow-list.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const user = await getAuthedUser(req, this.supabase);

    req.user = { id: user.id, email: user.email };
    return true;
  }
}
