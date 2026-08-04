import { useState } from "react"
import { CheckCircle2, Eye, Mail, Phone, Trash2, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "src/components/ui/button"
import { Textarea } from "src/components/ui/textarea"
import { StatusBadge } from "src/components/common/StatusBadge"
import {
  STATUS_LABEL,
  STATUS_TONE,
  updateBookingRequestStatus,
  type BookingRequest,
  type BookingRequestStatus,
} from "src/lib/data/booking-requests"
import { formatDateDDMMYYYY } from "src/lib/utils"

interface TripRequestRowProps {
  request: BookingRequest
  onUpdated: () => Promise<void> | void
  onView: () => void
  onDelete: () => void
}

function TripRequestRow({ request, onUpdated, onView, onDelete }: TripRequestRowProps) {
  const [note, setNote] = useState(request.adminNote ?? "")
  const [updating, setUpdating] = useState<BookingRequestStatus | null>(null)

  async function handleStatus(status: Exclude<BookingRequestStatus, "new">) {
    setUpdating(status)
    try {
      await updateBookingRequestStatus(request.id, status, note.trim() || undefined)
      await onUpdated()
      toast.success(`Marked as ${STATUS_LABEL[status].toLowerCase()}.`)
    } catch {
      toast.error("Could not update this request.")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{request.fullName}</span>
            <StatusBadge label={STATUS_LABEL[request.status]} tone={STATUS_TONE[request.status]} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {request.packageTitle} • {formatDateDDMMYYYY(request.startDate)} • {request.travelers} traveller
            {request.travelers === 1 ? "" : "s"} •{" "}
            ₹{request.packagePrice.toLocaleString("en-IN")}/person
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" /> {request.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" /> {request.phone}
            </span>
          </div>
          {request.specialRequests && (
            <div className="mt-1 text-xs text-muted-foreground">Notes: {request.specialRequests}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="icon" variant="ghost" onClick={onView} aria-label="View trip request details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete trip request"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note for the traveller (visible on their profile) — e.g. payment link, confirmed dates..."
          rows={2}
          className="text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={request.status === "contacted" || updating !== null}
            onClick={() => handleStatus("contacted")}
          >
            {updating === "contacted" ? "Saving..." : "Mark Contacted"}
          </Button>
          <Button
            size="sm"
            disabled={request.status === "confirmed" || updating !== null}
            onClick={() => handleStatus("confirmed")}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            {updating === "confirmed" ? "Saving..." : "Confirm"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={request.status === "declined" || updating !== null}
            onClick={() => handleStatus("declined")}
            className="gap-1.5"
          >
            <XCircle className="h-4 w-4" />
            {updating === "declined" ? "Saving..." : "Decline"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TripRequestRow
