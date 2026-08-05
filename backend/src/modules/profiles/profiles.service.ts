import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { ProfileResponse, ProfileUpdateInput } from './profile.dto';

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

const SELECT_COLS = 'id, email, full_name, phone, created_at, updated_at';

@Injectable()
export class ProfilesService {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  private toResponse(row: ProfileRow): ProfileResponse {
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Reads the profile created by the `on_auth_user_created` DB trigger. Falls
   * back to creating it here if the trigger somehow hasn't fired yet (e.g. a
   * pre-existing account from before this table existed) — defense in depth,
   * not the primary creation path.
   */
  async getOrCreate(userId: string, email: string | undefined): Promise<ProfileResponse> {
    const { data, error } = await this.db.from('profiles').select(SELECT_COLS).eq('id', userId).maybeSingle();
    if (error) throw error;
    if (data) return this.toResponse(data as unknown as ProfileRow);

    const { data: created, error: insertError } = await this.db
      .from('profiles')
      .insert({ id: userId, email: email ?? null })
      .select(SELECT_COLS)
      .single();
    if (insertError) throw insertError;
    return this.toResponse(created as unknown as ProfileRow);
  }

  async update(userId: string, input: ProfileUpdateInput): Promise<ProfileResponse> {
    const patch: Record<string, string> = {};
    if (input.fullName !== undefined) patch.full_name = input.fullName;
    if (input.phone !== undefined) patch.phone = input.phone;

    const { data, error } = await this.db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select(SELECT_COLS)
      .single();
    if (error) throw error;
    return this.toResponse(data as unknown as ProfileRow);
  }
}
