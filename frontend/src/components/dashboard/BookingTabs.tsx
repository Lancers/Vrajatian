import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/components/ui/tabs"
import { BookingCard } from "src/components/dashboard/BookingCard"
import type { Booking } from "src/lib/data/bookings"

interface BookingTabsProps {
  bookings: Booking[]
}

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export function BookingTabs({ bookings }: BookingTabsProps) {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => {
        const filtered = bookings.filter((b) => b.status === tab.value)
        return (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4 mt-4">
            {filtered.length > 0 ? (
              filtered.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No {tab.label.toLowerCase()} bookings.
              </p>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
