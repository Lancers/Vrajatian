import { Link } from "react-router-dom"
import { Home } from "lucide-react"

import { Button } from "src/components/ui/button"

function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="relative">
        <h1 className="text-8xl font-bold tracking-tighter text-primary/20 sm:text-9xl">
          404
        </h1>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Lost your way?</h2>
        <p className="max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/destinations">
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: "rotate(180deg)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 8 12 16 8 8 12 10 16 8" />
              </svg>
              Browse Destinations
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
    </div>
  )
}

export default NotFound
