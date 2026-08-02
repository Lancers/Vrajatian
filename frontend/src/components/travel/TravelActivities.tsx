import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { Button } from "src/components/ui/button"
import PackageCard from "src/components/travel/PackageCard"
import { getPackages, type TravelPackage } from "src/lib/data/packages"

function TravelActivities() {
  const [activities, setActivities] = useState<TravelPackage[]>([])

  useEffect(() => {
    getPackages({ type: "activity" })
      .then((pkgs) => setActivities(pkgs))
      .catch(() => setActivities([]))
  }, [])

  const featured = activities.filter((a) => a.isFeatured)
  const shown = (featured.length > 0 ? featured : activities).slice(0, 6)

  // Nothing to show yet (no activities added in admin) — skip the section entirely.
  if (shown.length === 0) return null

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full">
              Activities
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-3">Adventure Activities</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Paragliding, rafting, and more thrilling experiences you can book on the go.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/activities">
              View All Activities <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TravelActivities
