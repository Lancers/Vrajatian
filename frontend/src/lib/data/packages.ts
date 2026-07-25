import { api } from "src/lib/api"

export interface ItineraryDay {
  day: number
  title: string
  description: string
}

export interface TravelPackage {
  id: string
  slug: string
  title: string
  description: string
  image: string
  price: number
  duration: string
  rating: number
  location: string
  region: string
  difficulty: "Easy" | "Medium" | "Hard"
  groupSize: number
  isFeatured: boolean
  inclusions: string[]
  itinerary: ItineraryDay[]
  status: "draft" | "published"
}

export interface NewPackageInput {
  title: string
  description: string
  price: number
  duration: string
  location: string
  region: string
  difficulty: TravelPackage["difficulty"]
  groupSize: number
  rating: number
  isFeatured: boolean
  inclusions: string[]
  itinerary: ItineraryDay[]
  status: TravelPackage["status"]
}

/** Serialize a package into multipart form data for the API (arrays as JSON, image as a file). */
function toFormData(input: NewPackageInput, imageFile?: File | null): FormData {
  const fd = new FormData()
  fd.append("title", input.title)
  fd.append("description", input.description)
  fd.append("price", String(input.price))
  fd.append("duration", input.duration)
  fd.append("location", input.location)
  fd.append("region", input.region)
  fd.append("difficulty", input.difficulty)
  fd.append("groupSize", String(input.groupSize))
  fd.append("rating", String(input.rating))
  fd.append("isFeatured", String(input.isFeatured))
  fd.append("inclusions", JSON.stringify(input.inclusions))
  fd.append("itinerary", JSON.stringify(input.itinerary))
  fd.append("status", input.status)
  if (imageFile) fd.append("image", imageFile)
  return fd
}

/** Published packages only — used by every public-facing page. */
export async function getPackages(): Promise<TravelPackage[]> {
  return api.get<TravelPackage[]>("/packages")
}

/** A single published package by slug, or null. */
export async function getPackageBySlug(slug: string): Promise<TravelPackage | null> {
  return api.getOrNull<TravelPackage>(`/packages/${encodeURIComponent(slug)}`)
}

/** Every package incl. drafts — admin only (the API enforces admin access). */
export async function getAllPackages(): Promise<TravelPackage[]> {
  return api.getAuthed<TravelPackage[]>("/admin/packages")
}

/** Create a package with its cover image. */
export async function createPackage(
  input: NewPackageInput,
  imageFile: File,
): Promise<TravelPackage> {
  return api.sendForm<TravelPackage>("POST", "/admin/packages", toFormData(input, imageFile))
}

/**
 * Update a package. Pass `imageFile` to replace the cover photo; omit it to
 * keep the current image.
 */
export async function updatePackage(
  id: string,
  input: NewPackageInput,
  imageFile?: File | null,
): Promise<TravelPackage> {
  return api.sendForm<TravelPackage>(
    "PATCH",
    `/admin/packages/${id}`,
    toFormData(input, imageFile),
  )
}

/** Delete a package and its cover image. */
export async function deletePackage(id: string): Promise<void> {
  await api.del(`/admin/packages/${id}`)
}

/**
 * Is the signed-in user on the admin allow-list? The API answers with 401/403
 * for everyone else, so a thrown error means "no".
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    await api.getAuthed<{ id: string; email?: string }>("/admin/me")
    return true
  } catch {
    return false
  }
}
