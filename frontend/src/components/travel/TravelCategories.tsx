import { useNavigate } from "react-router-dom"
import { Anchor, ArrowRight, Crown, Mountain, Palmtree, Sparkles, Sunset } from "lucide-react"
import { Card, CardContent } from "src/components/ui/card"

const CATEGORIES = [
  {
    title: "Beach Escapes",
    description: "Relax on the golden shores of Goa and Andaman.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    icon: Palmtree,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-500 dark:text-cyan-400",
    route: "/destinations?q=Goa",
  },
  {
    title: "Mountain Adventures",
    description: "Trek alpine ranges and explore Himachal valleys.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    icon: Mountain,
    color: "from-sky-500/20 to-indigo-500/20 text-sky-500 dark:text-sky-400",
    route: "/destinations?region=Himachal+Pradesh",
  },
  {
    title: "Heritage Circuits",
    description: "Discover historic palaces and forts of Rajasthan.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    icon: Crown,
    color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    route: "/destinations?region=Rajasthan",
  },
  {
    title: "Spiritual Journeys",
    description: "Experience the historic ghats and temples of Varanasi.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80",
    icon: Sparkles,
    color: "from-purple-500/20 to-pink-500/20 text-purple-500 dark:text-purple-400",
    route: "/destinations?region=Uttar+Pradesh",
  },
  {
    title: "Backwater Cruises",
    description: "Drift along the quiet waterways of Kerala.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    icon: Anchor,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    route: "/destinations?region=Kerala",
  },
  {
    title: "Cultural Expeditions",
    description: "Explore local artisan crafts and the Rann desert.",
    image: "https://images.unsplash.com/photo-1601922046210-9edb2b4c9d8e?auto=format&fit=crop&w=800&q=80",
    icon: Sunset,
    color: "from-yellow-500/20 to-amber-600/20 text-yellow-600 dark:text-yellow-400",
    route: "/destinations?region=Gujarat",
  },
]

function TravelCategories() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full">
            Categories
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-3">Explore by Travel Style</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Find vacation destinations handpicked for your favorite travel activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <Card
                key={cat.title}
                onClick={() => navigate(cat.route)}
                className="group cursor-pointer overflow-hidden border bg-card p-0 rounded-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div className="relative h-[240px] w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  {/* Floating glassmorphism icon badge */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/30 backdrop-blur-md border border-white/20 shadow-md">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5 transition-colors group-hover:text-primary">
                    {cat.title}
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TravelCategories
