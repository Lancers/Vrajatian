import { Link } from "react-router-dom"
import { ClipboardList, Luggage } from "lucide-react"

import { cn, formatDateDDMMYYYY, formatDuration } from "src/lib/utils"
import { supabase } from "src/lib/supabase"
import { Button } from "src/components/ui/button"
import { StatusBadge } from "src/components/common/StatusBadge"
import { useAdminData } from "src/components/layout/AdminDataContext"

const RECENT_LIMIT = 5

function AdminDashboard() {
  const { packages, bookingRequests: tripRequests } = useAdminData()
  // "Packages" below and its "View all" link only cover /admin/packages
  // (type === 'trip') — Activities/Educational/Corporate each have their own
  // tab, so the recent-list here is scoped to match where that link goes.
  const tripPackages = packages.filter((pkg) => pkg.type === "trip")

  const stats = [
    { label: "Trip Requests", value: String(tripRequests.length), icon: ClipboardList },
    { label: "Active Packages", value: String(packages.length), icon: Luggage },
  ]

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight")}>Dashboard</h1>
          <p className={cn("text-muted-foreground")}>Overview of your travel agency operations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-2")}>
        {stats.map((stat) => (
          <div key={stat.label} className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-sm")}>
            <div className={cn("flex items-center justify-between")}>
              <p className={cn("text-sm text-muted-foreground")}>{stat.label}</p>
              <stat.icon className={cn("h-4 w-4 text-muted-foreground")} />
            </div>
            <p className={cn("mt-2 text-3xl font-bold")}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex items-center justify-between p-4 border-b")}>
          <h2 className={cn("font-semibold")}>Recent Trip Requests</h2>
          <Link to="/admin/trip-requests" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className={cn("overflow-x-auto")}>
          <table className={cn("w-full text-sm")}>
            <thead>
              <tr className={cn("border-b bg-muted/50")}>
                <th className={cn("p-3 text-left font-medium")}>Client</th>
                <th className={cn("p-3 text-left font-medium")}>Destination</th>
                <th className={cn("p-3 text-left font-medium")}>Date</th>
                <th className={cn("p-3 text-left font-medium")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tripRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">
                    No trip requests yet.
                  </td>
                </tr>
              ) : (
                tripRequests.slice(0, RECENT_LIMIT).map((req) => (
                  <tr key={req.id} className={cn("border-b last:border-0")}>
                    <td className={cn("p-3")}>{req.fullName}</td>
                    <td className={cn("p-3")}>{req.packageTitle}</td>
                    <td className={cn("p-3")}>{formatDateDDMMYYYY(req.startDate)}</td>
                    <td className={cn("p-3")}>
                      <StatusBadge label={req.status} tone={req.status === "contacted" ? "positive" : "neutral"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex items-center justify-between p-4 border-b")}>
          <h2 className={cn("font-semibold")}>Trip Packages</h2>
          <Link to="/admin/packages" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y">
          {tripPackages.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No trip packages in the catalog yet.</p>
          ) : (
            tripPackages.slice(0, RECENT_LIMIT).map((pkg) => (
              <div key={pkg.id} className="flex flex-wrap items-center gap-3 p-4">
                {pkg.image ? (
                  <img src={pkg.image} alt={pkg.title} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Luggage className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{pkg.title}</span>
                    <StatusBadge label={pkg.status} tone={pkg.status === "published" ? "positive" : "neutral"} />
                    {pkg.isFeatured && <StatusBadge label="featured" tone="accent" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ₹{pkg.price.toLocaleString("en-IN")} • {formatDuration(pkg.duration)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
