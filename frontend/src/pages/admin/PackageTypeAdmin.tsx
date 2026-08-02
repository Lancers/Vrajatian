import { useState } from "react"
import { Pencil, Plus, Trash2, Luggage } from "lucide-react"
import { toast } from "sonner"

import { cn, formatDuration } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Checkbox } from "src/components/ui/checkbox"
import { StatusBadge } from "src/components/common/StatusBadge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import { Textarea } from "src/components/ui/textarea"
import {
  createPackage,
  deletePackage,
  updatePackage,
  type ItineraryDay,
  type NewPackageInput,
  type PackageTier,
  type PackageType,
  type TravelPackage,
} from "src/lib/data/packages"
import { INCLUSION_OPTIONS } from "src/lib/constants/inclusions"
import { EXCLUSION_OPTIONS } from "src/lib/constants/exclusions"
import { useAdminData } from "src/components/layout/AdminDataContext"

interface PackageTypeAdminProps {
  type: PackageType
  pageTitle: string
  pageDescription: string
  catalogLabel: string
  addButtonLabel: string
  /** Lowercase noun used in confirm dialogs/toasts, e.g. "package", "activity". */
  singular: string
}

type TierName = PackageTier["name"]
const TIER_NAMES: TierName[] = ["Basic", "Value", "Deluxe"]

interface FormState {
  title: string
  description: string
  price: string
  durationDays: string
  durationNights: string
  location: string
  region: string
  difficulty: NonNullable<TravelPackage["difficulty"]>
  groupSize: string
  rating: string
  isFeatured: boolean
  specialRequestAllowed: boolean
  inclusions: string[]
  exclusions: string[]
  tierPrices: Record<TierName, string>
  itinerary: ItineraryDay[]
  status: TravelPackage["status"]
}

function emptyForm(): FormState {
  return {
    title: "",
    description: "",
    price: "",
    durationDays: "1",
    durationNights: "0",
    location: "",
    region: "Kerala",
    difficulty: "Easy",
    groupSize: "10",
    rating: "4.8",
    isFeatured: false,
    specialRequestAllowed: true,
    inclusions: [],
    exclusions: [],
    tierPrices: { Basic: "", Value: "", Deluxe: "" },
    itinerary: [],
    status: "published",
  }
}

function buildDurationString(days: number, nights: number): string {
  return `${days} ${days === 1 ? "Day" : "Days"}, ${nights} ${nights === 1 ? "Night" : "Nights"}`
}

/** Best-effort split of an existing (possibly messy, pre-structured-input) duration string. */
function parseDurationParts(duration: string): { days: string; nights: string } {
  const numbers = duration.match(/\d+/g)
  const days = numbers?.[0] ?? "1"
  const nights = numbers?.[1] ?? "0"
  return { days, nights }
}

// Populate the form fields from an existing package for editing.
function packageToForm(pkg: TravelPackage): FormState {
  const { days, nights } = parseDurationParts(pkg.duration)
  const tierPrices: Record<TierName, string> = { Basic: "", Value: "", Deluxe: "" }
  for (const tier of pkg.tiers) tierPrices[tier.name] = String(tier.price)
  return {
    title: pkg.title,
    description: pkg.description,
    price: String(pkg.price),
    durationDays: days,
    durationNights: nights,
    location: pkg.location,
    region: pkg.region,
    difficulty: pkg.difficulty ?? "Easy",
    groupSize: String(pkg.groupSize),
    rating: String(pkg.rating),
    isFeatured: pkg.isFeatured,
    specialRequestAllowed: pkg.specialRequestAllowed,
    inclusions: pkg.inclusions,
    exclusions: pkg.exclusions,
    tierPrices,
    itinerary: pkg.itinerary,
    status: pkg.status,
  }
}

