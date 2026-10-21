import { Award, ShieldCheck } from "lucide-react"

interface Partner {
  name: string
  sub: string
  accolade: string
  renderLogo: () => React.ReactNode
}

const PARTNERS: Partner[] = [
  {
    name: "CONDÉ NAST",
    sub: "TRAVELER",
    accolade: "Luxury Specialist 2026",
    renderLogo: () => (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-foreground/80 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
      </svg>
    ),
  },
  {
    name: "NATIONAL",
    sub: "GEOGRAPHIC",
    accolade: "Expedition Partner",
    renderLogo: () => (
      <svg viewBox="0 0 16 22" className="h-5 w-3.5 shrink-0" fill="none">
        <rect x="1" y="1" width="14" height="20" stroke="#EAB308" strokeWidth="2.8" />
      </svg>
    ),
  },
  {
    name: "TRIPADVISOR",
    sub: "TRAVELERS' CHOICE",
    accolade: "Top 1% Worldwide",
    renderLogo: () => (
      <svg
        viewBox="0 0 28 18"
        className="h-4 w-7 text-emerald-600 dark:text-emerald-400 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="7" cy="9" r="5.5" />
        <circle cx="21" cy="9" r="5.5" />
        <circle cx="7" cy="9" r="2.2" fill="currentColor" />
        <circle cx="21" cy="9" r="2.2" fill="currentColor" />
        <path d="M10.5 5.5c2-1.5 5-1.5 7 0" />
        <polygon points="14,8.5 12.5,11.5 15.5,11.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "LONELY PLANET",
    sub: "VERIFIED CURATOR",
    accolade: "Best of India 2026",
    renderLogo: () => (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="7.5" />
        <ellipse cx="12" cy="12" rx="10.5" ry="3.5" transform="rotate(-30 12 12)" />
      </svg>
    ),
  },
  {
    name: "TRAVEL + LEISURE",
    sub: "WORLD'S BEST",
    accolade: "Nominee 2026",
    renderLogo: () => (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-foreground/80 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M4 6h8M8 6v12" />
        <path d="M15 11v4M13 13h4" />
        <path d="M19 14v4h3" />
      </svg>
    ),
  },
]

function TrustPartnerLogos() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <p className="text-[11px] font-black uppercase tracking-[3px] text-muted-foreground flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-primary" />
            Celebrated by Leading Travel Authorities
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch justify-items-center">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center justify-between border border-border/80 hover:border-neutral-900/30 dark:hover:border-white/30 bg-card px-4 py-4 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 w-full max-w-[210px] text-center"
            >
              <div className="flex items-center justify-center h-8 mb-2">
                {partner.renderLogo()}
              </div>

              <div className="space-y-0.5">
                <span className="block text-xs font-black tracking-wider text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {partner.name}
                </span>
                <span className="block text-[9px] font-bold tracking-[1.5px] text-muted-foreground uppercase">
                  {partner.sub}
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-border/50 w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span className="truncate">{partner.accolade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustPartnerLogos
