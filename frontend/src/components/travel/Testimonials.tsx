import { motion } from "framer-motion"
import { Star, CheckCircle2, Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    quote: "The booking process was smooth and quick. I found the perfect heritage hotel at a great price and had an unforgettable stay!",
    name: "David Kim",
    location: "Stayed in Jaipur Palace",
    role: "Verified Guest",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Excellent service and fantastic deals. I highly recommend this platform for anyone seeking hassle-free, luxury hotel bookings.",
    name: "Emily Johnson",
    location: "Stayed in Alleppey Retreat",
    role: "Verified Guest",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I loved how easy it was to find a boutique resort that fit our budget. The AI Helpdesk concierge team was incredibly helpful too.",
    name: "Michael Thompson",
    location: "Stayed in Himalayan Lodge",
    role: "Verified Guest",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "The best experience I've had with hotel reservations. Clear pricing, simple interface, zero hidden fees, and completely reliable.",
    name: "Sarah Lee",
    location: "Stayed in Goa Beachfront",
    role: "Verified Guest",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
]

function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            What Our Travelers Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            Real stories and verified experiences from travelers who booked their escapes with Vrajatian.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-neutral-200 bg-white p-6 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* 5-Star Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={16} className="text-neutral-300 rotate-180" />
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-neutral-200"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-neutral-900">
                      {t.name}
                    </span>
                    <CheckCircle2 size={11} className="text-sky-600" />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {t.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
