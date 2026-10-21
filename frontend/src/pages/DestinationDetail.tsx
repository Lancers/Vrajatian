import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  MapPin,
  ShieldCheck,
  Users,
  Car,
  Compass,
  Hotel,
  Mountain,
  Eye,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Wand2,
  Calendar,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "src/components/ui/breadcrumb"
import { Button } from "src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs"
import PackageCard from "src/components/travel/PackageCard"
import BookingWizard from "src/components/travel/BookingWizard"
import { getPackageBySlug, getPackages, type PackageType, type TravelPackage } from "src/lib/data/packages"
import { formatDuration } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

const TYPE_LISTING: Record<PackageType, { basePath: string; label: string }> = {
  trip: { basePath: "/destinations", label: "Vacations" },
  activity: { basePath: "/activities", label: "Adventures" },
  education: { basePath: "/educational-trips", label: "Educational Journeys" },
  corporate: { basePath: "/corporate-trips", label: "Corporate Offsites" },
}

function getItineraryIcon(title: string, desc: string) {
  const text = `${title} ${desc}`.toLowerCase()
  if (text.includes("drive") || text.includes("transfer") || text.includes("road")) return Car
  if (text.includes("hotel") || text.includes("stay") || text.includes("check-in") || text.includes("resort") || text.includes("camp") || text.includes("chalet") || text.includes("bungalow")) return Hotel
  if (text.includes("trek") || text.includes("hike") || text.includes("climb") || text.includes("peak") || text.includes("mountain") || text.includes("rapids")) return Mountain
  if (text.includes("sightseeing") || text.includes("explore") || text.includes("visit") || text.includes("tour") || text.includes("temple") || text.includes("palace") || text.includes("fort")) return Eye
  return Compass
}

interface DestinationDetailProps {
  type?: PackageType
}

