import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Compass,
  Hotel,
  Mail,
  Phone,
  Plane,
  User,
  Users,
} from "lucide-react"

import { Button } from "src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import { Textarea } from "src/components/ui/textarea"
import { useAuth } from "src/lib/auth/AuthContext"
import { createBookingRequest } from "src/lib/data/booking-requests"
import { getMyProfile } from "src/lib/data/profile"
import { getPackages, type TravelPackage } from "src/lib/data/packages"
import { cn, formatDateDDMMYYYY } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

function TripCustomizer() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)

  // Customizer State
  const [selectedPkgId, setSelectedPkgId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [travelers, setTravelers] = useState(1)
  const [hotelClass, setHotelClass] = useState<"budget" | "standard" | "luxury">("standard")
  const [transport, setTransport] = useState<"sleeper" | "ac-suv" | "flight">("ac-suv")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPackages()
      .then((pkgs) => {
        setPackages(pkgs)
        if (pkgs.length > 0) {
          setSelectedPkgId(pkgs[0].id)
        }
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  // Prefill contact details for a logged-in traveller — fields stay editable,
  // guests (no session) see this step exactly as before.
  useEffect(() => {
    if (!user) return
    setEmail((prev) => prev || user.email || "")
    getMyProfile()
      .then((profile) => {
        setFullName((prev) => prev || profile.fullName || "")
        setPhone((prev) => prev || profile.phone || "")
      })
      .catch(() => {
        // Profile prefill is a nicety, not required for booking — fail silently.
      })
  }, [user])

  const selectedPkg = useMemo(() => packages.find((p) => p.id === selectedPkgId) || null, [packages, selectedPkgId])

  // Price calculation logic
  const priceCalculation = useMemo(() => {
    if (!selectedPkg) return { base: 0, hotelMod: 0, transportAddon: 0, perPerson: 0, total: 0 }
    const base = selectedPkg.price
    const hotelMod = hotelClass === "budget" ? -base * 0.15 : hotelClass === "luxury" ? base * 0.4 : 0
    const transportAddon = transport === "sleeper" ? 0 : transport === "ac-suv" ? 4500 : 16000
    const perPerson = Math.round(base + hotelMod + transportAddon)
    const total = perPerson * travelers
    return { base, hotelMod, transportAddon, perPerson, total }
  }, [selectedPkg, hotelClass, transport, travelers])

  function validateStep(s: number): boolean {
    if (s === 1 && !selectedPkgId) {
      toast.error("Please select a base destination first.")
      return false
    }
    if (s === 2) {
      if (!startDate) {
        toast.error("Please select a departure date.")
        return false
      }
      if (travelers < 1) {
        toast.error("Please specify at least 1 traveller.")
        return false
      }
      if (selectedPkg && travelers > selectedPkg.groupSize) {
        toast.error(`The maximum group size for this package is ${selectedPkg.groupSize}.`)
        return false
      }
    }
    if (s === 4) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.")
        return false
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please provide a valid email address.")
        return false
      }
      if (!phone.trim() || phone.trim().length < 6) {
        toast.error("Please provide a valid contact number.")
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit() {
    if (!selectedPkg) return
    setSubmitting(true)
    try {
      const summaryString = [
        `Customizer Choices:`,
        `Hotel Class: ${hotelClass}`,
        `Transport Option: ${transport}`,
        `Instructions: ${specialRequests}`,
      ].join(" | ")

      await createBookingRequest({
        packageId: selectedPkg.id,
        startDate,
        travelers,
        fullName,
        email,
        phone,
        specialRequests: summaryString,
      })

      setStep(5)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record your custom proposal.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <Compass className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading destinations catalog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full">
          Tailor-Made Travel
        </span>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl mt-3">Plan & Customize Your Trip</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Tailor every accommodation and transport tier to create your perfect dream getaway.
        </p>
      </div>

      {step < 5 && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-black transition-all",
                  step === n && "border-primary bg-primary text-primary-foreground scale-105",
                  step > n && "border-emerald-500 bg-emerald-500 text-white",
                  step < n && "border-muted text-muted-foreground"
                )}
              >
                {n}
              </div>
              {n < 4 && (
                <div
                  className={cn(
                    "h-0.5 w-10 sm:w-16 mx-2 rounded",
                    step > n ? "bg-emerald-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_320px] items-start">
        <div className="space-y-6">
          {/* STEP 1: SELECT DESTINATION BASE */}
          {step === 1 && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">1. Choose a Base Vacation</CardTitle>
                <CardDescription>Select one of our professional itineraries to customize.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={cn(
                      "group cursor-pointer overflow-hidden rounded-xl border p-3 transition-all duration-300 relative bg-card",
                      selectedPkgId === pkg.id
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "hover:border-border hover:bg-accent/40"
                    )}
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-lg">
                      <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
                      {selectedPkgId === pkg.id && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase text-primary tracking-wide">
                        {pkg.location}
                      </span>
                      <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-1 mt-0.5">
                        {pkg.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{pkg.duration}</span>
                        <strong className="text-foreground">{formatPrice(pkg.price)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* STEP 2: DATES & PASSENGERS */}
          {step === 2 && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">2. Date & Travelers</CardTitle>
                <CardDescription>Select departure and group specifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Departure Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers">Number of Travellers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="travelers"
                      type="number"
                      min={1}
                      max={selectedPkg?.groupSize || 20}
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                      className="pl-9"
                    />
                  </div>
                  {selectedPkg && (
                    <p className="text-xs text-muted-foreground">
                      * Maximum occupancy for this destination package: {selectedPkg.groupSize} travellers.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: HOTEL & TRANSIT TIER */}
          {step === 3 && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">3. Accommodation & Transport</CardTitle>
                <CardDescription>Upgrade stays and transfers to fit your style.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold">Accommodation Class</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: "budget", label: "Value Standard", desc: "Clean hostels & homestays (-15%)" },
                      { value: "standard", label: "Premium Comfort", desc: "Handpicked 3★/4★ Hotels (+0%)" },
                      { value: "luxury", label: "Elite Luxury", desc: "5★ Resorts & Heritage Haveli (+40%)" },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setHotelClass(opt.value as any)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-4 text-center transition-all bg-card",
                          hotelClass === opt.value
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "hover:border-border hover:bg-accent/40"
                        )}
                      >
                        <Hotel className={cn("mx-auto mb-2 h-6 w-6", hotelClass === opt.value ? "text-primary" : "text-muted-foreground")} />
                        <h5 className="font-bold text-xs">{opt.label}</h5>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold">Transport Connection</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: "sleeper", label: "Local Transit", desc: "Sleeper Class Trains (+₹0)" },
                      { value: "ac-suv", label: "Private Driver", desc: "Comfort AC SUV / Sedans (+₹4.5K)" },
                      { value: "flight", label: "Express Flight", desc: "Flight connections (+₹16K/person)" },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setTransport(opt.value as any)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-4 text-center transition-all bg-card",
                          transport === opt.value
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "hover:border-border hover:bg-accent/40"
                        )}
                      >
                        {opt.value === "flight" ? (
                          <Plane className={cn("mx-auto mb-2 h-6 w-6", transport === opt.value ? "text-primary" : "text-muted-foreground")} />
                        ) : opt.value === "ac-suv" ? (
                          <Car className={cn("mx-auto mb-2 h-6 w-6", transport === opt.value ? "text-primary" : "text-muted-foreground")} />
                        ) : (
                          <Compass className={cn("mx-auto mb-2 h-6 w-6", transport === opt.value ? "text-primary" : "text-muted-foreground")} />
                        )}
                        <h5 className="font-bold text-xs">{opt.label}</h5>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: CLIENT CONTACT */}
          {step === 4 && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">4. Client Details</CardTitle>
                <CardDescription>Enter contact specifications so our guides can coordinate.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="aarav@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Custom Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    rows={3}
                    placeholder="E.g., room upgrades, specific excursions, flight routes..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <Card className="rounded-2xl border shadow-sm text-center py-10 px-6">
              <CardContent className="space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 scale-110">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black">Plan Proposal Sent!</CardTitle>
                  <CardDescription className="max-w-md mx-auto text-sm text-muted-foreground mt-2">
                    Thank you, <strong>{fullName}</strong>. Your customized trip itinerary proposal for{" "}
                    <strong>{selectedPkg?.title}</strong> has been logged. Our team will review it and confirm
                    shortly — track the outcome on your profile.
                  </CardDescription>
                </div>

                <div className="w-full max-w-md mx-auto space-y-1.5 rounded-xl border bg-muted/30 p-4 text-left text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <strong>{formatDateDDMMYYYY(startDate)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travelers:</span>
                    <strong>{travelers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel Tier:</span>
                    <strong className="capitalize">{hotelClass} Class</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transport Class:</span>
                    <strong className="capitalize">{transport} Connection</strong>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 text-base font-bold">
                    <span>Estimated Total:</span>
                    <span className="text-primary">{formatPrice(priceCalculation.total)}</span>
                  </div>
                </div>

                <div>
                  <Button asChild className="rounded-full">
                    <Link to="/profile">Track this request on your profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BACK / CONTROLS NAVIGATION */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className={cn("gap-2", step === 1 && "opacity-0 pointer-events-none")}
              >
                <ArrowLeft size={16} /> Back
              </Button>

              {step < 4 ? (
                <Button onClick={handleNext} className="gap-2 px-6 rounded-full font-bold">
                  Continue <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2 px-8 rounded-full font-bold bg-primary hover:bg-primary/95 text-primary-foreground"
                >
                  {submitting ? "Sending..." : "Submit Proposal"} <ArrowRight size={16} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* PRICING & PROPOSAL SUMMARY SIDEBAR CARD */}
        {selectedPkg && step < 5 && (
          <Card className="rounded-2xl border shadow-sm sticky top-24 bg-card">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-wide">
                Summary Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Base Destination</span>
                <span className="font-bold text-foreground leading-snug">{selectedPkg.title}</span>
              </div>

              <div className="space-y-1.5 border-t pt-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Base package:</span>
                  <strong>{formatPrice(priceCalculation.base)}</strong>
                </div>
                {priceCalculation.hotelMod !== 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Hotel adjustment:</span>
                    <strong className={cn(priceCalculation.hotelMod > 0 ? "text-emerald-600" : "text-amber-600")}>
                      {priceCalculation.hotelMod > 0 ? "+" : ""}
                      {formatPrice(priceCalculation.hotelMod)}
                    </strong>
                  </div>
                )}
                {priceCalculation.transportAddon !== 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Transit connection:</span>
                    <strong>+{formatPrice(priceCalculation.transportAddon)}</strong>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2 mt-1">
                  <span>Cost per person:</span>
                  <span>{formatPrice(priceCalculation.perPerson)}</span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quantity:</span>
                  <span>
                    {travelers} {travelers === 1 ? "traveller" : "travellers"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black border-t pt-2 mt-1">
                  <span>Total cost:</span>
                  <span className="text-primary">{formatPrice(priceCalculation.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TripCustomizer
