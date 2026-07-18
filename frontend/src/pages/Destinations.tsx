import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Compass } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Skeleton } from "src/components/ui/skeleton"
import { cn } from "src/lib/utils"
import PackageCard from "src/components/travel/PackageCard"
import { getPackages, type TravelPackage } from "src/lib/data/packages"

function Destinations() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<TravelPackage[]>([])

  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [region, setRegion] = useState(searchParams.get("region") ?? "All")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")

  useEffect(() => {
    const timer = setTimeout(() => {
      setPackages(getPackages())
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const regions = useMemo(() => Array.from(new Set(packages.map((p) => p.region))), [packages])

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        pkg.location.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q)
      const matchesRegion = region === "All" || pkg.region === region
      const matchesPrice = !maxPrice || pkg.price <= Number(maxPrice)
      return matchesQuery && matchesRegion && matchesPrice
    })
  }, [packages, query, region, maxPrice])

  function resetFilters() {
    setQuery("")
    setRegion("All")
    setMaxPrice("")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <span className="mb-2 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
          Explore Packages
        </span>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Curated Vacations</h1>
        <p className="mt-2 text-muted-foreground">Explore highly rated travel experiences across India.</p>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations..."
          className="sm:max-w-xs"
        />
        <Input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max budget (₹)"
          className="sm:max-w-[180px]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRegion("All")}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              region === "All" ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            All
          </button>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                region === r ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {r}
            </button>
          ))}
        </div>
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
          <h3 className="mb-2 text-xl font-bold">No Destinations Match</h3>
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
