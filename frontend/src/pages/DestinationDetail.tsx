import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MapPin, ShieldCheck, Users } from "lucide-react"

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
import { getPackages, type TravelPackage } from "src/lib/data/packages"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

function DestinationDetail() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    setPackages(getPackages())
  }, [])

  const pkg = packages.find((p) => p.id === packageId)

  useEffect(() => {
    if (packages.length > 0 && !pkg) {
      navigate("/destinations", { replace: true })
    }
  }, [packages, pkg, navigate])

  if (!pkg) return null

  const related = packages.filter((p) => p.id !== pkg.id && p.region === pkg.region).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/destinations">Destinations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pkg.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative mb-8 h-[360px] overflow-hidden rounded-2xl sm:h-[440px]">
            <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
            <div className="absolute bottom-5 left-5 rounded-full bg-black/60 px-4 py-1.5 text-sm font-bold text-white backdrop-blur">
              {pkg.rating} ★
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <MapPin size={14} />
              <span>
                {pkg.location} • {pkg.region}
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">{pkg.title}</h1>
            <p className="text-lg text-muted-foreground">{pkg.description}</p>
          </div>

          <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:gap-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Duration</div>
              <div className="font-semibold">{pkg.duration}</div>
            </div>
            <div className="border-t pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Group limit</div>
              <div className="font-semibold">{pkg.groupSize} Travellers</div>
            </div>
            <div className="border-t pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Difficulty</div>
              <div className="font-semibold">{pkg.difficulty}</div>
            </div>
          </div>

          <Tabs defaultValue="itinerary">
            <TabsList>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">What&apos;s Included</TabsTrigger>
            </TabsList>
            <TabsContent value="itinerary" className="space-y-6">
              {pkg.itinerary.map((item) => (
                <div key={item.day} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-bold text-primary">
                    {item.day}
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="inclusions">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.inclusions.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-emerald-500">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {related.length > 0 && (
            <div className="mt-16 border-t pt-10">
              <span className="mb-2 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
                You Might Also Like
              </span>
              <h2 className="mb-6 text-2xl font-black tracking-tight">Similar Destinations</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
          <div className="mb-5 border-b pb-5">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Price starts from</div>
            <div className="text-3xl font-black">{formatPrice(pkg.price)}</div>
            <span className="text-xs text-muted-foreground">
              * Price covers local guide, hotels, and tours
            </span>
          </div>

          <div className="mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trip duration:</span>
              <strong>{pkg.duration}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max group limit:</span>
              <strong className="flex items-center gap-1">
                <Users size={14} /> {pkg.groupSize}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty:</span>
              <strong>{pkg.difficulty}</strong>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => setBookingOpen(true)}>
            Book This Trip
          </Button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Free cancellation up to 48 hours</span>
          </div>
        </div>
      </div>

      <BookingWizard pkg={pkg} open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  )
}

export default DestinationDetail
