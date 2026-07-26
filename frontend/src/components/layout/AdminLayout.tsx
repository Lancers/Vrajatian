import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { SidebarProvider, SidebarInset } from "src/components/ui/sidebar"
import { AppSidebar } from "src/components/common/Sidebar"
import { supabase } from "src/lib/supabase"
import { isCurrentUserAdmin } from "src/lib/data/packages"
import { AdminDataProvider } from "src/components/layout/AdminDataContext"

function AdminLayout() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    // A session alone isn't enough — any registered traveller has one. Ask the
    // API whether this user is actually on the admin allow-list.
    async function verify() {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return

      if (!data.session) {
        navigate("/login", { replace: true })
        return
      }

      const admin = await isCurrentUserAdmin()
      if (cancelled) return

      if (!admin) {
        toast.error("You don't have admin access.")
        navigate("/", { replace: true })
        return
      }
      setChecking(false)
    }

    verify()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login", { replace: true })
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [navigate])

  if (checking) {
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
