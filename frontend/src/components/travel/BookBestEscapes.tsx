import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const ESCAPES = [
  {
    id: "grand-jaipur",
    title: "The Grand Jaipur Palace",
    location: "Jaipur, Rajasthan",
    price: "From ₹14,500/nt",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
    slug: "royal-rajasthan-desert-forts",
  },
  {
    id: "kumarakom-suites",
    title: "Kumarakom Lagoon Suites",
    location: "Alleppey, Kerala",
    price: "From ₹18,000/nt",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
    slug: "kerala-backwaters-houseboat-retreat",
  },
  {
    id: "haveli-boutique",
    title: "Umaid Heritage Haveli",
    location: "Jodhpur, Rajasthan",
    price: "From ₹24,000/nt",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    slug: "royal-rajasthan-desert-forts",
  },
  {
    id: "goa-beach-resort",
    title: "Goa Coastal Beachfront Resort",
    location: "South Goa, Beachfront",
    price: "From ₹22,000/nt",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
    slug: "goa-pristine-coastline-latin-quarters",
  },
  {
    id: "himalayan-eco-lodge",
    title: "Wildflower Himalayan Lodge",
    location: "Shimla, Himachal Pradesh",
    price: "From ₹26,000/nt",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1000&q=80",
    slug: "himalayan-heights-manali-rohtang",
  },
]

function BookBestEscapes() {
  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Book The Best Hotels
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            Choose from a wide selection of sanctuaries tailored to your journey. Reserve your stay with confidence and unlock extraordinary memories.
          </motion.p>
        </div>

        {/* Asymmetrical Staggered Grid matching reference layout */}
        <div className="space-y-12">
          {/* Row 1: Left Card & Right Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            {/* Card 1: Left */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="md:col-span-5"
            >
              <Link
                to={`/destinations/${ESCAPES[0].slug}`}
                className="group block space-y-3"
              >
                <div className="overflow-hidden rounded-3xl bg-muted aspect-[4/3] border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                  <img
                    src={ESCAPES[0].image}
                    alt={ESCAPES[0].title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {ESCAPES[0].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{ESCAPES[0].location}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {ESCAPES[0].price}
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-2" />

            {/* Card 2: Right */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:col-span-5"
            >
              <Link
                to={`/destinations/${ESCAPES[1].slug}`}
                className="group block space-y-3"
              >
                <div className="overflow-hidden rounded-3xl bg-muted aspect-[4/3] border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                  <img
                    src={ESCAPES[1].image}
                    alt={ESCAPES[1].title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {ESCAPES[1].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{ESCAPES[1].location}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {ESCAPES[1].price}
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Row 2: Center Top Card (Andung style) */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              <Link
                to={`/destinations/${ESCAPES[2].slug}`}
                className="group block space-y-3 text-center"
              >
                <div className="overflow-hidden rounded-2xl bg-muted aspect-[16/9] border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                  <img
                    src={ESCAPES[2].image}
                    alt={ESCAPES[2].title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 px-1">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {ESCAPES[2].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{ESCAPES[2].location}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {ESCAPES[2].price}
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Row 3: Left Card & Right Card + Explore More */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Card 4: Left */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="md:col-span-5 space-y-6"
            >
              <Link
                to={`/destinations/${ESCAPES[3].slug}`}
                className="group block space-y-3"
              >
                <div className="overflow-hidden rounded-3xl bg-muted aspect-[4/3] border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                  <img
                    src={ESCAPES[3].image}
                    alt={ESCAPES[3].title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {ESCAPES[3].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{ESCAPES[3].location}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {ESCAPES[3].price}
                  </span>
                </div>
              </Link>

              {/* Explore More link matching reference */}
              <div>
                <Link
                  to="/destinations"
                  className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary uppercase tracking-wider underline underline-offset-4 transition-colors"
                >
                  <span>Explore More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-2" />

            {/* Card 5: Right */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:col-span-5"
            >
              <Link
                to={`/destinations/${ESCAPES[4].slug}`}
                className="group block space-y-3"
              >
                <div className="overflow-hidden rounded-3xl bg-muted aspect-[4/3] border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                  <img
                    src={ESCAPES[4].image}
                    alt={ESCAPES[4].title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {ESCAPES[4].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{ESCAPES[4].location}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {ESCAPES[4].price}
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookBestEscapes
