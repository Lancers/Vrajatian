import { useState } from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, ClipboardList, Settings, Moon, Sun, Search, Compass } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "src/components/ui/input"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "src/components/ui/sidebar"

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Trip Request", icon: ClipboardList, path: "/admin/trip-requests" },
  { title: "Packages", icon: Compass, path: "/admin/packages" },
]

export function AppSidebar() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  const [search, setSearch] = useState("")

  const filteredMenu = menu.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Sidebar collapsible="icon">

      <SidebarHeader>
        <div className="group/logo flex h-12 items-center justify-between px-2 group-data-[collapsible=icon]:justify-center">

          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:group-hover/logo:hidden">
              V
            </div>

            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">Vrajatian</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>

          <SidebarTrigger className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:group-hover/logo:flex" />

        </div>
      </SidebarHeader>


      <SidebarContent>

        <div className="relative mx-2 mt-2 group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            placeholder="Search menu..."
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>


        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">

              {filteredMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-auto items-start py-2" asChild={!!item.path}>
                    {item.path ? (
                      <Link to={item.path}>
                        <item.icon className="mt-0.5 shrink-0" />
                        <span className="!overflow-visible">{item.title}</span>
                      </Link>
                    ) : (
                      <>
                        <item.icon className="mt-0.5 shrink-0" />
                        <span className="!overflow-visible">{item.title}</span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>


      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>

            <SidebarMenuButton>

              <Settings />

              <span>Settings</span>

            </SidebarMenuButton>

          </SidebarMenuItem>

          <SidebarMenuItem>

            <SidebarMenuButton onClick={() => setTheme(dark ? "light" : "dark")}>

              {dark ? <Sun /> : <Moon />}

              <span >
                {dark ? "Light Mode" : "Dark Mode"}
              </span>

            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
