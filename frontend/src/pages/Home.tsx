import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { Button } from "src/components/ui/button"
import Hero from "src/components/travel/Hero"
import TravelCategories from "src/components/travel/TravelCategories"
import WhyChooseUs from "src/components/travel/WhyChooseUs"
import HowItWorks from "src/components/travel/HowItWorks"
import TravelQuiz from "src/components/travel/TravelQuiz"
import Testimonials from "src/components/travel/Testimonials"
import FAQSection from "src/components/travel/FAQSection"
import Newsletter from "src/components/travel/Newsletter"
import PackageCard from "src/components/travel/PackageCard"
import { getPackages, type TravelPackage } from "src/lib/data/packages"
import { ScrollReveal } from "src/components/common/ScrollReveal"

function Home() {
  const [packages, setPackages] = useState<TravelPackage[]>([])

  useEffect(() => {
    setPackages(getPackages())
  }, [])

  const regions = Array.from(new Set(packages.map((p) => p.region)))
  const featured = [...packages].sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div className="space-y-0">
      <Hero regions={regions} />

      <ScrollReveal variant="blur-in" duration={900}>
        <TravelCategories />
      </ScrollReveal>

      <ScrollReveal variant="slide-up" duration={800}>
        <WhyChooseUs />
      </ScrollReveal>

      <ScrollReveal variant="scale-up" duration={900}>
        <HowItWorks />
      </ScrollReveal>

      <ScrollReveal variant="slide-up" duration={800}>
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="mb-2 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
                  Explore Packages
                </span>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Featured Vacations</h2>
                <p className="mt-2 text-muted-foreground">
                  Handpicked trips across India&apos;s most breathtaking destinations.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/destinations">
                  View All Destinations <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="flip-up" duration={1000}>
        <TravelQuiz />
      </ScrollReveal>

      <ScrollReveal variant="slide-up" duration={800}>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal variant="slide-up" duration={800}>
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal variant="scale-up" duration={1000}>
        <Newsletter />
      </ScrollReveal>
    </div>
  )
}

export default Home
