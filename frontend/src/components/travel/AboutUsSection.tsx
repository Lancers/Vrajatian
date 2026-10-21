import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const CITIES = [
  { name: "JAIPUR", region: "Rajasthan" },
  { name: "KERALA", region: "Kerala" },
  { name: "UDAIPUR", region: "Rajasthan" },
  { name: "GOA", region: "Goa" },
]

function AboutUsSection() {
  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow + Large Bold Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-4"
          >
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
              Your Trusted <br />
              Seamless Travel <br />
              Booking
            </h2>
          </motion.div>

          {/* Right Column: Split Imagery + Description + City Lines */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Tall Vertical Room Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7 overflow-hidden rounded-3xl bg-muted shadow-lg aspect-[3/4] border border-border/60"
            >
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Suite Interior"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Stacked Right Column: Small Pool Photo + Text + City List */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 flex flex-col justify-between space-y-6"
            >
              {/* Small Pool Photo */}
              <div className="overflow-hidden rounded-2xl bg-muted shadow-md aspect-[16/10] border border-border/60">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
                  alt="Resort Poolside"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Short summary text + Read More */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A seamless travel booking experience designed for ease, comfort, and discovering India&apos;s finest sanctuaries.
                </p>
                <Link
                  to="/destinations"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary uppercase tracking-wider underline underline-offset-4 transition-colors"
                >
                  <span>READ MORE</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Minimal City / Destination List with Dividing Lines */}
              <div className="border-t border-border/70 pt-2 space-y-0 divide-y divide-border/60">
                {CITIES.map((city) => (
                  <Link
                    key={city.name}
                    to={`/destinations?region=${encodeURIComponent(city.region)}`}
                    className="flex items-center justify-between py-2 text-xs font-extrabold tracking-widest text-foreground hover:text-primary transition-colors group"
                  >
                    <span>{city.name}</span>
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection
