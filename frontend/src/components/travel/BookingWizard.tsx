import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { CheckCircle2, Mail, Phone, User } from "lucide-react"

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
import { useAuth } from "src/lib/auth/AuthContext"
import type { TravelPackage } from "src/lib/data/packages"
import { createBookingRequest } from "src/lib/data/booking-requests"
import { getMyProfile } from "src/lib/data/profile"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

interface FormState {
  startDate: string
  travelers: number
  fullName: string
  email: string
  phone: string
  specialRequests: string
  /** Honeypot — real users never see or fill this. Non-empty means a bot. */
  website: string
}

const INITIAL_FORM: FormState = {
  startDate: "",
  travelers: 1,
  fullName: "",
  email: "",
  phone: "",
  specialRequests: "",
  website: "",
}

const MIN_FILL_MS = 3_000 // reject a submit faster than a human could plausibly fill the form

interface BookingWizardProps {
  pkg: TravelPackage
  open: boolean
  onOpenChange: (open: boolean) => void
}

function BookingWizard({ pkg, open, onOpenChange }: BookingWizardProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formLoadedAt, setFormLoadedAt] = useState(Date.now())

  const totalCost = pkg.price * form.travelers

  // Restart the min-fill-time timer every time the dialog is (re)opened, and
  // prefill contact details for a logged-in traveller (fields stay editable).
  useEffect(() => {
    if (!open) return
    setFormLoadedAt(Date.now())
    if (!user) return

    setForm((prev) => ({ ...prev, email: prev.email || user.email || "" }))
    getMyProfile()
      .then((profile) => {
        setForm((prev) => ({
          ...prev,
          fullName: prev.fullName || profile.fullName || "",
          phone: prev.phone || profile.phone || "",
        }))
      })
      .catch(() => {
        // Prefill is a nicety, not required for booking — fail silently.
      })
  }, [open, user])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validateStep(current: number): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (current === 1) {
      if (!form.startDate) next.startDate = "Please select a departure date"
      if (form.travelers < 1) next.travelers = "Must have at least 1 traveller"
    } else if (current === 2) {
      if (!form.fullName.trim()) next.fullName = "Full name is required"
      if (!form.email.trim()) next.email = "Email address is required"
      else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Please provide a valid email"
      if (!form.phone.trim()) next.phone = "Phone number is required"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1)
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep(2)) return

    if (Date.now() - formLoadedAt < MIN_FILL_MS) {
      toast.error("Please take a moment to review your details before sending.")
      return
    }

    setSubmitting(true)
    try {
      await createBookingRequest({
        packageId: pkg.id,
        startDate: form.startDate,
        travelers: form.travelers,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        specialRequests: form.specialRequests,
        website: form.website,
      })

      setStep(3)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose(next: boolean) {
    if (!next) {
      setStep(1)
      setForm(INITIAL_FORM)
      setErrors({})
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step < 3 && (
          <DialogHeader>
            <div className="mb-2 flex items-center justify-center gap-2">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    step === n && "border-primary bg-primary text-primary-foreground",
                    step > n && "border-emerald-500 bg-emerald-500 text-white",
                    step < n && "border-muted text-muted-foreground"
                  )}
                >
                  {n}
                </div>
              ))}
            </div>
            <DialogTitle className="text-center">{pkg.title}</DialogTitle>
          </DialogHeader>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="startDate">Select Departure Date</Label>
              <Input
                id="startDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
              />
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travellers</Label>
              <Input
                id="travelers"
                type="number"
                min={1}
                max={pkg.groupSize}
                value={form.travelers}
                onChange={(e) => update("travelers", Math.max(1, Number(e.target.value)))}
              />
              {errors.travelers && <p className="text-sm text-destructive">{errors.travelers}</p>}
              <p className="text-xs text-muted-foreground">Max group limit: {pkg.groupSize} travellers.</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Price per person:</span>
                <span>{formatPrice(pkg.price)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                <span>Estimated total:</span>
                <span className="text-primary">{formatPrice(totalCost)}</span>
              </div>
            </div>
            <Button onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Aarav Sharma"
                  className="pl-9"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="aarav@example.com"
                    className="pl-9"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>
            {pkg.specialRequestAllowed && (
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  rows={3}
                  placeholder="Dietary requests, room preferences, accessibility needs..."
                  value={form.specialRequests}
                  onChange={(e) => update("specialRequests", e.target.value)}
                />
              </div>
            )}

            {/* Honeypot — hidden from sighted users and screen readers alike. Bots that
                auto-fill forms by field name/id often populate this; real users never will. */}
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={submitting}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Sending…" : "Send Request"}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black">Request Sent!</h2>
            <p className="max-w-sm text-muted-foreground">
              Thank you, <strong>{form.fullName}</strong>. Your request for <strong>{pkg.title}</strong> has been
              logged. We'll review it and confirm shortly — track the outcome on your profile.
            </p>
            <div className="w-full space-y-1 rounded-lg border bg-muted/40 p-4 text-left text-sm">
              <div>
                <span className="text-muted-foreground">Departure Date: </span>
                <strong>{formatDateDDMMYYYY(form.startDate)}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Travellers: </span>
                <strong>{form.travelers}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Total: </span>
                <strong className="text-emerald-500">{formatPrice(totalCost)}</strong>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/profile" onClick={() => handleClose(false)}>
                View on My Profile
              </Link>
            </Button>
            <Button onClick={() => handleClose(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookingWizard
