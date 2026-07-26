import { useMemo } from "react"
import { CalendarRange, Compass, CreditCard, Luggage } from "lucide-react"

import { BookingTabs } from "src/components/dashboard/BookingTabs"
import { bookings } from "src/lib/data/bookings"
import { cn, formatDateDDMMYYYY } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

function MyBookings() {
  // Statistics calculations
  const stats = useMemo(() => {
    const totalTrips = bookings.length
    const upcomingTrips = bookings.filter((b) => b.status === "upcoming").length
    const totalSpent = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.price, 0)

    return { totalTrips, upcomingTrips, totalSpent }
  }, [])

  // Find next upcoming trip
  const nextTrip = useMemo(() => {
    const upcoming = bookings
      .filter((b) => b.status === "upcoming")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    if (upcoming.length === 0) return null

    const startDate = new Date(upcoming[0].startDate)
    const today = new Date()
    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    return {
      ...upcoming[0],
      daysRemaining: diffDays,
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">My Bookings Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and track your active, past, and customized trip proposals.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trips Scheduled</span>
            <p className="text-3xl font-black text-foreground">{stats.totalTrips}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Luggage className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming Adventures</span>
            <p className="text-3xl font-black text-foreground">{stats.upcomingTrips}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CalendarRange className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Invested</span>
            <p className="text-3xl font-black text-foreground">{formatPrice(stats.totalSpent)}</p>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Next Trip Banner */}
      {nextTrip && (
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary to-sky-600 p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          )}
        >
          {/* Decorative background shape */}
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-5 translate-x-12 rounded-full bg-white/5 blur-xl pointer-events-none" />
          
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:15s]" /> Next Adventure
            </span>
            <h2 className="text-2xl font-black leading-tight">
              {nextTrip.destination}
            </h2>
            <p className="text-white/85 text-sm">
              Your vacation departs on <strong>{formatDateDDMMYYYY(nextTrip.startDate)}</strong>.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 z-10">
            <div className="text-center">
              <span className="text-3xl font-black leading-none block">{nextTrip.daysRemaining}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80 mt-0.5 block">
                {nextTrip.daysRemaining === 1 ? "Day Left" : "Days Left"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Tabs list */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Trip History & Status</h2>
        <BookingTabs bookings={bookings} />
      </div>
    </div>
  )
}

export default MyBookings
