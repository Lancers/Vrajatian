import { useState } from "react"
import { Pencil, Plus, Trash2, Luggage } from "lucide-react"
import { toast } from "sonner"

import { cn, formatDuration } from "src/lib/utils"
import { Button } from "src/components/ui/button"
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
  type TravelPackage,
} from "src/lib/data/packages"
import { useAdminData } from "src/components/layout/AdminDataContext"

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  durationDays: "1",
  durationNights: "0",
  location: "",
  region: "Kerala",
  difficulty: "Easy" as TravelPackage["difficulty"],
  groupSize: "10",
  rating: "4.8",
  isFeatured: false,
  inclusions: "",
  itinerary: [] as ItineraryDay[],
  status: "published" as TravelPackage["status"],
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
function packageToForm(pkg: TravelPackage): typeof EMPTY_FORM {
  const { days, nights } = parseDurationParts(pkg.duration)
  return {
    title: pkg.title,
    description: pkg.description,
    price: String(pkg.price),
    durationDays: days,
    durationNights: nights,
    location: pkg.location,
    region: pkg.region,
    difficulty: pkg.difficulty,
    groupSize: String(pkg.groupSize),
    rating: String(pkg.rating),
    isFeatured: pkg.isFeatured,
    inclusions: pkg.inclusions.join(", "),
    itinerary: pkg.itinerary,
    status: pkg.status,
  }
}

function AdminPackages() {
  const { packages, refreshPackages } = useAdminData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editing, setEditing] = useState<TravelPackage | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this travel package?")) return
    try {
      await deletePackage(id)
      await refreshPackages()
      toast.success("Package deleted.")
    } catch {
      toast.error("Could not delete the package.")
    }
  }

  function openAddForm() {
    setEditing(null)
    setForm(EMPTY_FORM)
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

    const input: NewPackageInput = {
      title: form.title,
      description: form.description || "Enjoy a premium guided custom travel itinerary.",
      price: Number(form.price),
      duration: buildDurationString(days, nights),
      location: form.location,
      region: form.region,
      difficulty: form.difficulty,
      groupSize: Number(form.groupSize),
      rating,
      isFeatured: form.isFeatured,
      inclusions: form.inclusions
        ? form.inclusions.split(",").map((i) => i.trim()).filter(Boolean)
        : ["Premium Hotel Stay", "Local Guided Tours", "All Ground Transfers"],
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
      setForm(EMPTY_FORM)
      setImageFile(null)
      setFormError("")
      toast.success(editing ? "Package updated." : "Package saved.")
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save the package.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Packages</h1>
        <p className={cn("text-muted-foreground")}>Manage the travel packages shown on the public site.</p>
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex items-center justify-between p-4 border-b")}>
          <h2 className={cn("font-semibold")}>Travel Catalog</h2>
          <Button size="sm" className="gap-1.5" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Add Package
          </Button>
        </div>
        <div className="divide-y">
          {packages.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No packages in the catalog yet.</p>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.title} className="h-12 w-12 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Luggage className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
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
                    aria-label="Edit package"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(pkg.id)}
                    aria-label="Delete package"
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
            <DialogTitle>{editing ? "Edit Travel Package" : "Create New Travel Experience"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Package Title *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difficulty: e.target.value as TravelPackage["difficulty"] }))
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
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
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
              Feature this package on the homepage
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
              <Label htmlFor="inclusions">Inclusions (comma separated)</Label>
              <Input
                id="inclusions"
                placeholder="Guided trekking, Homestay, Airport transfers..."
                value={form.inclusions}
                onChange={(e) => setForm((f) => ({ ...f, inclusions: e.target.value }))}
              />
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
                {submitting ? "Saving…" : editing ? "Update Package" : "Save Package"}
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

export default AdminPackages
