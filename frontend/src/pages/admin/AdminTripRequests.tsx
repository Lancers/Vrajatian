import { useRef, useState } from "react"
import { CheckCircle2, Download, Eye, Mail, Pencil, Phone, Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { cn, formatDateDDMMYYYY } from "src/lib/utils"
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
import { StatusBadge } from "src/components/common/StatusBadge"
import {
  deleteBookingRequest,
  markBookingRequestContacted,
  updateBookingRequest,
  type BookingRequest,
} from "src/lib/data/booking-requests"
import { downloadTripRequestPdf, tripRequestToPdfData } from "src/lib/pdf/trip-request-pdf"
import { useAdminData } from "src/components/layout/AdminDataContext"

interface TravelerFormRow {
  name: string
  age: string
}

interface FormState {
  fullName: string
  email: string
  phone: string
  startDate: string
  travelers: string
  specialRequests: string
  status: BookingRequest["status"]
  travelerDetails: TravelerFormRow[]
}

function requestToForm(req: BookingRequest): FormState {
  return {
    fullName: req.fullName,
    email: req.email,
    phone: req.phone,
    startDate: req.startDate,
    travelers: String(req.travelers),
    specialRequests: req.specialRequests,
    status: req.status,
    travelerDetails: req.travelerDetails.map((t) => ({ name: t.name, age: t.age ? String(t.age) : "" })),
  }
}

function AdminTripRequests() {
  const { bookingRequests: requests, packages, refreshBookingRequests } = useAdminData()
  const [viewing, setViewing] = useState<BookingRequest | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  // Guards against an in-flight save reopening the modal after the admin has
  // already closed it (closeModal sets this so the async success handler
  // below can tell it's no longer relevant).
  const modalClosedRef = useRef(false)

  const pkg = viewing ? packages.find((p) => p.id === viewing.packageId) : undefined

  async function handleMarkContacted(id: string) {
    try {
      await markBookingRequestContacted(id)
      await refreshBookingRequests()
      toast.success("Marked as contacted.")
    } catch {
      toast.error("Could not update this request.")
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this trip request?")) return
    try {
      await deleteBookingRequest(id)
      await refreshBookingRequests()
      toast.success("Trip request deleted.")
    } catch {
      toast.error("Could not delete this trip request.")
    }
  }

  function openViewModal(req: BookingRequest) {
    modalClosedRef.current = false
    setViewing(req)
    setEditMode(false)
    setFormError("")
  }

  function closeModal() {
    modalClosedRef.current = true
    setViewing(null)
    setEditMode(false)
    setForm(null)
  }

  function startEditing() {
    if (!viewing) return
    setForm(requestToForm(viewing))
    setEditMode(true)
    setFormError("")
  }

  function addTravelerRow() {
    setForm((f) => f && { ...f, travelerDetails: [...f.travelerDetails, { name: "", age: "" }] })
  }

  function removeTravelerRow(index: number) {
    setForm((f) => f && { ...f, travelerDetails: f.travelerDetails.filter((_, i) => i !== index) })
  }

  function updateTravelerRow(index: number, field: "name" | "age", value: string) {
    setForm(
      (f) =>
        f && {
          ...f,
          travelerDetails: f.travelerDetails.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
        },
    )
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!viewing || !form) return
    const travelers = Number(form.travelers)
    if (!form.fullName || !form.email || !form.phone || !form.startDate) {
      setFormError("Name, email, phone, and departure date are required.")
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Please provide a valid email address.")
      return
    }
    if (form.phone.trim().length < 6) {
      setFormError("Please provide a valid phone number.")
      return
    }
    if (!Number.isInteger(travelers) || travelers < 1) {
      setFormError("Travellers must be at least 1.")
      return
    }
    if (form.travelerDetails.some((t) => t.age.trim() && (!Number.isInteger(Number(t.age)) || Number(t.age) <= 0))) {
      setFormError("Traveler age must be a positive number.")
      return
    }

    const travelerDetails = form.travelerDetails
      .map((t) => ({ name: t.name.trim(), age: t.age.trim() ? Number(t.age) : undefined }))
      .filter((t) => t.name)

    setSubmitting(true)
    try {
      const updated = await updateBookingRequest(viewing.id, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        startDate: form.startDate,
        travelers,
        specialRequests: form.specialRequests,
        status: form.status,
        travelerDetails,
      })
      await refreshBookingRequests()
      if (!modalClosedRef.current) {
        setViewing(updated)
        setEditMode(false)
      }
      toast.success("Trip request updated.")
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save this trip request.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Trip Requests</h1>
        <p className={cn("text-muted-foreground")}>
          Leads from the "Book Now" wizard. Reach out on WhatsApp/phone/email, then mark them contacted.
        </p>
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex flex-wrap items-center justify-between gap-2 p-4 border-b")}>
          <h2 className={cn("font-semibold")}>All Requests</h2>
          <span className="text-xs text-muted-foreground">{requests.length} total</span>
        </div>
        <div className="divide-y">
          {requests.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No trip requests yet.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <button type="button" onClick={() => openViewModal(req)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{req.fullName}</span>
                    <StatusBadge label={req.status} tone={req.status === "contacted" ? "positive" : "neutral"} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {req.packageTitle} • {formatDateDDMMYYYY(req.startDate)} • {req.travelers} traveller
                    {req.travelers === 1 ? "" : "s"} •{" "}
                    ₹{req.packagePrice.toLocaleString("en-IN")}/person
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {req.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {req.phone}
                    </span>
                  </div>
                  {req.specialRequests && (
                    <div className="mt-1 text-xs text-muted-foreground">Notes: {req.specialRequests}</div>
                  )}
                </button>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={req.status === "contacted" ? "outline" : "default"}
                    disabled={req.status === "contacted"}
                    onClick={() => handleMarkContacted(req.id)}
                    className="gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {req.status === "contacted" ? "Contacted" : "Mark Contacted"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openViewModal(req)}
                    aria-label="View trip request details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(req.id)}
                    aria-label="Delete trip request"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Trip Request" : "Trip Request Details"}</DialogTitle>
          </DialogHeader>

          {viewing && !editMode && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{viewing.fullName}</span>
                  <StatusBadge
                    label={viewing.status}
                    tone={viewing.status === "contacted" ? "positive" : "neutral"}
                  />
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={startEditing}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Package</div>
                  <div className="font-medium">{viewing.packageTitle}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Price / person</div>
                  <div className="font-medium">₹{viewing.packagePrice.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Departure date</div>
                  <div className="font-medium">{formatDateDDMMYYYY(viewing.startDate)}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Travellers</div>
                  <div className="font-medium">{viewing.travelers}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</div>
                  <div className="font-medium break-all">{viewing.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Phone</div>
                  <div className="font-medium">{viewing.phone}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Submitted</div>
                  <div className="font-medium">{formatDateDDMMYYYY(viewing.createdAt)}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Traveler Details
                </div>
                {viewing.travelerDetails.length === 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Not yet added — click Edit to add traveler names.
                  </p>
                ) : (
                  <ul className="mt-1 space-y-1 text-sm">
                    {viewing.travelerDetails.map((t, i) => (
                      <li key={i}>
                        {i + 1}. {t.name}
                        {t.age ? ` (Age ${t.age})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Special Requests / Notes
                </div>
                <p className="mt-1 text-sm">{viewing.specialRequests || "None"}</p>
              </div>

              {pkg && (
                <>
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Inclusions
                    </div>
                    {pkg.inclusions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        {pkg.inclusions.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <span className="font-bold text-emerald-500">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Exclusions
                    </div>
                    {pkg.exclusions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        {pkg.exclusions.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <span className="font-bold text-red-500">✕</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {pkg.itinerary.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Itinerary
                      </div>
                      <div className="space-y-2">
                        {pkg.itinerary.map((day) => (
                          <div key={day.day} className="rounded-md border p-2 text-sm">
                            <div className="font-semibold">
                              Day {day.day}: {day.title}
                            </div>
                            {day.description && (
                              <p className="text-xs text-muted-foreground">{day.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <Button
                type="button"
                className="w-full gap-1.5"
                onClick={() => downloadTripRequestPdf(tripRequestToPdfData(viewing, pkg))}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          )}

          {viewing && editMode && form && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => f && { ...f, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelers">Travellers *</Label>
                  <Input
                    id="travelers"
                    type="number"
                    min={1}
                    value={form.travelers}
                    onChange={(e) => setForm((f) => f && { ...f, travelers: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => f && { ...f, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => f && { ...f, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Departure Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => f && { ...f, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, status: e.target.value as BookingRequest["status"] })
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests / Notes</Label>
                <Textarea
                  id="specialRequests"
                  rows={3}
                  value={form.specialRequests}
                  onChange={(e) => setForm((f) => f && { ...f, specialRequests: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Traveler Details</Label>
                  <Button type="button" size="sm" variant="outline" className="gap-1" onClick={addTravelerRow}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Traveler
                  </Button>
                </div>
                {form.travelerDetails.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No travelers added yet — click "Add Traveler" once names are confirmed.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {form.travelerDetails.map((t, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Full name"
                          className="flex-1"
                          value={t.name}
                          onChange={(e) => updateTravelerRow(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Age"
                          type="number"
                          min={0}
                          className="w-24"
                          value={t.age}
                          onChange={(e) => updateTravelerRow(index, "age", e.target.value)}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeTravelerRow(index)}
                          aria-label="Remove traveler"
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
                  {submitting ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={() => setEditMode(false)}
                  disabled={submitting}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTripRequests
