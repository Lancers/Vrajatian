import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Compass, LogOut, Menu, User, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "src/lib/utils"
import { supabase } from "src/lib/supabase"
import { useAuth } from "src/lib/auth/AuthContext"
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
  const { session } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsOpen(false)
    toast.success("Logged out.")
    navigate("/")
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60")}>
      <div className={cn("container mx-auto flex h-16 items-center justify-between px-4")}>
        <Link to="/" className={cn("text-xl font-black shrink-0 flex items-center gap-2 tracking-tight hover:opacity-95")}>
          <Compass className="h-6 w-6 text-primary animate-spin [animation-duration:12s]" />
          <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">Vrajatian</span>
        </Link>

        <nav className={cn("hidden lg:flex items-center gap-8")}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative text-sm transition-colors hover:text-foreground py-1.5 px-0.5 whitespace-nowrap",
                  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-350 hover:after:origin-bottom-left hover:after:scale-x-100",
                  isActive
                    ? "text-primary font-bold after:scale-x-100"
                    : "text-muted-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={cn("hidden lg:flex items-center gap-2")}>
          {session ? (
            <>
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link to="/profile">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>

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
        <div className={cn("lg:hidden border-t bg-background/95 backdrop-blur-md")}>
          <nav className={cn("flex flex-col gap-4 px-4 py-6")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-semibold transition-colors hover:text-foreground",
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="border-t pt-4">
              {session ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

