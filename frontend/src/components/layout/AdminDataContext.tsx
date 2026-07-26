import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"

import { getAllBookingRequests, type BookingRequest } from "src/lib/data/booking-requests"
import { getAllPackages, type TravelPackage } from "src/lib/data/packages"

interface AdminDataContextValue {
  packages: TravelPackage[]
  bookingRequests: BookingRequest[]
  refreshPackages: () => Promise<void>
  refreshBookingRequests: () => Promise<void>
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null)

/**
 * Fetches packages + trip requests once when the admin section is entered,
 * and shares them across every admin page. AdminLayout stays mounted while
 * switching sidebar tabs (only the routed child swaps), so this data isn't
 * refetched on every tab click — pages call refreshPackages()/
 * refreshBookingRequests() themselves after a write to stay in sync.
 */
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])

  async function refreshPackages() {
    try {
      setPackages(await getAllPackages())
    } catch {
      setPackages([])
      toast.error("Could not load packages. Is the backend API running?")
    }
  }

  async function refreshBookingRequests() {
    try {
      setBookingRequests(await getAllBookingRequests())
    } catch {
      setBookingRequests([])
      toast.error("Could not load trip requests. Is the backend API running?")
    }
  }

  useEffect(() => {
    refreshPackages()
    refreshBookingRequests()
  }, [])

  return (
    <AdminDataContext.Provider value={{ packages, bookingRequests, refreshPackages, refreshBookingRequests }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider")
  return ctx
}
