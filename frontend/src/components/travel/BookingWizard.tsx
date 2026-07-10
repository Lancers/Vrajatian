import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, CreditCard, Mail, Phone, ShieldCheck, User } from "lucide-react"

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
import type { TravelPackage } from "src/lib/data/packages"

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
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

const INITIAL_FORM: FormState = {
  startDate: "",
  travelers: 1,
  fullName: "",
  email: "",
  phone: "",
  specialRequests: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
}

interface BookingWizardProps {
  pkg: TravelPackage
  open: boolean
  onOpenChange: (open: boolean) => void
}

function BookingWizard({ pkg, open, onOpenChange }: BookingWizardProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const totalCost = pkg.price * form.travelers

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
    } else if (current === 3) {
      if (form.cardNumber.length < 16) next.cardNumber = "Provide a valid 16-digit card number"
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) next.cardExpiry = "Expiry date must be MM/YY"
      if (form.cardCvc.length < 3) next.cardCvc = "Provide a valid 3-digit CVV"
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep(3)) return
    setStep(4)
    toast.success("Trip booked!", {
      description: `Your reservation for ${pkg.title} is confirmed.`,
    })
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
        {step < 4 && (
          <DialogHeader>
            <div className="mb-2 flex items-center justify-center gap-2">
              {[1, 2, 3].map((n) => (
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
                <span>Total cost:</span>
                <span className="text-primary">{formatPrice(totalCost)}</span>
              </div>
            </div>
            <Button onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
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
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
              <span>Simulated sandbox payment. No real currency is charged.</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  placeholder="4111 2222 3333 4444"
                  maxLength={16}
                  className="pl-9"
                  value={form.cardNumber}
                  onChange={(e) => update("cardNumber", e.target.value.replace(/\D/g, ""))}
                />
              </div>
              {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiration Date</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "")
                    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`
                    update("cardExpiry", val)
                  }}
                />
                {errors.cardExpiry && <p className="text-sm text-destructive">{errors.cardExpiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVV / CVC</Label>
                <Input
                  id="cardCvc"
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  value={form.cardCvc}
                  onChange={(e) => update("cardCvc", e.target.value.replace(/\D/g, ""))}
                />
                {errors.cardCvc && <p className="text-sm text-destructive">{errors.cardCvc}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium text-muted-foreground">Amount Due:</span>
              <span className="text-xl font-black">{formatPrice(totalCost)}</span>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Confirm Payment
              </Button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black">Trip Booked!</h2>
            <p className="max-w-sm text-muted-foreground">
              Thank you, <strong>{form.fullName}</strong>. Your reservation for <strong>{pkg.title}</strong> has been
              logged in pending status.
            </p>
            <div className="w-full space-y-1 rounded-lg border bg-muted/40 p-4 text-left text-sm">
              <div>
                <span className="text-muted-foreground">Departure Date: </span>
                <strong>{form.startDate}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Travellers: </span>
                <strong>{form.travelers}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Total Paid: </span>
                <strong className="text-emerald-500">{formatPrice(totalCost)}</strong>
              </div>
            </div>
            <Button onClick={() => handleClose(false)} className="w-full">
              Awesome, Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookingWizard
