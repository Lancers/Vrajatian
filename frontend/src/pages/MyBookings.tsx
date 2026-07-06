import { BookingTabs } from "src/components/dashboard/BookingTabs"
import { bookings } from "src/lib/data/bookings"

function MyBookings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <BookingTabs bookings={bookings} />
    </div>
  )
}

export default MyBookings
