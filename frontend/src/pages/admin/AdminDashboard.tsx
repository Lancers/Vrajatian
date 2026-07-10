import { useEffect, useState } from "react"
import { ClipboardList, Luggage, MessageSquare, Plus, Trash2, Users } from "lucide-react"

import { cn } from "src/lib/utils"
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
  deletePackage,
  getPackages,
  savePackage,
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
  image: "",
  price: "",
  duration: "",
  location: "",
  region: "Kerala",
  difficulty: "Easy" as TravelPackage["difficulty"],
  groupSize: "10",
  inclusions: "",
}

function AdminDashboard() {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    setPackages(getPackages())
  }, [])

  const stats = [
    { label: "Trip Requests", value: "24", icon: ClipboardList },
    { label: "Active Clients", value: "156", icon: Users },
    { label: "Confirmed Bookings", value: "89", icon: Luggage },
    { label: "Unread Messages", value: "12", icon: MessageSquare },
    { label: "Active Packages", value: String(packages.length), icon: Luggage },
  ]

  function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this travel package?")) return
    setPackages(deletePackage(id))
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.location || !form.price || !form.duration || !form.image) {
      setFormError("Title, location, price, duration, and image are required.")
      return
    }

    const pkg: TravelPackage = {
      id: `pkg-${Date.now()}`,
      title: form.title,
      description: form.description || "Enjoy a premium guided custom travel itinerary.",
      image: form.image,
      price: Number(form.price),
      duration: form.duration,
      rating: 4.8,
      location: form.location,
      region: form.region,
      difficulty: form.difficulty,
      groupSize: Number(form.groupSize),
      inclusions: form.inclusions
        ? form.inclusions.split(",").map((i) => i.trim()).filter(Boolean)
        : ["Premium Hotel Stay", "Local Guided Tours", "All Ground Transfers"],
      itinerary: [
        { day: 1, title: "Arrival", description: "Transfer from the airport to your accommodation." },
        { day: 2, title: "Sightseeing", description: "Guided sightseeing excursion around prime local landmarks." },
      ],
    }

    setPackages(savePackage(pkg))
    setForm(EMPTY_FORM)
    setFormError("")
    setShowAddForm(false)
  }

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Dashboard</h1>
        <p className={cn("text-muted-foreground")}>Overview of your travel agency operations.</p>
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
          <Button size="sm" className="gap-1.5" onClick={() => setShowAddForm(true)}>
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
                  <img src={pkg.image} alt={pkg.title} className="h-12 w-12 rounded-md object-cover" />
                  <div>
                    <div className="font-semibold">{pkg.title}</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{pkg.price.toLocaleString("en-IN")} • {pkg.duration}
                    </div>
                  </div>
                </div>
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
            ))
          )}
        </div>
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Travel Experience</DialogTitle>
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
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />
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
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                Save Package
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>
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