function PackageTypeAdmin({
  type,
  pageTitle,
  pageDescription,
  catalogLabel,
  addButtonLabel,
  singular,
}: PackageTypeAdminProps) {
  const { packages, refreshPackages } = useAdminData()
  const items = packages.filter((pkg) => pkg.type === type)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editing, setEditing] = useState<TravelPackage | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleDelete(id: string) {
    if (!window.confirm(`Are you sure you want to delete this ${singular}?`)) return
    try {
      await deletePackage(id)
      await refreshPackages()
      toast.success(`${singular[0].toUpperCase()}${singular.slice(1)} deleted.`)
    } catch {
      toast.error(`Could not delete the ${singular}.`)
    }
  }

  function openAddForm() {
    setEditing(null)
    setForm(emptyForm())
    setImageFile(null)
    setFormError("")
    setShowAddForm(true)
  }

  function openEditForm(pkg: TravelPackage) {
    setEditing(pkg)
    setForm(packageToForm(pkg))
    setImageFile(null)
    setFormError("")
    setShowAddForm(true)
  }

  function toggleListValue(field: "inclusions" | "exclusions", value: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }))
  }

  function addItineraryDay() {
    setForm((f) => ({
      ...f,
      itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: "", description: "" }],
    }))
  }

  function removeItineraryDay(index: number) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })),
    }))
  }

  function updateItineraryDay(index: number, field: "title" | "description", value: string) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }))
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const days = Number(form.durationDays)
    const nights = Number(form.durationNights)
    if (!form.title || !form.location || !form.price || !form.durationDays) {
      setFormError("Title, location, price, and duration are required.")
      return
    }
    if (!Number.isInteger(days) || days < 1 || !Number.isInteger(nights) || nights < 0) {
      setFormError("Days must be at least 1 and nights must be 0 or more.")
      return
    }
    const rating = Number(form.rating)
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      setFormError("Rating must be a number between 0 and 5.")
      return
    }
    // A cover image is required when creating; on edit it's optional (keep current).
    if (!editing && !imageFile) {
      setFormError("Please choose a cover image to upload.")
      return
    }

    const tiers: PackageTier[] = TIER_NAMES.filter((name) => form.tierPrices[name].trim() !== "").map(
      (name) => ({ name, price: Number(form.tierPrices[name]), description: "" }),
    )
    if (tiers.some((t) => Number.isNaN(t.price) || t.price < 0)) {
      setFormError("Tier prices must be zero or more.")
      return
    }

    const input: NewPackageInput = {
      title: form.title,
      description: form.description || "Enjoy a premium guided custom travel itinerary.",
      price: Number(form.price),
      duration: buildDurationString(days, nights),
      location: form.location,
      region: form.region,
      type,
      difficulty: type === "activity" ? form.difficulty : undefined,
      groupSize: Number(form.groupSize),
      rating,
      isFeatured: form.isFeatured,
      specialRequestAllowed: form.specialRequestAllowed,
      inclusions:
        form.inclusions.length > 0
          ? form.inclusions
          : ["Premium Hotel Stay", "Local Guided Tours", "All Ground Transfers"],
      exclusions: form.exclusions,
      tiers,
      itinerary: form.itinerary
        .filter((d) => d.title.trim())
        .map((d, i) => ({ ...d, day: i + 1 })),
      status: form.status,
    }

    setSubmitting(true)
    try {
      if (editing) {
        await updatePackage(editing.id, input, imageFile)
      } else {
        await createPackage(input, imageFile as File)
      }
      await refreshPackages()
      setShowAddForm(false)
      setEditing(null)
      setForm(emptyForm())
      setImageFile(null)
      setFormError("")
      toast.success(editing ? `${singular[0].toUpperCase()}${singular.slice(1)} updated.` : `${singular[0].toUpperCase()}${singular.slice(1)} saved.`)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : `Could not save the ${singular}.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>{pageTitle}</h1>
        <p className={cn("text-muted-foreground")}>{pageDescription}</p>
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex flex-wrap items-center justify-between gap-3 p-4 border-b")}>
          <h2 className={cn("font-semibold")}>{catalogLabel}</h2>
          <Button size="sm" className="gap-1.5" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>
        <div className="divide-y">
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Nothing here yet.</p>
          ) : (
            items.map((pkg) => (
              <div key={pkg.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.title} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Luggage className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{pkg.title}</span>
                      <StatusBadge label={pkg.status} tone={pkg.status === "published" ? "positive" : "neutral"} />
                      {pkg.isFeatured && <StatusBadge label="featured" tone="accent" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{pkg.price.toLocaleString("en-IN")} • {formatDuration(pkg.duration)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditForm(pkg)}
                    aria-label={`Edit ${singular}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(pkg.id)}
                    aria-label={`Delete ${singular}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${singular}` : `Create new ${singular}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Coorg Coffee Trails"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Coorg, Karnataka"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price per person (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 25000"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationDays">Days *</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationNights">Nights</Label>
                <Input
                  id="durationNights"
                  type="number"
                  min={0}
                  value={form.durationNights}
                  onChange={(e) => setForm((f) => ({ ...f, durationNights: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                >
                  <option value="Kerala">Kerala</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Andaman & Nicobar">Andaman & Nicobar</option>
                </select>
              </div>
              {type === "activity" && (
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        difficulty: e.target.value as NonNullable<TravelPackage["difficulty"]>,
                      }))
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image {editing ? "" : "*"}</Label>
                {editing && editing.image && (
                  <div className="flex items-center gap-2">
                    <img
                      src={editing.image}
                      alt={editing.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <span className="text-xs text-muted-foreground">Current photo</span>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-sm"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {imageFile ? (
                  <p className="truncate text-xs text-muted-foreground">Selected: {imageFile.name}</p>
                ) : editing ? (
                  <p className="text-xs text-muted-foreground">
                    Upload a new photo to replace the current one, or leave empty to keep it.
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size Limit</Label>
                <Input
                  id="groupSize"
                  type="number"
                  min={1}
                  value={form.groupSize}
                  onChange={(e) => setForm((f) => ({ ...f, groupSize: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Visibility</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TravelPackage["status"] }))}
                >
                  <option value="published">Published — visible on the website</option>
                  <option value="draft">Draft — hidden from the website</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0–5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price tiers (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Leave a tier blank to skip it. The price above is always shown as the starting price.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {TIER_NAMES.map((name) => (
                  <div key={name} className="space-y-2">
                    <Label htmlFor={`tier-${name}`}>{name} (₹)</Label>
                    <Input
                      id={`tier-${name}`}
                      type="number"
                      placeholder="Optional"
                      value={form.tierPrices[name]}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          tierPrices: { ...f.tierPrices, [name]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
              Feature this {singular} on the homepage
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
                checked={form.specialRequestAllowed}
                onChange={(e) => setForm((f) => ({ ...f, specialRequestAllowed: e.target.checked }))}
              />
              Allow customers to submit special requests
            </label>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief summary describing the highlights..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Inclusions</Label>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border p-3 sm:grid-cols-2">
                {INCLUSION_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.inclusions.includes(option)}
                      onCheckedChange={() => toggleListValue("inclusions", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exclusions</Label>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border p-3 sm:grid-cols-2">
                {EXCLUSION_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.exclusions.includes(option)}
                      onCheckedChange={() => toggleListValue("exclusions", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Itinerary</Label>
                <Button type="button" size="sm" variant="outline" className="gap-1" onClick={addItineraryDay}>
                  <Plus className="h-3.5 w-3.5" />
                  Add Day
                </Button>
              </div>
              {form.itinerary.length === 0 ? (
                <p className="text-xs text-muted-foreground">No itinerary days yet — click "Add Day" to add one.</p>
              ) : (
                <div className="space-y-3">
                  {form.itinerary.map((day, index) => (
                    <div key={index} className="flex gap-2 rounded-md border p-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Day title, e.g. Arrival in Kochi"
                          value={day.title}
                          onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                        />
                        <Textarea
                          rows={2}
                          placeholder="Description"
                          value={day.description}
                          onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeItineraryDay(index)}
                        aria-label="Remove day"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Saving…" : editing ? "Save changes" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PackageTypeAdmin
