import { useState } from "react"
import { CreditCard, Map, Search, Sliders, CheckCircle2 } from "lucide-react"

import { cn } from "src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card"

const STEPS = [
  {
    number: "01",
    title: "Select a Base Package",
    description: "Browse our handpicked collections of vacations or search for your favorite region in India.",
    icon: Search,
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    glowColor: "shadow-sky-500/10 border-sky-500/30",
    details: [
      "200+ destinations across India",
      "Curated historical, adventure, & beach tours",
      "User-friendly filters for price and region",
    ],
    tip: "Tip: Use the search filters in the Hero banner to quickly find tours within your budget range.",
  },
  {
    number: "02",
    title: "Customize Your Itinerary",
    description: "Fine-tune the days, activities, and lodging preferences to match your perfect travel style.",
    icon: Sliders,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    glowColor: "shadow-amber-500/10 border-amber-500/30",
    details: [
      "Add or remove days easily",
      "Select adventure trails, heritage walks or spa guides",
      "Real-time cost updates based on options",
    ],
    tip: "Tip: Check out our custom travel planner tool to build an itinerary entirely from scratch.",
  },
  {
    number: "03",
    title: "Secure Your Booking",
    description: "Finalize your booking with flexible payment plans, secure gateways, and transparent pricing.",
    icon: CreditCard,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    glowColor: "shadow-emerald-500/10 border-emerald-500/30",
    details: [
      "Bank-level SSL encrypted transactions",
      "Option to pay a small token deposit first",
      "Instant email confirmation and receipt generation",
    ],
    tip: "Tip: Enjoy peace of mind with our 100% money-back guarantee policy up to 7 days before travel.",
  },
  {
    number: "04",
    title: "Travel Worry-Free",
    description: "Depart on your adventure with round-the-clock local ground support and verified safety standards.",
    icon: Map,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    glowColor: "shadow-purple-500/10 border-purple-500/30",
    details: [
      "Certified local guides on every route",
      "24/7 emergency support helpline",
      "Handpicked stays inspected for premium safety",
    ],
    tip: "Tip: Keep our emergency number handy on WhatsApp for real-time recommendations during your trip.",
  },
]

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="bg-muted/30 py-24 border-y">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full">
            Our Process
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-3">How It Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We simplify travel planning so you can focus on the journey. Here is how it works.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Step navigation with custom vertical timeline line */}
          <div className="space-y-6 lg:col-span-6 relative pl-6">
            {/* The vertical timeline connector line */}
            <div className="absolute left-[37px] top-[40px] bottom-[40px] w-0.5 bg-muted-foreground/10" />
            {/* Active filled glowing connector path */}
            <div
              className="absolute left-[37px] top-[40px] w-0.5 bg-primary transition-all duration-500"
              style={{
                height: `${(activeStep / (STEPS.length - 1)) * 82}%`,
                maxHeight: "82%"
              }}
            />

            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = activeStep === idx
              const isCompleted = idx < activeStep

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-5 rounded-2xl border p-5 transition-all duration-300 bg-background",
                    isActive
                      ? "border-primary shadow-sm scale-[1.01]"
                      : "border-border/60 hover:border-border hover:bg-card/50"
                  )}
                >
                  {/* Step index identifier bubble */}
                  <div className="mt-1.5 flex-shrink-0 z-10">
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-black border transition-colors",
                      isActive ? "bg-primary border-primary text-primary-foreground" :
                      isCompleted ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600" :
                      "bg-card border-border text-muted-foreground"
                    )}>
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className={cn(
                      "text-base font-bold transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <div className={cn(
                    "rounded-xl p-2.5 border transition-all duration-350 shrink-0",
                    isActive ? step.color : "bg-muted/50 border-transparent text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Active step details display */}
          <div className="lg:col-span-6">
            <Card className="shadow-lg border p-2 transition-all duration-500 bg-card rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-6 space-y-0">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary animate-pulse">
                    Step {STEPS[activeStep].number}
                  </span>
                  <CardTitle className="mt-1 text-2xl font-black">{STEPS[activeStep].title}</CardTitle>
                </div>
                <div className={cn("rounded-2xl p-4 shrink-0 border", STEPS[activeStep].color)}>
                  {(() => {
                    const ActiveIcon = STEPS[activeStep].icon
                    return <ActiveIcon className="h-7 w-7" />
                  })()}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Included Services & Inclusions:
                  </h4>
                  <ul className="space-y-2.5">
                    {STEPS[activeStep].details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-muted/60 border border-muted p-4 text-xs font-medium italic text-muted-foreground">
                  {STEPS[activeStep].tip}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
