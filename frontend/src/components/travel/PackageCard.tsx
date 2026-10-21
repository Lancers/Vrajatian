import { useState } from "react"
import { Link } from "react-router-dom"
import { Bookmark, Star } from "lucide-react"

import { cn } from "src/lib/utils"
import type { PackageType, TravelPackage } from "src/lib/data/packages"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

const TYPE_BASE_PATH: Record<PackageType, string> = {
  trip: "/destinations",
  activity: "/activities",
  education: "/educational-trips",
  corporate: "/corporate-trips",
}

interface PackageCardProps {
  pkg: TravelPackage
}

function PackageCard({ pkg }: PackageCardProps) {
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setSaved((prev) => !prev)
  }

  // Duration clean label (e.g., "7 Days" or "2 Night Trip")
  const durationLabel = pkg.duration ? pkg.duration.split(",")[0].trim() : "Custom Trip"

  // Curated tag label (e.g., "Romantic Stay", "Heritage Stay", "Coastal Villa")
  const tagLabel = pkg.region ? `${pkg.region} Stay` : "Romantic Stay"

  return (
    <Link
      to={`${TYPE_BASE_PATH[pkg.type]}/${pkg.slug}`}
      className="group relative flex flex-col rounded-[44px] overflow-hidden bg-[#293340] shadow-[0_12px_40px_-8px_rgba(56,189,248,0.22)] hover:shadow-[0_20px_50px_-6px_rgba(56,189,248,0.38)] transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Top Section: Photo with Gradient Fade & Glass Bookmark Button */}
      <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-neutral-900 rounded-t-[44px]">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
        />

        {/* Soft natural gradient that blends the photo smoothly into the dark slate card bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#293340] via-[#293340]/30 to-transparent pointer-events-none" />

        {/* Glass Bookmark Icon Button at Top Right */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved" : "Save destination"}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-all shadow-sm"
        >
          <Bookmark
            size={18}
            className={cn("text-white transition-colors", saved && "fill-white")}
          />
        </button>
      </div>

      {/* Bottom Section: Slate Glass Body matching reference with exact 44px radius */}
      <div className="p-6 pt-1 flex flex-col justify-between flex-1 bg-[#293340] rounded-b-[44px]">
        <div>
          {/* Header Row: Title on Left, Glass Price Badge on Right */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight line-clamp-1 group-hover:text-sky-300 transition-colors">
              {pkg.title}
            </h3>

            {/* Glass Price Capsule Pill */}
            <span className="rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shrink-0 shadow-xs">
              {formatPrice(pkg.price)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed line-clamp-2 mt-2.5 font-normal">
            {pkg.description}
          </p>

          {/* Glass Chips Row: Star Rating, Category, Duration */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white">
              <Star size={13} className="text-white" />
              <span>{pkg.rating}</span>
            </span>

            <span className="inline-flex items-center rounded-full bg-white/12 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white truncate max-w-[140px]">
              {tagLabel}
            </span>

            <span className="inline-flex items-center rounded-full bg-white/12 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white">
              {durationLabel}
            </span>
          </div>
        </div>

        {/* Action Button: Full-Width White Pill Button */}
        <div className="mt-6">
          <div className="w-full rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-3.5 text-sm sm:text-base text-center shadow-md transition-all group-hover:scale-[1.01] active:scale-[0.99]">
            Book now
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PackageCard
