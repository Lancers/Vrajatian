import { Avatar, AvatarImage, AvatarFallback } from "src/components/ui/avatar"
import { Badge } from "src/components/ui/badge"
import { Card, CardContent } from "src/components/ui/card"
import { formatDateDDMMYYYY } from "src/lib/utils"
import type { Booking } from "src/lib/data/bookings"

const statusLabels: Record<Booking["status"], string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusVariants: Record<Booking["status"], "default" | "secondary" | "outline"> = {
  upcoming: "default",
  completed: "secondary",
  cancelled: "outline",
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[0_0_30px_-4px_color-mix(in_oklch,var(--accent)_65%,transparent)]">
      <Avatar className="h-48 w-full sm:h-auto sm:w-48 rounded-none">
        <AvatarImage src={booking.image} alt={booking.destination} className="object-cover" />
        <AvatarFallback className="rounded-none">{booking.destination.charAt(0)}</AvatarFallback>
      </Avatar>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg">{booking.destination}</h3>
            <p className="text-sm text-muted-foreground">Ref: {booking.ref}</p>
          </div>
          <Badge variant={statusVariants[booking.status]}>{statusLabels[booking.status]}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-muted-foreground">Dates</span>
          <span>{formatDateDDMMYYYY(booking.startDate)} — {formatDateDDMMYYYY(booking.endDate)}</span>
          <span className="text-muted-foreground">Travelers</span>
          <span>{booking.travelers} {booking.travelers === 1 ? "traveler" : "travelers"}</span>
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">{formatPrice(booking.price)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
