import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, MountainSnow } from "lucide-react"

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
  const shown = (featured.length > 0 ? featured : activities).slice(0, 3)

  if (shown.length === 0) return null

  return (
    <section className="py-20 sm:py-28 bg-muted/20 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3.5 py-1 text-xs font-bold uppercase tracking-[2px] text-sky-700 dark:text-sky-300">
              <MountainSnow className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> High Thrill Expeditions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mt-3">
              Adventure on the Edge
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              From white-water glacial rapids in Rishikesh to tandem paragliding above the Dhauladhar ranges — certified safety standards with premier mountain leaders.
            </p>
          </div>
          <Button asChild className="rounded-full gap-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-semibold px-5 text-sm shadow-xs transition-all active:scale-95">
            <Link to="/activities">
              Explore All Adventures <ArrowRight size={15} className="text-sky-400 dark:text-sky-600" />
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
