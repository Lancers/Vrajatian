import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

import { cn } from "src/lib/utils"
import { Card } from "src/components/ui/card"

const FAQS = [
  {
    question: "Can I customize the existing packages listed on the website?",
    answer:
      "Absolutely! Vrajatian is built on customizability. You can use any package as a base, then use our Trip Customizer tool to adjust duration, include/exclude specific day itineraries, select premium or budget hotel tiers, and choose specialized local activities.",
  },
  {
    question: "What does the 'Best Price Guarantee' cover?",
    answer:
      "We promise you the best value for your trip. If you find the same package details (same accommodation class, transportation, and inclusions) cheaper elsewhere within 48 hours of booking, we will match the price and credit an additional 10% of the difference to your account.",
  },
  {
    question: "What is your booking cancellation and refund policy?",
    answer:
      "We offer free cancellation with a 100% refund up to 14 days prior to your departure date. For cancellations between 7 and 13 days, a 50% refund is issued. Within 7 days of departure, bookings are non-refundable as guide permits and hotel rooms are fully pre-paid.",
  },
  {
    question: "Do you arrange flight connections and travel insurance?",
    answer:
      "Yes! While our base package prices focus on local transfers, stays, and sightseeing, you can easily toggle flight additions and comprehensive travel insurance (including medical & trip interruption coverage) during the Booking Wizard step.",
  },
  {
    question: "What safety protocols are in place for high-altitude treks?",
    answer:
      "Safety is our absolute priority. Our Himalayan treks feature certified mountaineering guides, fully stocked medical kits including portable oxygen cylinders, and a strict acclimatization schedule. We maintain a guide-to-traveler ratio of at least 1:5 on all hard-difficulty treks.",
  },
]

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function toggleFaq(idx: number) {
    setOpenIdx((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <HelpCircle size={14} /> F.A.Q.
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">Common Travel Questions</h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about customizing, booking, and executing your perfect Indian holiday.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <Card
                key={idx}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all duration-300 p-0 relative bg-card",
                  isOpen
                    ? "border-primary shadow-sm bg-card"
                    : "border-border/60 hover:border-border hover:bg-card/75"
                )}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className={cn(
                    "font-bold text-sm sm:text-base pr-4 transition-all duration-300",
                    isOpen ? "text-primary border-l-2 border-primary pl-3" : "text-foreground"
                  )}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t px-6 pb-6 pt-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
