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
  { to: "/contact", label: "Contact" },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
      <div className={cn("container mx-auto grid h-16 grid-cols-3 items-center px-4")}>
        <Link to="/" className={cn("text-xl font-bold justify-self-start")}>
          Vrajatian
        </Link>

        <nav className={cn("hidden md:flex items-center justify-center gap-10")}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
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

        <div className={cn("flex items-center justify-end gap-2")}>
          <ThemeToggle className={cn("hidden md:flex")} />
          <div className={cn("flex items-center gap-2 md:hidden")}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={cn("md:hidden border-t bg-background")}>
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
