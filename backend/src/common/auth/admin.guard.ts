import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { getAuthedUser } from './get-authed-user';

/**
 * Protects admin routes. Verifies the Supabase JWT from the Authorization
 * header, then checks the user is on the `admins` allow-list. Mirrors the RLS
 * rule `public.is_admin()` so the API and direct-read paths agree on who's an
 * admin — but here it's enforced in code because these endpoints write with the
 * service-role key (which bypasses RLS).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const user = await getAuthedUser(req, this.supabase);

    if (!(await this.supabase.isAdmin(user.id))) {
      throw new ForbiddenException('Admin access required.');
    }

    req.user = { id: user.id, email: user.email };
    return true;
  }
}
