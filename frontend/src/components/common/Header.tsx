import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import ThemeToggle from "./ThemeToggle"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/plan-trip", label: "Plan a Trip" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/contact", label: "Contact" },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
      <div className={cn("container mx-auto flex h-16 items-center justify-between px-4")}>
        <Link to="/" className={cn("text-xl font-bold shrink-0")}>
          Vrajatian
        </Link>

        <nav className={cn("hidden lg:flex items-center gap-8")}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-foreground whitespace-nowrap",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={cn("flex items-center gap-2")}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={cn("lg:hidden border-t bg-background")}>
          <nav className={cn("flex flex-col gap-4 px-4 py-6")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-sm transition-colors hover:text-foreground",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
