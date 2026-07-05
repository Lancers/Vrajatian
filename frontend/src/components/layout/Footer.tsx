import { Link } from "react-router-dom"
import { MapPin, Phone, Mail } from "lucide-react"

import { cn } from "src/lib/utils"

function Footer() {
  return (
    <footer className={cn("border-t bg-background py-8")}>
      <div className={cn("container mx-auto px-4")}>
        <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-3")}>
          <div>
            <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground")}>
              Company
            </h3>
            <ul className={cn("space-y-2 text-sm text-muted-foreground")}>
              <li>
                <Link to="/" className={cn("hover:text-foreground transition-colors")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={cn("hover:text-foreground transition-colors")}>
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className={cn("hover:text-foreground transition-colors")}>
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link to="/contact" className={cn("hover:text-foreground transition-colors")}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground")}>
              Destinations
            </h3>
            <ul className={cn("space-y-2 text-sm text-muted-foreground")}>
              <li>
                <Link to="/destinations" className={cn("hover:text-foreground transition-colors")}>
                  Gujarat
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={cn("hover:text-foreground transition-colors")}>
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={cn("hover:text-foreground transition-colors")}>
                  Kerala
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={cn("hover:text-foreground transition-colors")}>
                  Himachal Pradesh
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground")}>
              Contact
            </h3>
            <ul className={cn("space-y-3 text-sm text-muted-foreground")}>
              <li className={cn("flex items-center gap-2")}>
                <MapPin className={cn("h-4 w-4")} />
                <span>123 Travel Street, Mumbai, India</span>
              </li>
              <li className={cn("flex items-center gap-2")}>
                <Phone className={cn("h-4 w-4")} />
                <span>+91 98765 43210</span>
              </li>
              <li className={cn("flex items-center gap-2")}>
                <Mail className={cn("h-4 w-4")} />
                <span>hello@vrajatian.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={cn("mt-8 border-t pt-6 text-center text-sm text-muted-foreground")}>
          &copy; {new Date().getFullYear()} Vrajatian. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
