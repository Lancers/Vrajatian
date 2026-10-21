import { useEffect, useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Compass, Search, Sparkles, RotateCcw, ChevronDown } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Skeleton } from "src/components/ui/skeleton"
import { cn } from "src/lib/utils"
import PackageCard from "src/components/travel/PackageCard"
import { getPackages, type PackageType, type TravelPackage } from "src/lib/data/packages"

const TYPE_COPY: Record<PackageType, { eyebrow: string; heading: string; subheading: string; itemNamePlural: string }> = {
  trip: {
    eyebrow: "Curated Vacations",
    heading: "Iconic Indian Journeys",
    subheading: "Handcrafted private itineraries through India's most extraordinary royal, coastal, and spiritual landscapes.",
    itemNamePlural: "escapes",
  },
  activity: {
    eyebrow: "Adventure Expeditions",
    heading: "Thrills on the Edge",
    subheading: "Conquer white-water rapids, tandem paragliding, and desert dune safaris led by certified mountain leaders.",
    itemNamePlural: "activities",
  },
  education: {
    eyebrow: "Educational Journeys",
    heading: "Ecology & Heritage Studies",
    subheading: "Curated learning immersions, stream hydrology, and biodiversity camps for schools and universities.",
    itemNamePlural: "educational trips",
  },
  corporate: {
    eyebrow: "Executive Retreats",
    heading: "Leadership & Offsites",
    subheading: "Bespoke executive retreats, strategy hackathons, and catamaran sundowners in 5-star beachfront sanctuaries.",
    itemNamePlural: "corporate retreats",
  },
}

interface DestinationsProps {
  type?: PackageType
}

function Destinations({ type = "trip" }: DestinationsProps) {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<TravelPackage[]>([])

  const initialQuery = searchParams.get("q") ?? searchParams.get("destination") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState(searchParams.get("region") ?? "All")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")
  const [difficulty, setDifficulty] = useState("All")
  const [durationFilter, setDurationFilter] = useState("All")
  const [sortBy, setSortBy] = useState("rating-desc")

  const copy = TYPE_COPY[type]

  const maxPriceLimit = useMemo(() => {
    return packages.length > 0 ? Math.max(...packages.map((p) => p.price)) : 100000
  }, [packages])

  useEffect(() => {
    const q = searchParams.get("q") ?? searchParams.get("destination") ?? ""
    if (q) setQuery(q)
    const reg = searchParams.get("region")
    if (reg) setRegion(reg)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    getPackages({ type })
      .then((pkgs) => setPackages(pkgs))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [type])

  const regions = useMemo(() => Array.from(new Set(packages.map((p) => p.region))), [packages])

  const filtered = useMemo(() => {
    const res = packages.filter((pkg) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        pkg.location.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q)
      const matchesRegion = region === "All" || pkg.region === region
      const matchesPrice = !maxPrice || pkg.price <= Number(maxPrice)
      const matchesDifficulty =
        type !== "activity" || difficulty === "All" || pkg.difficulty === difficulty

      // Duration filter helper
      const days = parseInt(pkg.duration) || 0
      let matchesDuration = true
      if (durationFilter === "short") matchesDuration = days <= 3
      else if (durationFilter === "mid") matchesDuration = days >= 4 && days <= 6
      else if (durationFilter === "long") matchesDuration = days >= 7

      return matchesQuery && matchesRegion && matchesPrice && matchesDifficulty && matchesDuration
    })

    if (sortBy === "price-asc") {
      res.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      res.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating-desc") {
      res.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "duration-asc") {
      const getDays = (str: string) => parseInt(str) || 0
      res.sort((a, b) => getDays(a.duration) - getDays(b.duration))
    }

    return res
  }, [packages, query, region, maxPrice, difficulty, durationFilter, sortBy, type])

  function resetFilters() {
    setQuery("")
    setRegion("All")
    setMaxPrice("")
    setDifficulty("All")
    setDurationFilter("All")
    setSortBy("rating-desc")
  }

  const hasActiveFilters = query || region !== "All" || maxPrice || difficulty !== "All" || durationFilter !== "All" || sortBy !== "rating-desc"

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Editorial Page Header */}
      <div className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3.5 py-1 text-xs font-bold uppercase tracking-[2px] text-sky-700 dark:text-sky-300 mb-3 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> {copy.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
          {copy.heading}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {copy.subheading}
        </p>
      </div>

      {/* Category Pills Switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border/60 pb-4">
        {[
          { typeKey: "trip", label: "Curated Vacations", path: "/destinations" },
          { typeKey: "activity", label: "Adventure Activities", path: "/activities" },
          { typeKey: "education", label: "Educational Journeys", path: "/educational-trips" },
          { typeKey: "corporate", label: "Corporate Offsites", path: "/corporate-trips" },
        ].map((item) => (
          <Link
            key={item.typeKey}
            to={item.path}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              type === item.typeKey
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Filter Station Card */}
      <div className="mb-10 rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
        <div className={cn("grid gap-5 lg:items-end", type === "activity" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-4")}>
          {/* Search Query */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Search {copy.itemNamePlural}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search location or name...`}
                className="pl-9 h-11 rounded-xl bg-background border-border/80 text-sm shadow-2xs"
              />
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Duration
            </label>
            <div className="relative">
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="flex h-11 w-full appearance-none cursor-pointer rounded-xl border border-border/80 bg-background pl-3.5 pr-9 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              >
                <option value="All">Any Duration</option>
                <option value="short">Weekend (1-3 Days)</option>
                <option value="mid">Mid-Week (4-6 Days)</option>
                <option value="long">Grand Tour (7+ Days)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Budget Limit Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Budget Limit</span>
              <span className="text-foreground font-bold">
                Under ₹{(Number(maxPrice) || maxPriceLimit).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="py-2.5">
              <input
                type="range"
                min="5000"
                max={maxPriceLimit}
                step="2500"
                value={maxPrice || maxPriceLimit}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted border border-border/60 transition-all focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 dark:[&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>

          {/* Sort Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-11 w-full appearance-none cursor-pointer rounded-xl border border-border/80 bg-background pl-3.5 pr-9 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              >
                <option value="rating-desc">Highest Rated ★</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Region Filter Pill Bar */}
        {regions.length > 0 && (
          <div className="border-t border-border/60 pt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Region:
            </span>
            <button
              onClick={() => setRegion("All")}
              className={cn(
                "rounded-full border px-3.5 py-1 text-xs font-semibold transition-all",
                region === "All"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs border-transparent font-bold"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              All Regions
            </button>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "rounded-full border px-3.5 py-1 text-xs font-semibold transition-all",
                  region === r
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs border-transparent font-bold"
                    : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Showing count and reset bar */}
      <div className="mb-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>Showing <strong className="text-foreground">{filtered.length}</strong> of {packages.length} {copy.itemNamePlural}</span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
          >
            <RotateCcw size={12} /> Reset All Filters
          </button>
        )}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 p-16 text-center bg-card/40">
          <Compass size={48} className="mx-auto mb-4 animate-spin text-sky-600 [animation-duration:8s]" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">No Matching Experiences</h3>
          <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Try relaxing your search keywords, broadening your budget range, or clearing active region filters.
          </p>
          <Button onClick={resetFilters} className="rounded-full font-semibold px-6 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 shadow-sm">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Destinations
