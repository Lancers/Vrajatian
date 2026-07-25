import { Inject, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { AppConfig, CONFIG } from '../config/config';

/**
 * Owns the Supabase clients. The service-role client bypasses RLS and is the
 * ONLY thing that writes to the DB / storage — it must never leave the server.
 * Authorization is enforced in the backend guards, not by RLS, on these paths.
 */
@Injectable()
export class SupabaseService {
  /** Full-access client (service role). Server-only. */
  readonly admin: SupabaseClient;

  constructor(@Inject(CONFIG) private readonly config: AppConfig) {
    this.admin = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }

  /** Validate a Supabase-issued access token and return the user, or null. */
  async getUserFromToken(accessToken: string): Promise<User | null> {
    const { data, error } = await this.admin.auth.getUser(accessToken);
    if (error || !data.user) return null;
    return data.user;
  }

  /** Is this user on the admin allow-list? (checks `public.admins`) */
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await this.admin
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return false;
    return !!data;
  }

  get bucket(): string {
    return this.config.PACKAGE_IMAGE_BUCKET;
  }
}
