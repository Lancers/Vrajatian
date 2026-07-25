import { useEffect, useState } from "react"
import { ClipboardList, Luggage, MessageSquare, Pencil, Plus, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import { cn } from "src/lib/utils"
import { supabase } from "src/lib/supabase"
import { Button } from "src/components/ui/button"
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
  getAllPackages,
  updatePackage,
  type ItineraryDay,
  type NewPackageInput,
  type TravelPackage,
} from "src/lib/data/packages"

const recentRequests = [
  { id: "TR-001", client: "Rajesh Sharma", destination: "Gujarat", date: "2026-07-03", status: "Pending" },
  { id: "TR-002", client: "Priya Patel", destination: "Rajasthan", date: "2026-07-02", status: "Approved" },
  { id: "TR-003", client: "Amit Singh", destination: "Kerala", date: "2026-07-01", status: "In Review" },
  { id: "TR-004", client: "Sneha Gupta", destination: "Himachal Pradesh", date: "2026-06-30", status: "Pending" },
  { id: "TR-005", client: "Vikram Mehta", destination: "Gujarat", date: "2026-06-28", status: "Approved" },
]

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  duration: "",
  location: "",
  region: "Kerala",
  difficulty: "Easy" as TravelPackage["difficulty"],
  groupSize: "10",
  rating: "4.8",
  isFeatured: false,
  inclusions: "",
  itinerary: "",
  status: "published" as TravelPackage["status"],
}

// One day per line. Optional "Title :: Description" splits the two.
function parseItinerary(text: string): ItineraryDay[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, ...rest] = line.split("::")
      return {
        day: index + 1,
        title: title.trim(),
        description: rest.join("::").trim(),
      }
    })
}

// Inverse of parseItinerary — turn stored days back into the editable text form.
function itineraryToText(days: ItineraryDay[]): string {
  return days
    .map((d) => (d.description ? `${d.title} :: ${d.description}` : d.title))
    .join("\n")
}

// Populate the form fields from an existing package for editing.
function packageToForm(pkg: TravelPackage): typeof EMPTY_FORM {
  return {
    title: pkg.title,
    description: pkg.description,
    price: String(pkg.price),
    duration: pkg.duration,
    location: pkg.location,
    region: pkg.region,
    difficulty: pkg.difficulty,
    groupSize: String(pkg.groupSize),
    rating: String(pkg.rating),
    isFeatured: pkg.isFeatured,
    inclusions: pkg.inclusions.join(", "),
    itinerary: itineraryToText(pkg.itinerary),
    status: pkg.status,
  }
}

function AdminDashboard() {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editing, setEditing] = useState<TravelPackage | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setPackages(await getAllPackages())
    } catch {
      setPackages([])
      toast.error("Could not load packages. Is the backend API running?")
    }
  }

  const stats = [
    { label: "Trip Requests", value: "24", icon: ClipboardList },
    { label: "Active Clients", value: "156", icon: Users },
    { label: "Confirmed Bookings", value: "89", icon: Luggage },
    { label: "Unread Messages", value: "12", icon: MessageSquare },
    { label: "Active Packages", value: String(packages.length), icon: Luggage },
  ]

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this travel package?")) return
    try {
      await deletePackage(id)
      await refresh()
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

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.location || !form.price || !form.duration) {
      setFormError("Title, location, price, and duration are required.")
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
      duration: form.duration,
      location: form.location,
      region: form.region,
      difficulty: form.difficulty,
      groupSize: Number(form.groupSize),
      rating,
      isFeatured: form.isFeatured,
      inclusions: form.inclusions
        ? form.inclusions.split(",").map((i) => i.trim()).filter(Boolean)
        : ["Premium Hotel Stay", "Local Guided Tours", "All Ground Transfers"],
      itinerary: parseItinerary(form.itinerary),
      status: form.status,
    }

    setSubmitting(true)
    try {
      if (editing) {
        await updatePackage(editing.id, input, imageFile)
      } else {
        await createPackage(input, imageFile as File)
      }
      await refresh()
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight")}>Dashboard</h1>
          <p className={cn("text-muted-foreground")}>Overview of your travel agency operations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-5")}>
        {stats.map((stat) => (
          <div key={stat.label} className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-sm")}>
            <div className={cn("flex items-center justify-between")}>
              <p className={cn("text-sm text-muted-foreground")}>{stat.label}</p>
              <stat.icon className={cn("h-4 w-4 text-muted-foreground")} />
            </div>
            <p className={cn("mt-2 text-3xl font-bold")}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("p-4 border-b")}>
          <h2 className={cn("font-semibold")}>Recent Trip Requests</h2>
        </div>
        <div className={cn("overflow-x-auto")}>
          <table className={cn("w-full text-sm")}>
            <thead>
              <tr className={cn("border-b bg-muted/50")}>
                <th className={cn("p-3 text-left font-medium")}>ID</th>
                <th className={cn("p-3 text-left font-medium")}>Client</th>
                <th className={cn("p-3 text-left font-medium")}>Destination</th>
                <th className={cn("p-3 text-left font-medium")}>Date</th>
                <th className={cn("p-3 text-left font-medium")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.id} className={cn("border-b last:border-0")}>
                  <td className={cn("p-3")}>{req.id}</td>
                  <td className={cn("p-3")}>{req.client}</td>
                  <td className={cn("p-3")}>{req.destination}</td>
                  <td className={cn("p-3")}>{req.date}</td>
                  <td className={cn("p-3")}>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium")}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          pkg.status === "published"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-600"
                        )}
                      >
                        {pkg.status}
                      </span>
                      {pkg.isFeatured && (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                          featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{pkg.price.toLocaleString("en-IN")} • {pkg.duration}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 5 Days, 4 Nights"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
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
              <Label htmlFor="itinerary">Itinerary (one day per line — optional "Title :: Description")</Label>
              <Textarea
                id="itinerary"
                rows={4}
                placeholder={"Arrival in Kochi :: Transfer to the houseboat and welcome cruise.\nBackwater Cruise :: Glide past coconut groves and paddy fields."}
                value={form.itinerary}
                onChange={(e) => setForm((f) => ({ ...f, itinerary: e.target.value }))}
              />
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

export default AdminDashboard
