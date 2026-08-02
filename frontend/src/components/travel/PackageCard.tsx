import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Clock, Heart, MapPin, Star, Users } from "lucide-react"

import { cn, formatDuration } from "src/lib/utils"
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
  const [liked, setLiked] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [transformStyle, setTransformStyle] = useState("")
  const [sheenStyle, setSheenStyle] = useState({ opacity: 0, x: 50, y: 50 })

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    setLiked((prev) => !prev)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate rotation angles (-2.5 to 2.5 degrees for subtle luxury effect)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((centerY - y) / centerY) * 2.5
    const rotateY = ((x - centerX) / centerX) * 2.5

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`)
    setSheenStyle({
      opacity: 0.05,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  function handleMouseLeave() {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
    setSheenStyle({ opacity: 0, x: 50, y: 50 })
  }

  return (
    <Link
      ref={cardRef}
      to={`${TYPE_BASE_PATH[pkg.type]}/${pkg.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className="group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 ease-out hover:shadow-xl [transform-style:preserve-3d] select-none"
    >
      {/* Light Sheen Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${sheenStyle.x}% ${sheenStyle.y}%, rgba(255, 255, 255, 0.4) 0%, transparent 80%)`,
          opacity: sheenStyle.opacity,
        }}
      />

      <img
        src={pkg.image}
        alt={pkg.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

      <button
        onClick={handleLike}
        aria-label="Add to wishlist"
        className={cn(
          "absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:bg-red-500/30",
          liked && "bg-red-500/30 text-red-400"
        )}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </button>

      <div className="absolute left-4 right-4 top-4 z-30 flex items-center justify-between">
        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          <MapPin size={12} className="text-sky-300" />
          {pkg.location}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
          {pkg.rating}
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-4 p-5 text-white [transform:translateZ(12px)]">
        <div>
          <h3 className="mb-1.5 text-xl font-bold leading-tight transition-colors group-hover:text-sky-300">
            {pkg.title}
          </h3>
          <p className="line-clamp-2 text-sm text-white/70">{pkg.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <Clock size={12} /> {formatDuration(pkg.duration).split(",")[0]}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <Users size={12} /> {pkg.groupSize} Max
          </span>
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/60">Starts at</span>
            <span className="text-2xl font-black">{formatPrice(pkg.price)}</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-sky-400 group-hover:text-black">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PackageCard

