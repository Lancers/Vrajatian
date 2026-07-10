import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Compass, DollarSign, MapPin, Search } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"

const ROTATING_WORDS = ["Timeless Heritage", "Hidden Backwaters", "Himalayan Peaks", "Sun-Soaked Beaches"]

interface HeroProps {
  regions: string[]
}

function Hero({ regions }: HeroProps) {
  const navigate = useNavigate()
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("All")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
        setIsAnimating(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (region !== "All") params.set("region", region)
    if (maxPrice) params.set("maxPrice", maxPrice)
    navigate(`/destinations?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden py-28 sm:py-32">
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
        alt="Scenic travel destination"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl text-white">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] text-white backdrop-blur sm:text-sm">
            ✦ Award-Winning Travel Agency
          </span>
          <h1 className="mb-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Discover India&apos;s{" "}
            <span
              className={cn(
                "inline-block min-w-[220px] text-sky-300 transition-all duration-400 sm:min-w-[280px]",
                isAnimating ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
              )}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>
          <p className="mb-10 max-w-lg text-lg text-white/80">
            Tailor-made itineraries, handpicked stays, and expert local guides across India.
            Over 50,000 travelers have trusted Vrajatian with their dream vacations.
          </p>

          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-sky-300">200+</span>
              <span className="text-xs font-semibold text-white/70">Destinations</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-sky-300">50K+</span>
              <span className="text-xs font-semibold text-white/70">Happy Travelers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-sky-300">4.9★</span>
              <span className="text-xs font-semibold text-white/70">Average Rating</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-card/95 p-6 shadow-2xl backdrop-blur sm:mt-14 sm:flex-row sm:items-end sm:gap-6"
        >
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Where to?
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Destinations..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Region
            </label>
            <div className="relative">
              <Compass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="All">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Budget limit
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max budget..."
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="gap-2 sm:w-auto">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Hero
