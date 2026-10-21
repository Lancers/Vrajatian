interface BrandLogoProps {
  className?: string
  showText?: boolean
  size?: number
}

export function BrandLogo({ className = "", showText = true, size = 38 }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Stunning Luxury Vector Crest Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Outer Rounded Shield / Frame with Subtle Ring */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          className="fill-neutral-950 transition-colors group-hover:fill-neutral-900"
        />
        
        {/* Fine Inner Border */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="11"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        {/* Dynamic Faceted "V" Luxury Crest with Origami Wings */}
        <path
          d="M13 14L24 35L35 14L29.5 14L24 26.5L18.5 14H13Z"
          fill="url(#v-gradient-light)"
        />
        
        {/* Accent Wing facet */}
        <path
          d="M24 35L35 14H29.5L24 26.5V35Z"
          fill="#38bdf8"
          fillOpacity="0.85"
        />

        {/* Center North Star / Zenith Compass Spark */}
        <path
          d="M24 10L25.2 13.5L28 14L25.2 14.5L24 18L22.8 14.5L20 14L22.8 13.5L24 10Z"
          fill="#ffffff"
        />

        <defs>
          <linearGradient id="v-gradient-light" x1="13" y1="14" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Luxury Typography Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 leading-none group-hover:text-sky-700 transition-colors">
            VRAJATIAN
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.28em] text-neutral-400 leading-none mt-1">
            SANCTUARIES &amp; STAYS
          </span>
        </div>
      )}
    </div>
  )
}

export default BrandLogo
