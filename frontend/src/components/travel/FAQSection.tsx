import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "src/lib/utils"

interface FAQItem {
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    q: "How do I book a hotel on Vrajatian?",
    a: "Browse our handpicked sanctuaries, select your dates and room category, and confirm instantly with our secured checkout. You'll immediately receive your booking confirmation and direct contact with our on-ground concierge.",
  },
  {
    q: "Is it necessary to verify my identity?",
    a: "Yes. A swift 1-minute verification protects both you and our boutique partner properties, guaranteeing expedited, keyless check-in and prioritized room allocation upon arrival.",
  },
  {
    q: "Can I modify or cancel my reservation?",
    a: "Yes. You can alter travel dates or cancel with a single click from your bookings dashboard. Most properties offer 100% full refunds up to 72 hours before check-in.",
  },
  {
    q: "Are there any hidden fees or surprise taxes?",
    a: "None whatsoever. All state luxury tariffs, resort fees, and GST are clearly broken down and displayed upfront before you make a payment.",
  },
  {
    q: "How do I secure the best seasonal deals?",
    a: "Booking at least 21 days in advance unlocks our Tier-1 member discounts. You can also apply our active promo code 'VRAJATIAN25' or connect with our AI Helpdesk for bespoke group rates.",
  },
  {
    q: "Is my personal data and payment info secure?",
    a: "We implement 256-bit SSL encryption, tokenized payment gateways, and strict privacy protection protocols compliant with international data standards.",
  },
  {
    q: "What should I do if I need support during my stay?",
    a: "Our dedicated 24/7 Concierge Support and AI Helpdesk are always on standby. Simply message us directly through the site or call your assigned property ambassador.",
  },
]

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

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
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            Everything you need to know about reserving handpicked stays, member privileges, and verified seamless check-ins.
          </motion.p>
        </div>

        {/* Single Centered Column */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs transition-all hover:border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-neutral-900 hover:text-sky-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-neutral-400 transition-transform duration-300 shrink-0 ml-3",
                      isOpen && "rotate-180 text-neutral-800"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 mt-1">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
