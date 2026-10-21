import Hero from "src/components/travel/Hero"
import AboutUsSection from "src/components/travel/AboutUsSection"
import TopPackagesCarousel from "src/components/travel/TopPackagesCarousel"
import HowItWorks from "src/components/travel/HowItWorks"
import Testimonials from "src/components/travel/Testimonials"
import FAQSection from "src/components/travel/FAQSection"
import BookingCTA from "src/components/travel/BookingCTA"

function Home() {
  return (
    <div className="space-y-0">
      {/* 1. Hero: Giant Wordmark + Landscape Photo + Capsule Search */}
      <Hero />

      {/* 2. About Us: Your Trusted Seamless Hotel/Escape Booking */}
      <AboutUsSection />

      {/* 3. Explore Top Destinations: 5 Packages Slider Carousel */}
      <TopPackagesCarousel />

      {/* 4. Simple Steps To Book Your Ideal Hotel */}
      <HowItWorks />

      {/* 5. What Our Travelers Are Saying */}
      <Testimonials />

      {/* 6. Frequently Asked Questions (2-column accordion) */}
      <FAQSection />

      {/* 7. Book Now And Enjoy Exclusive Deals (CTA Banner + Cloud Horizon) */}
      <BookingCTA />
    </div>
  )
}

export default Home
