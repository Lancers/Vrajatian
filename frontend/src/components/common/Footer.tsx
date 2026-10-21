import { Link } from "react-router-dom"
import { Send } from "lucide-react"

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-12 transition-colors border-t border-neutral-900">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Header row: Brand + Socials */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-12 border-b border-neutral-800">
          <div>
            <Link to="/" className="text-3xl font-black tracking-tight text-white hover:text-sky-400 transition-colors">
              Vrajatian
            </Link>
            <p className="text-xs text-neutral-400 mt-1">
              Unforgettable Experiences Start With Us
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: FacebookIcon, label: "Facebook", href: "#" },
              { icon: TwitterIcon, label: "Twitter", href: "#" },
              { icon: InstagramIcon, label: "Instagram", href: "#" },
              { icon: Send, label: "Telegram", href: "#" },
            ].map((social, i) => {
              const Icon = social.icon
              return (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all hover:scale-110"
                >
                  <Icon size={14} />
                </a>
              )
            })}
          </div>
        </div>

        {/* 4-column Links Grid matching reference image */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Column 1: Our Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  Luxury Room Booking
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=spa" className="hover:text-white transition-colors">
                  Spa &amp; Wellness Packages
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition-colors">
                  Guided City Tours
                </Link>
              </li>
              <li>
                <Link to="/corporate-trips" className="hover:text-white transition-colors">
                  Event &amp; Conference Spaces
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className="hover:text-white transition-colors">
                  Exclusive Member Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              About Us
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Our Journey
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  News &amp; Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Media &amp; Press
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  Travel Tips
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className="hover:text-white transition-colors">
                  How to Book
                </Link>
              </li>
              <li>
                <Link to="/corporate-trips" className="hover:text-white transition-colors">
                  Partner Programs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  FAQ&apos;s
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Vrajatian Hospitality Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
