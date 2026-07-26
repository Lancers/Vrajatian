import { useState } from "react"
import { Link } from "react-router-dom"
import { Car, Hotel, Sparkles, Wand2 } from "lucide-react"

import { Button } from "src/components/ui/button"
import { cn } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

function CustomizerPromo() {
  // Interactive mockup state for user engagement
  const [hotelTier, setHotelTier] = useState<"budget" | "luxury">("luxury")
  const [transitTier, setTransitTier] = useState<"suv" | "flight">("flight")

  const basePrice = 24000
  const hotelPrice = hotelTier === "luxury" ? 9600 : -3600
  const transitPrice = transitTier === "flight" ? 16000 : 4500
  const totalPrice = basePrice + hotelPrice + transitPrice

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-background to-muted/20 border-t">
      {/* Dynamic background glow shapes */}
      <div className="absolute left-1/3 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-10 bottom-10 -z-10 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left info column */}
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 border-primary/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Tailor-Made Journeys
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">
              Don&apos;t just book a trip.<br />
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                Design your adventure.
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Every traveler is unique. With Vrajatian&apos;s smart customizer engine, you can select standard package itineraries and upgrade them to fit your exact budget, group size, and luxury requirements.
            </p>

            <div className="space-y-4">
              {[
                { title: "Flex Hotel Stays", desc: "Select clean hostels, boutique comfortable hotels, or elite 5★ palaces." },
                { title: "Custom Transit Lines", desc: "Toggle sleeper class local trains, private driver SUV hire, or airport flight links." },
                { title: "Tailored Excursions", desc: "Add custom requests, specialized local guides, and dietary options in one form." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="rounded-full gap-2 font-bold px-8 shadow-md">
              <Link to="/plan-trip">
                Open Trip Customizer <Wand2 className="h-4.5 w-4.5" />
              </Link>
            </Button>
          </div>

          {/* Right Column: Interactive selection mockup preview */}
          <div className="lg:col-span-6 relative">
            {/* The Glassmorphism customizer mockup panel */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-border bg-card/65 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b pb-4 mb-5">
                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-wide">Interactive Preview</span>
                  <h3 className="font-bold text-base mt-0.5">Kerala Customizer</h3>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full px-2.5 py-1 text-xs font-bold">
                  Live Calculator
                </div>
              </div>

              <div className="space-y-5">
                {/* Accommodation Selection Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Hotel size={13} /> Hotel Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHotelTier("budget")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        hotelTier === "budget"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 font-bold"
                          : "hover:bg-accent/40"
                      )}
                    >
                      <span>Budget Homestay</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        -15% Off base
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHotelTier("luxury")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        hotelTier === "luxury"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 font-bold"
                          : "hover:bg-accent/40"
                      )}
                    >
                      <span>5★ Luxury Resort</span>
                      <span className="block text-[10px] font-medium text-emerald-600 mt-0.5 font-bold">
                        +40% Premium
                      </span>
                    </button>
                  </div>
                </div>

                {/* Transit Selection Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Car size={13} /> Transit Connection
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransitTier("suv")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        transitTier === "suv"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 font-bold"
                          : "hover:bg-accent/40"
                      )}
                    >
                      <span className="flex items-center gap-1">Comfort AC SUV</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        +₹4,500
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransitTier("flight")}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all text-xs",
                        transitTier === "flight"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 font-bold"
                          : "hover:bg-accent/40"
                      )}
                    >
                      <span className="flex items-center gap-1">Flight + Transfer</span>
                      <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">
                        +₹16,000
                      </span>
                    </button>
                  </div>
                </div>

                {/* Simulated Price summary card */}
                <div className="rounded-xl border bg-muted/40 p-4 mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Base package (7 days):</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Hotel adjustment:</span>
                    <span className={hotelPrice > 0 ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                      {hotelPrice > 0 ? "+" : ""}{formatPrice(hotelPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Transit connection:</span>
                    <span>+{formatPrice(transitPrice)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 font-black text-sm">
                    <span>Est. Total Cost:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomizerPromo
