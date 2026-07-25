import { CheckCircle2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"

import { cn, formatDateDDMMYYYY } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { StatusBadge } from "src/components/common/StatusBadge"
import { markBookingRequestContacted } from "src/lib/data/booking-requests"
import { useAdminData } from "src/components/layout/AdminDataContext"

function AdminTripRequests() {
  const { bookingRequests: requests, refreshBookingRequests } = useAdminData()

  async function handleMarkContacted(id: string) {
    try {
      await markBookingRequestContacted(id)
      await refreshBookingRequests()
      toast.success("Marked as contacted.")
    } catch {
      toast.error("Could not update this request.")
    }
  }

  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Trip Requests</h1>
        <p className={cn("text-muted-foreground")}>
          Leads from the "Book Now" wizard. Reach out on WhatsApp/phone/email, then mark them contacted.
        </p>
      </div>

      <div className={cn("rounded-lg border bg-card shadow-sm")}>
        <div className={cn("flex items-center justify-between p-4 border-b")}>
          <h2 className={cn("font-semibold")}>All Requests</h2>
          <span className="text-xs text-muted-foreground">{requests.length} total</span>
        </div>
        <div className="divide-y">
          {requests.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No trip requests yet.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{req.fullName}</span>
                    <StatusBadge label={req.status} tone={req.status === "contacted" ? "positive" : "neutral"} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {req.packageTitle} • {formatDateDDMMYYYY(req.startDate)} • {req.travelers} traveller
                    {req.travelers === 1 ? "" : "s"} •{" "}
                    ₹{req.packagePrice.toLocaleString("en-IN")}/person
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {req.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {req.phone}
                    </span>
                  </div>
                  {req.specialRequests && (
                    <div className="mt-1 text-xs text-muted-foreground">Notes: {req.specialRequests}</div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={req.status === "contacted" ? "outline" : "default"}
                  disabled={req.status === "contacted"}
                  onClick={() => handleMarkContacted(req.id)}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {req.status === "contacted" ? "Contacted" : "Mark Contacted"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTripRequests
