import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Compass } from "lucide-react"

import { cn } from "src/lib/utils"

function Footer() {
  return (
    <footer className={cn("border-t bg-muted/20 py-16")}>
      <div className={cn("container mx-auto px-4")}>
        <div className={cn("grid grid-cols-1 gap-10 md:grid-cols-4")}>
          {/* Column 1: Branding & Socials */}
          <div className="space-y-4">
            <Link to="/" className={cn("text-xl font-black flex items-center gap-2 tracking-tight")}>
              <Compass className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">Vrajatian</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We design bespoke journeys, connecting curious travelers with India&apos;s most beautiful landscapes, rich history, and deep-seated culture.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.96.23 2.673.914.714.714.893 1.536.945 2.673.044.926.054 1.28.054 3.71v.63c0 2.43-.01 2.784-.054 3.71-.052 1.14-.23 1.96-.914 2.673-.714.714-1.536.893-2.673.945-.926.044-1.28.054-3.71.054h-.63c-2.43 0-2.784-.01-3.71-.054-1.14-.052-1.96-.23-2.673-.914-.714-.714-.893-1.536-.945-2.673-.044-.926-.054-1.28-.054-3.71v-.63c0-2.43.01-2.784.054-3.71.052-1.14.23-1.96.914-2.673.714-.714 1.536-.893 2.673-.945.926-.044 1.28-.054 3.71-.054h.63zm-.115 2h-.185c-2.36 0-2.68.008-3.59.05-1.006.047-1.536.216-1.9.358-.483.187-.826.41-1.187.77-.36.36-.583.704-.77 1.188-.142.364-.311.894-.358 1.9-.042.912-.05 1.232-.05 3.59v.185c0 2.36.008 2.68.05 3.59.047 1.006.216 1.536.358 1.9.187.483.41.826.77 1.187.36.36.704.583 1.188.77.364.142.894.311 1.9.358.912.042 1.232.05 3.59.05h.185c2.36 0 2.68-.008 3.59-.05 1.006-.047 1.536-.216 1.9-.358.483-.187.826-.41 1.187-.77.36-.36.583-.704.77-1.188.142-.364.311-.894.358-1.9.042-.912.05-1.232.05-3.59v-.185c0-2.36-.008-2.68-.05-3.59-.047-1.006-.216-1.536-.358-1.9-.187-.483-.41-.826-.77-1.187-.36-.36-.704-.583-1.188-.77-.364-.142-.894-.311-1.9-.358-.912-.042-1.232-.05-3.59-.05zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 10a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zm5.25-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Company links */}
          <div>
            <h3 className={cn("mb-4 text-xs font-black uppercase tracking-wider text-foreground")}>
              Company
            </h3>
            <ul className={cn("space-y-2.5 text-sm text-muted-foreground")}>
              <li>
                <Link to="/" className={cn("hover:text-primary transition-colors")}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={cn("hover:text-primary transition-colors")}>
                  Our Destinations
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className={cn("hover:text-primary transition-colors")}>
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/contact" className={cn("hover:text-primary transition-colors")}>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel Categories / Dest */}
          <div>
            <h3 className={cn("mb-4 text-xs font-black uppercase tracking-wider text-foreground")}>
              Top Destinations
            </h3>
            <ul className={cn("space-y-2.5 text-sm text-muted-foreground")}>
              <li>
                <Link to="/destinations?region=Rajasthan" className={cn("hover:text-primary transition-colors")}>
                  Rajasthan Heritage
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=Kerala" className={cn("hover:text-primary transition-colors")}>
                  Kerala Houseboats
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=Himachal+Pradesh" className={cn("hover:text-primary transition-colors")}>
                  Himachal Treks
                </Link>
              </li>
              <li>
                <Link to="/destinations?q=Goa" className={cn("hover:text-primary transition-colors")}>
                  Goa Beaches
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h3 className={cn("mb-4 text-xs font-black uppercase tracking-wider text-foreground")}>
              Get in Touch
            </h3>
            <ul className={cn("space-y-3.5 text-sm text-muted-foreground")}>
              <li className={cn("flex items-start gap-2.5")}>
                <MapPin className={cn("h-4 w-4 mt-0.5 shrink-0 text-primary")} />
                <span>123 Travel Street, Colaba, Mumbai, Maharashtra 400001</span>
              </li>
              <li className={cn("flex items-center gap-2.5")}>
                <Phone className={cn("h-4 w-4 shrink-0 text-primary")} />
                <span>+91 98765 43210</span>
              </li>
              <li className={cn("flex items-center gap-2.5")}>
                <Mail className={cn("h-4 w-4 shrink-0 text-primary")} />
                <span>hello@vrajatian.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={cn("mt-12 border-t pt-8 text-center text-xs text-muted-foreground flex flex-col sm:flex-row sm:justify-between gap-4")}>
          <span>&copy; {new Date().getFullYear()} Vrajatian Travel Pvt. Ltd. All rights reserved.</span>
          <div className="flex justify-center gap-6">
            <Link to="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="#" className="hover:text-foreground">Terms of Service</Link>
            <Link to="#" className="hover:text-foreground">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

