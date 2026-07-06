import { Outlet } from "react-router-dom"

import { SidebarProvider, SidebarInset } from "src/components/ui/sidebar"
import { AppSidebar } from "src/components/common/Sidebar"

function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
