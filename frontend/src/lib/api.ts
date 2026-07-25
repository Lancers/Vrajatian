import { supabase } from "src/lib/supabase"

/**
 * Base URL of the Vrajatian backend API (NestJS). Override with VITE_API_URL.
 * All package data now flows through this API — the browser no longer talks to
 * the Postgres tables directly. Supabase is still used for auth (login/session).
 */
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:3000/api/v1"

/** Attach the logged-in admin's Supabase access token for guarded endpoints. */
async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handle(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = (body as { message?: string | string[] } | null)?.message
    throw new Error(
      Array.isArray(msg) ? msg.join(", ") : msg || `Request failed (${res.status})`,
    )
  }
  return body
}

export const api = {
  /** Public GET (no auth). */
  async get<T>(path: string): Promise<T> {
    return handle(await fetch(`${API_BASE}${path}`)) as Promise<T>
  },

  /** Public GET that resolves to null on a 404 instead of throwing. */
  async getOrNull<T>(path: string): Promise<T | null> {
    const res = await fetch(`${API_BASE}${path}`)
    if (res.status === 404) return null
    return handle(res) as Promise<T>
  },

  /** Authenticated GET (admin). */
  async getAuthed<T>(path: string): Promise<T> {
    return handle(await fetch(`${API_BASE}${path}`, { headers: await authHeader() })) as Promise<T>
  },

  /** Authenticated multipart POST/PATCH (admin) — sends FormData with an optional file. */
  async sendForm<T>(method: "POST" | "PATCH", path: string, form: FormData): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: await authHeader(), // do NOT set Content-Type; the browser sets the multipart boundary
      body: form,
    })
    return handle(res) as Promise<T>
  },

  /** Authenticated DELETE (admin). */
  async del(path: string): Promise<void> {
    await handle(await fetch(`${API_BASE}${path}`, { method: "DELETE", headers: await authHeader() }))
  },
}
