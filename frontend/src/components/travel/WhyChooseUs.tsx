import { useEffect, useRef, useState } from "react"
import { BadgeDollarSign, Globe, Shield, Users } from "lucide-react"

import { cn } from "src/lib/utils"

const features = [
  {
    icon: Shield,
    colorClass: "bg-sky-500/10 text-sky-500",
    title: "Secure Booking",
    description:
      "Your payments and personal data are protected with bank-level encryption and a full money-back guarantee.",
  },
  {
    icon: Globe,
    colorClass: "bg-emerald-500/10 text-emerald-500",
    title: "200+ Destinations",
    description:
      "From backwaters to Himalayan peaks — explore a curated catalog spanning every region of India.",
  },
  {
    icon: Users,
    colorClass: "bg-purple-500/10 text-purple-500",
    title: "Expert Local Guides",
    description:
      "Every trip is led by certified local experts who know the hidden gems, culture, and best routes.",
  },
  {
    icon: BadgeDollarSign,
    colorClass: "bg-amber-500/10 text-amber-500",
    title: "Best Price Guarantee",
    description:
      "Found it cheaper elsewhere? We'll match the price and add a 10% credit towards your next adventure.",
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
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
            Why Vrajatian
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">Travel With Confidence</h2>
          <p className="text-lg text-muted-foreground">
            We go beyond planning vacations — we craft transformative journeys backed by trust, expertise, and
            unbeatable value.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              data-index={idx}
              style={{ transitionDelay: `${idx * 120}ms` }}
              className={cn(
                "group rounded-2xl border bg-card p-8 text-center shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg",
                revealed[idx] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              <div
                className={cn(
                  "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  feature.colorClass
                )}
              >
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
