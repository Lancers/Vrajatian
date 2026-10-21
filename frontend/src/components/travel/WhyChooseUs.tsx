import { useEffect, useRef, useState } from "react"
import { BadgeCheck, Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react"

import { cn } from "src/lib/utils"

const features = [
  {
    icon: ShieldCheck,
    colorClass: "bg-primary/10 text-primary",
    badge: "100% Protection",
    title: "Protected & Flexible",
    description:
      "Bank-grade encrypted bookings with guaranteed 100% money-back cancellation up to 14 days before departure.",
  },
  {
    icon: Compass,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    badge: "Authentic Access",
    title: "Handpicked Heritage Stays",
    description:
      "From royal 18th-century Rajput havelis to eco-luxury backwater houseboats, every stay is personally inspected.",
  },
  {
    icon: HeartHandshake,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge: "Local Masters",
    title: "Certified Native Guides",
    description:
      "Accompanied by licensed local historians, botanists, and mountaineers who unlock doors closed to standard tourists.",
  },
  {
    icon: BadgeCheck,
    colorClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    badge: "Price Guarantee",
    title: "Uncompromising Value",
    description:
      "Direct relationships with local partners mean transparent luxury pricing without inflated intermediary margins.",
  },
]

function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState<boolean[]>(() => features.map(() => false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index)
          if (entry.isIntersecting) {
            setRevealed((prev) => {
              const next = [...prev]
              next[idx] = true
              return next
            })
          }
        })
      },
      { threshold: 0.15 }
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3.5 py-1 text-xs font-bold uppercase tracking-[2px] text-sky-700 dark:text-sky-300 mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> The Vrajatian Distinction
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Travel With Unrivaled Confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We don&apos;t just book hotels and cabs. We curate transformative Indian encounters backed by pedigree, local kinship, and complete guest safety.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              data-index={idx}
              style={{ transitionDelay: `${idx * 120}ms` }}
              className={cn(
                "group relative rounded-2xl border border-border/80 bg-card p-8 shadow-xs transition-all duration-700 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-400/50",
                revealed[idx] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                    feature.colorClass
                  )}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-sky-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
