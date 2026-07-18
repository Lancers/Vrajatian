import { cn } from "src/lib/utils"

const PARTNERS = [
  { name: "Lonely Planet", logo: "✦ Lonely Planet" },
  { name: "National Geographic", logo: "★ NAT GEO" },
  { name: "TripAdvisor", logo: "🦉 TripAdvisor" },
  { name: "MakeMyTrip", logo: "✈ make_my_trip" },
  { name: "Condé Nast", logo: "✦ CONDÉ NAST" },
  { name: "Airbnb", logo: "🏡 airbnb" }
]

function TrustPartnerLogos() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[2px] text-muted-foreground">
          As Featured In & Trusted By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className={cn(
                "text-base font-extrabold tracking-wider text-muted-foreground/60 transition-all duration-300 hover:scale-105 hover:text-foreground/90 select-none"
              )}
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustPartnerLogos
