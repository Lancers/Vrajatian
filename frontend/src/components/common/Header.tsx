import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"

import { BrandLogo } from "src/components/common/BrandLogo"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/activities", label: "Adventures" },
  { to: "/plan-trip", label: "Customizer" },
  { to: "/contact", label: "Contact" },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white shadow-2xs transition-all duration-200">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo - Stunning luxury crest emblem */}
        <Link
          to="/"
          className="group flex items-center gap-2 focus-visible:outline-none"
        >
          <BrandLogo size={42} showText={true} />
        </Link>

        {/* Desktop Navigation - Reduced, clean, spaced */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions - Clean Login link matching reference */}
        <div className="flex items-center gap-5">
          <Link
            to="/my-bookings"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors hidden sm:inline-block"
          >
            My Bookings
          </Link>

          <Button
            asChild
            className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-5 h-9 text-xs transition-all"
          >
            <Link to="/login">
              Login
            </Link>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-full shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-white px-6 py-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-base font-semibold transition-colors",
                    isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                to="/my-bookings"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-foreground"
              >
                My Bookings
              </Link>
              <Button
                asChild
                className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-5 h-9 text-xs"
              >
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
