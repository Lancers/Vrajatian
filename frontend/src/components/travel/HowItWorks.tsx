import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  Wifi,
  Sparkles,
  Headphones,
  KeyRound,
  Award,
} from "lucide-react"
import { Button } from "src/components/ui/button"

interface SanctuaryPreview {
  id: string
  label: string
  name: string
  location: string
  image: string
}

const SANCTUARY_TABS: SanctuaryPreview[] = [
  {
    id: "palaces",
    label: "🏰 Palaces",
    name: "Amer Royal Heritage Suite",
    location: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "villas",
    label: "🌊 Villas",
    name: "Cabo Serai Oceanfront Villa",
    location: "South Goa, Beachfront",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chalets",
    label: "🏔️ Chalets",
    name: "Wildflower Himalayan Lodge",
    location: "Shimla, Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "backwaters",
    label: "🛶 Backwaters",
    name: "Kumarakom Teak Houseboat",
    location: "Alleppey Lagoons, Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  },
]

function HowItWorks() {
  const [copied, setCopied] = useState(false)
  const [activeSanctuary, setActiveSanctuary] = useState(SANCTUARY_TABS[0])

  function handleCopy() {
    navigator.clipboard?.writeText("VRAJATIAN25")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Title + Subtitle + Trust Stat Card to eliminate empty space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 block">
                Effortless Journey
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
                Simple Steps To Book Your <br />
                Ideal Hotel.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                Experience frictionless luxury travel booking. From biometric express passes to verified best rates, every detail is crafted for complete peace of mind.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-7 py-3 h-11 text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Link to="/plan-trip" className="inline-flex items-center gap-2">
                    <span>Explore Custom Itineraries</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Left Column Trust Badge Card (Fixes the dull empty void) */}
            <div className="rounded-3xl border border-neutral-200/90 bg-neutral-50 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-800 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">The Vrajatian Standard</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">100% Verified Quality Stays</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200/80 pt-4">
                <div>
                  <span className="text-2xl font-black text-neutral-900 leading-none block">99.4%</span>
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">
                    Check-in Success
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-black text-neutral-900 leading-none block">2,400+</span>
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">
                    Curated Sanctuaries
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-medium pt-1">
                <Headphones size={13} className="text-sky-700 shrink-0" />
                <span>Dedicated 24/7 WhatsApp &amp; AI Helpdesk Concierge</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 4 Impressive, High-Impact Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* Step Card 1: Blue Card with Picture Inside */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-sky-50 border border-sky-200 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 block mb-1">
                  Step 01
                </span>
                <h3 className="text-sm font-extrabold text-sky-950 leading-snug">
                  Book Your Dream Stay, <br />
                  Simply and Quickly.
                </h3>
              </div>

              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=700&q=80"
                  alt="Resort Pool"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-neutral-900/90 px-2.5 py-1 rounded-full border border-white/20">
                    <Sparkles size={11} className="text-sky-400" /> Instant Confirmation
                  </span>
                  <span className="text-[10px] font-bold bg-neutral-900/90 px-2 py-1 rounded-full border border-white/20">
                    ★ 4.98
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Step Card 2: Titanium Apple Wallet-Style Keycard (SUPER COOL & AWESOME) */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-card border border-neutral-200 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
                  Step 02
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Verify Your Identity
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fast biometric verification generates your contactless digital room pass.
                </p>
              </div>

              {/* Realistic VIP Digital Keycard */}
              <div className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-4 border border-neutral-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <KeyRound size={13} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
                      VRAJATIAN PASS
                    </span>
                  </div>
                  <Wifi size={14} className="text-sky-400 rotate-90" />
                </div>

                <div className="space-y-0.5 pt-1">
                  <p className="text-xs font-bold text-white tracking-wide">Suite 408 • Royal Villa</p>
                  <p className="text-[9px] text-neutral-400 font-mono">ID: #VR-88219 • Guest Pass</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px]">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                    <ShieldCheck size={12} /> Contactless Key Ready
                  </span>
                  <span className="text-[9px] text-neutral-400">Tap to Unlock</span>
                </div>
              </div>
            </motion.div>

            {/* Step Card 3: Interactive Live Sanctuary Explorer (DYNAMIC & IMPRESSIVE) */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-card border border-neutral-200 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
                  Step 03
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Browse &amp; Select Hotels
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Switch between handpicked collections with real-time suite availability.
                </p>
              </div>

              {/* Interactive Sanctuary Preview Card */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5 space-y-2.5">
                {/* Clickable tabs */}
                <div className="grid grid-cols-4 gap-1">
                  {SANCTUARY_TABS.map((tab) => {
                    const isSelected = activeSanctuary.id === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSanctuary(tab)}
                        className={`text-[9px] font-bold py-1 px-1 rounded-lg truncate transition-all ${
                          isSelected
                            ? "bg-neutral-900 text-white shadow-xs"
                            : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Animated Photo Preview */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-muted shadow-xs">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeSanctuary.id}
                      src={activeSanctuary.image}
                      alt={activeSanctuary.name}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <p className="text-[11px] font-bold leading-tight truncate drop-shadow-sm">
                      {activeSanctuary.name}
                    </p>
                    <p className="text-[9px] text-white/80 truncate">
                      {activeSanctuary.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step Card 4: VIP Voucher & Best Deal (ELEGANT & CLEAR) */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-card border border-neutral-200 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
                  Step 04
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Secure the Best Deal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enjoy exclusive member discounts and our best-rate price match guarantee.
                </p>
              </div>

              {/* VIP Voucher Card with instant copy */}
              <div className="rounded-2xl border border-sky-300 bg-sky-50/80 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-950">
                    VIP Member Code
                  </span>
                  <span className="text-[10px] font-black text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-full">
                    25% OFF
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white rounded-xl border border-sky-200 px-3 py-1.5 shadow-2xs">
                  <span className="font-mono text-xs font-bold text-neutral-900 tracking-wider">
                    VRAJATIAN25
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1 pt-1 text-[10px] text-neutral-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span>Guaranteed Price-Match Protection</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span>Free 24h Flexible Cancellation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
