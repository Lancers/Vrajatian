import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { SidebarProvider, SidebarInset } from "src/components/ui/sidebar"
import { AppSidebar } from "src/components/common/Sidebar"
import { useAuth } from "src/lib/auth/AuthContext"
import { isCurrentUserAdmin } from "src/lib/data/packages"
import { AdminDataProvider } from "src/components/layout/AdminDataContext"

function AdminLayout() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!session) {
      navigate("/login", { replace: true })
      return
    }

    // A session alone isn't enough — any registered traveller has one. Ask the
    // API whether this user is actually on the admin allow-list.
    let cancelled = false
    setCheckingAdmin(true)
    isCurrentUserAdmin().then((admin) => {
      if (cancelled) return
      if (!admin) {
        toast.error("You don't have admin access.")
        navigate("/", { replace: true })
        return
      }
      setIsAdmin(true)
      setCheckingAdmin(false)
    })

    return () => {
      cancelled = true
    }
  }, [authLoading, session, navigate])

  if (authLoading || checkingAdmin || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  return (
    <AdminDataProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex min-h-screen flex-col">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </AdminDataProvider>
  )
}

export default AdminLayout
