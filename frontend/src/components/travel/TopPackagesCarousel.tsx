import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

interface TopPackage {
  id: string
  title: string
  dates: string
  price: string
  image: string
  slug: string
}

const TOP_PACKAGES: TopPackage[] = [
  {
    id: "kerala",
    title: "Kerala",
    dates: "15 Nov 2026 - 21 Nov 2026",
    price: "₹28,500",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
    slug: "kerala-serene-backwaters",
  },
  {
    id: "jaipur",
    title: "Jaipur",
    dates: "22 Dec 2026 - 29 Dec 2026",
    price: "₹38,000",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
    slug: "royal-rajasthan-palaces-and-desert",
  },
  {
    id: "himachal",
    title: "Himachal",
    dates: "10 Jan 2027 - 16 Jan 2027",
    price: "₹24,500",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1200&auto=format&fit=crop",
    slug: "himalayan-heights-manali-rohtang",
  },
  {
    id: "goa",
    title: "Goa",
    dates: "04 Feb 2027 - 09 Feb 2027",
    price: "₹21,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    slug: "goa-pristine-coastline-latin-quarters",
  },
  {
    id: "varanasi",
    title: "Varanasi",
    dates: "18 Feb 2027 - 23 Feb 2027",
    price: "₹16,500",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop",
    slug: "varanasi-spiritual-ghats-and-ganga-aarti",
  },
]

function TopPackagesCarousel() {
  const [startIndex, setStartIndex] = useState(0)

  // On desktop we show 3 items. Max start index is 5 - 3 = 2.
  const maxIndex = TOP_PACKAGES.length - 3

  function handlePrev() {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  function handleNext() {
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Section Header matching uploaded reference */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Explore Top Destinations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            Get Exclusive Travel Deals To Your Favorite Sanctuaries.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center justify-between absolute -top-16 right-0 gap-2 z-20">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous destination"
              className="h-10 w-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-800 transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next destination"
              className="h-10 w-10 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Cards Track with Smooth Framer Motion */}
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex gap-5"
              animate={{ x: `-${startIndex * 34}%` }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {TOP_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] shrink-0"
                >
                  <Link
                    to={`/destinations/${pkg.slug}`}
                    className="group relative block aspect-[4/4.6] rounded-[28px] overflow-hidden shadow-md border border-neutral-200/80 bg-neutral-900 transition-transform duration-300 hover:-translate-y-1"
                  >
                    {/* Background Destination Photo */}
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-106"
                    />

                    {/* Gradient Overlay for bottom text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                    {/* Card Bottom Meta matching reference */}
                    <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3 text-white z-10">
                      {/* Left: City Name & Dates */}
                      <div className="space-y-0.5">
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
                          {pkg.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-white/85 font-medium tracking-wide">
                          {pkg.dates}
                        </p>
                      </div>

                      {/* Right: Price label & Big Price */}
                      <div className="text-right shrink-0">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-white/75">
                          Package From
                        </span>
                        <span className="block text-lg sm:text-xl font-black text-white tracking-tight">
                          {pkg.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="h-9 w-9 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-800 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOP_PACKAGES.length }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    startIndex === i ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View All Destinations link */}
          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-sky-700 uppercase tracking-widest underline underline-offset-4 transition-colors"
            >
              <span>View All 24+ Curated Escapes</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopPackagesCarousel
