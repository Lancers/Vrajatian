import { Users } from "lucide-react"

import { StatusBadge } from "src/components/common/StatusBadge"
import { STATUS_LABEL, STATUS_TONE, type BookingRequest } from "src/lib/data/booking-requests"
import { formatDateDDMMYYYY } from "src/lib/utils"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

interface TripRequestCardProps {
  request: BookingRequest
}

function TripRequestCard({ request }: TripRequestCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-foreground">{request.packageTitle || "Custom trip proposal"}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDateDDMMYYYY(request.startDate)} • {request.travelers} traveller
            {request.travelers === 1 ? "" : "s"} • {formatPrice(request.packagePrice)}/person
          </p>
        </div>
        <StatusBadge label={STATUS_LABEL[request.status]} tone={STATUS_TONE[request.status]} />
      </div>

      {request.specialRequests && (
        <p className="text-xs text-muted-foreground">Your notes: {request.specialRequests}</p>
      )}

      {request.adminNote && (
        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <span className="font-semibold text-foreground">Note from our team: </span>
          <span className="text-muted-foreground">{request.adminNote}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3 w-3" /> Submitted {formatDateDDMMYYYY(request.createdAt)}
      </div>
    </div>
  )
}

export default TripRequestCard
