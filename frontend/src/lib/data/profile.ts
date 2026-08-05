import { api } from "src/lib/api"

export interface Profile {
  id: string
  email: string | null
  fullName: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface ProfileUpdateInput {
  fullName?: string
  phone?: string
}

/** The logged-in user's own profile — auth required. */
export async function getMyProfile(): Promise<Profile> {
  return api.getAuthed<Profile>("/profile")
}

export async function updateMyProfile(input: ProfileUpdateInput): Promise<Profile> {
  return api.patchAuthed<Profile>("/profile", input)
}
