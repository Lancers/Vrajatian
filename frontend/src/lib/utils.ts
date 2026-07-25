import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Package `duration` is free text typed by an admin (e.g. "4days3nights",
 * "4days 3nights") — normalize spacing/punctuation for display without
 * touching the stored value. Safe no-op on already-clean input like
 * "5 Days, 4 Nights".
 */
export function formatDuration(duration: string): string {
  return duration
    .replace(/(\d)\s*([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])\s*(\d)/g, "$1, $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * "2026-01-09" (or any ISO datetime with that date prefix) -> "09-01-2026".
 * Parses the string directly rather than via `new Date(...)` — the latter is
 * a timezone trap for pure date-only values (a UTC-midnight ISO date can read
 * back as the previous day once passed through local-timezone getters).
 */
export function formatDateDDMMYYYY(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return isoDate
  const [, yyyy, mm, dd] = match
  return `${dd}-${mm}-${yyyy}`
}
