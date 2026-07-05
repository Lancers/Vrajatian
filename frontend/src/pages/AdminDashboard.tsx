import { Users, ClipboardList, Luggage, MessageSquare } from "lucide-react"

import { cn } from "src/lib/utils"

const stats = [
  { label: "Trip Requests", value: "24", icon: ClipboardList },
  { label: "Active Clients", value: "156", icon: Users },
  { label: "Confirmed Bookings", value: "89", icon: Luggage },
  { label: "Unread Messages", value: "12", icon: MessageSquare },
]

const recentRequests = [
  { id: "TR-001", client: "Rajesh Sharma", destination: "Gujarat", date: "2026-07-03", status: "Pending" },
  { id: "TR-002", client: "Priya Patel", destination: "Rajasthan", date: "2026-07-02", status: "Approved" },
  { id: "TR-003", client: "Amit Singh", destination: "Kerala", date: "2026-07-01", status: "In Review" },
  { id: "TR-004", client: "Sneha Gupta", destination: "Himachal Pradesh", date: "2026-06-30", status: "Pending" },
  { id: "TR-005", client: "Vikram Mehta", destination: "Gujarat", date: "2026-06-28", status: "Approved" },
]

function AdminDashboard() {
  return (
    <div className={cn("flex-1 space-y-6 p-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Dashboard</h1>
        <p className={cn("text-muted-foreground")}>Overview of your travel agency operations.</p>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4")}>
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
        <div className={cn("p-4 border-b")}>
          <h2 className={cn("font-semibold")}>Recent Trip Requests</h2>
        </div>
        <div className={cn("overflow-x-auto")}>
          <table className={cn("w-full text-sm")}>
            <thead>
              <tr className={cn("border-b bg-muted/50")}>
                <th className={cn("p-3 text-left font-medium")}>ID</th>
                <th className={cn("p-3 text-left font-medium")}>Client</th>
                <th className={cn("p-3 text-left font-medium")}>Destination</th>
                <th className={cn("p-3 text-left font-medium")}>Date</th>
                <th className={cn("p-3 text-left font-medium")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.id} className={cn("border-b last:border-0")}>
                  <td className={cn("p-3")}>{req.id}</td>
                  <td className={cn("p-3")}>{req.client}</td>
                  <td className={cn("p-3")}>{req.destination}</td>
                  <td className={cn("p-3")}>{req.date}</td>
                  <td className={cn("p-3")}>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium")}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
