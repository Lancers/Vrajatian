import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Compass } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Skeleton } from "src/components/ui/skeleton"
import { cn } from "src/lib/utils"
import PackageCard from "src/components/travel/PackageCard"
import { getPackages, type PackageType, type TravelPackage } from "src/lib/data/packages"

const TYPE_COPY: Record<PackageType, { eyebrow: string; heading: string; subheading: string; itemNamePlural: string }> = {
  trip: {
    eyebrow: "Explore Packages",
    heading: "Curated Vacations",
    subheading: "Explore highly rated travel experiences across India.",
    itemNamePlural: "vacations",
  },
  activity: {
    eyebrow: "Explore Activities",
    heading: "Adventure Activities",
    subheading: "Paragliding, rafting, and more thrilling experiences.",
    itemNamePlural: "activities",
  },
  education: {
    eyebrow: "Explore Educational Trips",
    heading: "Educational Trips",
    subheading: "Curated learning journeys for schools and colleges.",
    itemNamePlural: "educational trips",
  },
  corporate: {
    eyebrow: "Explore Corporate Trips",
    heading: "Corporate Trips & Offsites",
    subheading: "Team offsites, retreats, and corporate getaways.",
    itemNamePlural: "corporate trips",
  },
}

interface DestinationsProps {
  type?: PackageType
}

function Destinations({ type = "trip" }: DestinationsProps) {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<TravelPackage[]>([])

  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [region, setRegion] = useState(searchParams.get("region") ?? "All")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")
  const [difficulty, setDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("rating-desc")

  const copy = TYPE_COPY[type]

  const maxPriceLimit = useMemo(() => {
    return packages.length > 0 ? Math.max(...packages.map((p) => p.price)) : 150000
  }, [packages])

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
      return matchesQuery && matchesRegion && matchesPrice && matchesDifficulty
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
  }, [packages, query, region, maxPrice, difficulty, sortBy])

  function resetFilters() {
    setQuery("")
    setRegion("All")
    setMaxPrice("")
    setDifficulty("All")
    setSortBy("rating-desc")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <span className="mb-2 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
          {copy.eyebrow}
        </span>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.heading}</h1>
        <p className="mt-2 text-muted-foreground">{copy.subheading}</p>
      </div>

      <div className="mb-8 rounded-2xl border bg-card p-6 shadow-sm">
        <div className={cn("grid gap-6 lg:items-end", type === "activity" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3")}>
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Search</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${copy.itemNamePlural}...`}
              className="w-full"
            />
          </div>

          {/* Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <span>Budget Limit</span>
              <span className="text-primary font-semibold">
                Under ₹{(Number(maxPrice) || maxPriceLimit).toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max={maxPriceLimit}
              step="5000"
              value={maxPrice || maxPriceLimit}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none"
            />
          </div>

          {/* Difficulty Toggles — activities only */}
          {type === "activity" && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Difficulty</label>
              <div className="flex gap-1">
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-xs font-bold transition-all",
                      difficulty === diff
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="rating-desc">Highest Rated ★</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
            </select>
          </div>
        </div>

        {/* Region Filter Row */}
        <div className="mt-6 border-t pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground mr-2">Region:</span>
            <button
              onClick={() => setRegion("All")}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                region === "All" ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
              )}
            >
              All Regions
            </button>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                  region === r ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Showing count */}
      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filtered.length} of {packages.length} {copy.itemNamePlural}</span>
        {(query || region !== "All" || maxPrice || difficulty !== "All" || sortBy !== "rating-desc") && (
          <button onClick={resetFilters} className="text-xs text-primary font-semibold hover:underline">
            Clear All Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <Compass size={48} className="mx-auto mb-6 animate-spin text-muted-foreground [animation-duration:6s]" />
          <h3 className="mb-2 text-xl font-bold">No Matches Found</h3>
          <p className="mx-auto mb-6 max-w-sm text-muted-foreground">
            Try relaxing your search terms, choosing a different region, or adjusting your maximum budget filter.
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
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
