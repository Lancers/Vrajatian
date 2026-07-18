import { Star } from "lucide-react"

interface Testimonial {
  name: string
  initials: string
  destination: string
  rating: number
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: "Ananya Rao",
    initials: "AR",
    destination: "Kerala Backwaters",
    rating: 5,
    quote:
      "Drifting through Alleppey on our private houseboat was pure magic. Vrajatian handled every detail — from the spice garden hike to the sunset at Kovalam.",
  },
  {
    name: "Rohan Mehta",
    initials: "RM",
    destination: "Himalayan Trek — Manali",
    rating: 5,
    quote:
      "Crossing Rohtang Pass and camping under the stars was unforgettable. Our guide knew every ridge and hidden meadow. Best-organized trek we've ever done.",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    destination: "Rajasthan Heritage Tour",
    rating: 5,
    quote:
      "From the pink lanes of Jaipur to camping in the Sam Dunes, this trip felt like living inside a fairy tale. The heritage haveli stays were stunning.",
  },
  {
    name: "Vikram Desai",
    initials: "VD",
    destination: "Rann of Kutch Experience",
    rating: 5,
    quote:
      "Walking the white salt desert under a full moon changed my perspective completely. The artisan village visits were a wonderful surprise.",
  },
  {
    name: "Meera Iyer",
    initials: "MI",
    destination: "Andaman Islands Escape",
    rating: 5,
    quote:
      "Snorkeling over Havelock's coral reefs and kayaking through the mangroves at sunrise — this was hands down our most relaxing family holiday.",
  },
  {
    name: "Arjun Kapoor",
    initials: "AK",
    destination: "Varanasi Spiritual Tour",
    rating: 4,
    quote:
      "The sunrise boat ride along the ghats and the evening Aarti ceremony were deeply moving. A trip that stays with you long after you're home.",
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-[360px] shrink-0 rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {testimonial.initials}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{testimonial.name}</span>
          <span className="text-xs text-muted-foreground">{testimonial.destination}</span>
        </div>
      </div>
      <div className="mb-3 flex gap-0.5 text-amber-400">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" stroke="currentColor" />
        ))}
      </div>
      <p className="text-sm italic leading-relaxed text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
    </div>
  )
}

function Testimonials() {
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <div className="container mx-auto mb-14 px-4 text-center">
        <span className="mb-3 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
          Traveler Stories
        </span>
        <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">Loved by Explorers Across India</h2>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Real stories from real travelers who trusted us with their dream vacations.
        </p>
      </div>

      <div
        className="[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <div className="flex w-max animate-marquee gap-6">
          {doubled.map((t, idx) => (
            <TestimonialCard key={idx} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
