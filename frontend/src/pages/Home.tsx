import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Compass } from "lucide-react"

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
import CustomizerPromo from "src/components/travel/CustomizerPromo"

function Home() {
  const [packages, setPackages] = useState<TravelPackage[]>([])

  useEffect(() => {
    getPackages()
      .then((pkgs) => setPackages(pkgs))
      .catch(() => setPackages([]))
  }, [])

  const regions = Array.from(new Set(packages.map((p) => p.region)))

  // Featured vacations
  const featuredPackages = useMemo(() => {
    const flagged = packages.filter((p) => p.isFeatured)
    return flagged.length > 0 ? flagged : [...packages].sort((a, b) => b.rating - a.rating).slice(0, 6)
  }, [packages])

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
          <div className="container mx-auto px-4 space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="mb-2 inline-block text-sm font-extrabold uppercase tracking-[3px] text-primary">
                  Explore Packages
                </span>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Featured Vacations</h2>
                <p className="mt-2 text-muted-foreground">
                  Handpicked trips across India&apos;s most breathtaking destinations.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/destinations">
                    View All Destinations <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Vacation Cards Grid */}
            {featuredPackages.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <Compass size={40} className="mx-auto mb-4 animate-spin text-muted-foreground [animation-duration:6s]" />
                <h4 className="font-bold text-base mb-1">No Vacation Packages Found</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  We are working on bringing new custom tours shortly. Check out other zones!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>
      
      <ScrollReveal variant="slide-up" duration={900}>
        <CustomizerPromo />
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
