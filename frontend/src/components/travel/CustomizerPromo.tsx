import { useState } from "react"
import { Link } from "react-router-dom"
import { Car, Hotel, Sparkles, Wand2, ArrowRight } from "lucide-react"

import { Button } from "src/components/ui/button"
import { cn } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

function CustomizerPromo() {
  const [hotelTier, setHotelTier] = useState<"budget" | "luxury">("luxury")
  const [transitTier, setTransitTier] = useState<"suv" | "flight">("flight")

  const basePrice = 28500
  const hotelPrice = hotelTier === "luxury" ? 11400 : -4200
  const transitPrice = transitTier === "flight" ? 16000 : 4500
  const totalPrice = basePrice + hotelPrice + transitPrice

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-muted/30 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left info column */}
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> Bespoke Atelier
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Do not simply take a trip.<br />
              <span className="text-sky-600 dark:text-sky-400">
                Curate your masterpiece.
              </span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Every traveler is unique. With Vrajatian&apos;s smart trip studio, you can calibrate any route to your exact taste — upgrading palace stays, choosing private chauffeur fleet, and tailoring private excursions.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: "Bespoke Accommodations", desc: "Choose authentic royal havelis, luxury tea bungalows, or 5-star palace suites with private plunge pools." },
                { title: "Chauffeured Mobility", desc: "Select comfortable AC Innova Crysta, rugged Fortuner 4x4 for mountain passes, or domestic flight transfers." },
                { title: "Private Master Guided Tours", desc: "Add personal historians, private kathakali recitals, or sunrise hot air balloon flights in one click." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold text-xs mt-0.5">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="rounded-full gap-2.5 font-bold px-8 shadow-sm bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all">
                <Link to="/plan-trip">
                  Open Trip Customizer Studio <Wand2 className="h-4 w-4 text-sky-400 dark:text-sky-600" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Live Atelier Preview */}
          <div className="lg:col-span-6 relative">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-border/80 max-w-md mx-auto relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block">Interactive Studio</span>
                  <h3 className="font-bold text-lg text-foreground mt-0.5">Kerala Backwaters Atelier</h3>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Quote
                </div>
              </div>

              <div className="space-y-5">
                {/* Accommodation Selection Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Hotel size={14} className="text-sky-600 dark:text-sky-400" /> Stays & Hospitality
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setHotelTier("budget")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        hotelTier === "budget"
                          ? "border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 ring-1 ring-sky-500/30 font-bold text-foreground"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="block font-bold">Heritage Homestay</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        -₹4,200 Off base
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHotelTier("luxury")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        hotelTier === "luxury"
                          ? "border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 ring-1 ring-sky-500/30 font-bold text-foreground"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="block font-bold">5★ Palace & Glass Houseboat</span>
                      <span className="block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">
                        +₹11,400 Premium
                      </span>
                    </button>
                  </div>
                </div>

                {/* Transit Selection Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Car size={14} className="text-sky-600 dark:text-sky-400" /> Mobility & Fleet
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTransitTier("suv")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        transitTier === "suv"
                          ? "border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 ring-1 ring-sky-500/30 font-bold text-foreground"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="block font-bold">Private Innova Crysta</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        +₹4,500 Chauffeur
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransitTier("flight")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        transitTier === "flight"
                          ? "border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 ring-1 ring-sky-500/30 font-bold text-foreground"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="block font-bold">Flight + Private Fleet</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        +₹16,000 Airfare
                      </span>
                    </button>
                  </div>
                </div>

                {/* Live Cost Breakdown */}
                <div className="rounded-2xl border border-border/80 bg-card/80 p-4 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base Curated Itinerary (6 Days):</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Stays & Hospitality:</span>
                    <span className={hotelPrice > 0 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-amber-600 font-semibold"}>
                      {hotelPrice > 0 ? "+" : ""}{formatPrice(hotelPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Fleet & Transit:</span>
                    <span>+{formatPrice(transitPrice)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-border/60 pt-3 mt-1">
                    <span className="font-bold text-foreground text-sm">Estimated Total / Guest:</span>
                    <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full rounded-xl font-bold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 shadow-md">
                  <Link to="/plan-trip" className="gap-2 justify-center">
                    Customize This Itinerary <ArrowRight size={14} className="text-sky-400 dark:text-sky-600" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomizerPromo
