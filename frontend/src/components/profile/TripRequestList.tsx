import { Compass } from "lucide-react"

import type { BookingRequest } from "src/lib/data/booking-requests"
import TripRequestCard from "./TripRequestCard"

interface TripRequestListProps {
  requests: BookingRequest[]
}

function TripRequestList({ requests }: TripRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        <Compass className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        No trip requests yet. Plan a trip and it'll show up here.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <TripRequestCard key={request.id} request={request} />
      ))}
    </div>
  )
}

export default TripRequestList
