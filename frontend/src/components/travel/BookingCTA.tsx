import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "src/components/ui/button"

function BookingCTA() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 sm:pt-32 pb-44 sm:pb-56 md:pb-64 border-t border-border/60 text-center">
      <div className="container relative z-10 mx-auto px-4 sm:px-8 max-w-3xl space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
        >
          Book Exclusive Stays, <br />
          Tailored Just For You.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto"
        >
          Your dream escape is just a few clicks away.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="pt-2"
        >
          <Button
            asChild
            className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-3.5 h-12 text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Link to="/plan-trip" className="inline-flex items-center gap-2">
              <span>Start Your Journey Today!</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Vibrant, daylight fluffy cloud horizon matching reference layout */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 md:h-64 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=2000&q=90"
          alt="Daylight fluffy clouds"
          className="h-full w-full object-cover object-bottom"
        />
      </div>
    </section>
  )
}

export default BookingCTA