function DestinationDetail({ type = "trip" }: DestinationDetailProps) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState<TravelPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [bookingOpen, setBookingOpen] = useState(false)

  const listing = TYPE_LISTING[type]

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)

    getPackageBySlug(slug)
      .then((found) => {
        if (cancelled) return
        if (!found) {
          navigate(listing.basePath, { replace: true })
          return
        }
        setPkg(found)
      })
      .catch(() => {
        if (!cancelled) navigate(listing.basePath, { replace: true })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug, navigate, listing.basePath])

  useEffect(() => {
    getPackages({ type })
      .then((pkgs) => setPackages(pkgs))
      .catch(() => setPackages([]))
  }, [type])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-28 text-center">
        <Compass size={40} className="mx-auto mb-4 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Opening Itinerary...</p>
      </div>
    )
  }

  if (!pkg) return null

  const related = packages.filter((p) => p.id !== pkg.id && p.region === pkg.region).slice(0, 3)

  const whatsappMessage = encodeURIComponent(
    `Hello Vrajatian Concierge! I'm interested in the "${pkg.title}" package (${formatPrice(pkg.price)} per person). Could you share current date availability and pricing?`
  )
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Navigation Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-primary">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={listing.basePath} className="text-xs font-semibold text-muted-foreground hover:text-primary">{listing.label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-bold text-foreground truncate max-w-[240px]">{pkg.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Main Column */}
        <div className="space-y-8">
          {/* Hero Banner / Gallery Image */}
          <div className="relative h-[380px] sm:h-[480px] overflow-hidden rounded-3xl border border-border/80 shadow-md">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-103"
            />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1 text-xs font-bold text-white border border-neutral-800">
                <MapPin size={12} className="text-sky-400" />
                {pkg.location} • {pkg.region}
              </span>
              {pkg.isFeatured && (
                <span className="flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Sparkles size={11} /> Signature Collection
                </span>
              )}
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div className="flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-bold border border-neutral-800">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{pkg.rating} Rating</span>
                <span className="text-neutral-400">• Verified Guests</span>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              {pkg.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Quick Fact Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Clock size={12} className="text-sky-600 dark:text-sky-400" /> Duration
              </span>
              <p className="font-bold text-sm text-foreground">{formatDuration(pkg.duration)}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Users size={12} className="text-sky-600 dark:text-sky-400" /> Max Group
              </span>
              <p className="font-bold text-sm text-foreground">{pkg.groupSize} Guests Max</p>
            </div>

            {pkg.difficulty && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Mountain size={12} className="text-sky-600 dark:text-sky-400" /> Difficulty
                </span>
                <p className="font-bold text-sm text-foreground">{pkg.difficulty}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" /> Guarantee
              </span>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">100% Refundable</p>
            </div>
          </div>

          {/* Accommodation & Pricing Tiers */}
          {pkg.tiers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                  Available Hospitality Tiers
                </h3>
                <span className="text-xs text-muted-foreground">Select your comfort standard</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {pkg.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-sky-400/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {tier.name} Tier
                        </span>
                        {tier.name === "Value" && (
                          <span className="rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 text-sky-700 dark:text-sky-300 text-[9px] font-bold px-2 py-0.5">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-black text-foreground">
                        {formatPrice(tier.price)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">per guest</span>
                    </div>

                    {tier.description && (
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-2.5">
                        {tier.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Day-by-Day Timeline Tabs */}
          <div className="pt-4">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="mb-6 rounded-xl bg-muted/60 p-1">
                <TabsTrigger value="itinerary" className="rounded-lg text-xs font-bold">
                  Day-by-Day Itinerary
                </TabsTrigger>
                <TabsTrigger value="inclusions" className="rounded-lg text-xs font-bold">
                  Inclusions ({pkg.inclusions.length})
                </TabsTrigger>
                <TabsTrigger value="exclusions" className="rounded-lg text-xs font-bold">
                  Exclusions
                </TabsTrigger>
              </TabsList>

              {/* Itinerary Timeline */}
              <TabsContent value="itinerary" className="relative space-y-6 pl-4 pt-2">
                <div className="absolute left-[33px] top-6 bottom-6 w-0.5 bg-border/80 pointer-events-none" />

                {pkg.itinerary.map((item) => {
                  const TripIcon = getItineraryIcon(item.title, item.description)
                  return (
                    <div key={item.day} className="group relative flex gap-5 items-start transition-all duration-300">
                      {/* Timeline Step Bubble */}
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-black text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-xs">
                        0{item.day}
                      </div>

                      <div className="flex-1 rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md flex flex-col sm:flex-row gap-4 sm:items-start">
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 tracking-widest block">
                            Day {item.day} Route
                          </span>
                          <h4 className="font-bold text-base text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                          <TripIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </TabsContent>

              {/* Inclusions */}
              <TabsContent value="inclusions" className="pt-2">
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-lg text-foreground">
                    Complimentary Inclusions
                  </h4>
                  <p className="text-xs text-muted-foreground">Every detail is pre-coordinated for seamless travel:</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                    {pkg.inclusions.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Exclusions */}
              <TabsContent value="exclusions" className="pt-2">
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-lg text-foreground">
                    Exclusions (Transparent Pricing)
                  </h4>
                  <p className="text-xs text-muted-foreground">No hidden charges. Clear parameters for extra personal expenditures:</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                    {pkg.exclusions.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <XCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Similar Destinations */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-border/60 pt-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[2px] text-sky-600 dark:text-sky-400 mb-2">
                Discover More
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-6">
                Similar Escapes in {pkg.region}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Booking Card */}
        <div className="h-fit rounded-3xl border border-border/80 bg-card p-6 shadow-lg lg:sticky lg:top-24 space-y-6">
          <div className="border-b border-border/60 pb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Curated Itinerary Pricing
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-foreground">
                {formatPrice(pkg.price)}
              </span>
              <span className="text-xs text-muted-foreground">/ guest</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Includes handpicked stays, private fleet transfers, and certified local guides.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Duration:</span>
              <strong className="text-foreground">{formatDuration(pkg.duration)}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Group Size:</span>
              <strong className="text-foreground">Up to {pkg.groupSize} Guests</strong>
            </div>
            {pkg.difficulty && (
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Activity Level:</span>
                <strong className="text-foreground">{pkg.difficulty}</strong>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              className="w-full rounded-full font-bold shadow-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              onClick={() => setBookingOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2 text-sky-400 dark:text-sky-600" />
              Request Reservation Dates
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full rounded-full font-bold border-border/80 hover:bg-muted"
            >
              <Link to="/plan-trip" className="gap-2 justify-center">
                <Wand2 className="h-4 w-4 text-primary" />
                Customize in Trip Studio
              </Link>
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Concierge on WhatsApp
            </a>
          </div>

          <div className="pt-2 border-t border-border/60 space-y-2 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={14} />
              <span>100% Free Cancellation up to 14 days</span>
            </div>
            <p className="text-[11px]">No credit card required to request date availability.</p>
          </div>
        </div>
      </div>

      <BookingWizard pkg={pkg} open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  )
}

export default DestinationDetail
