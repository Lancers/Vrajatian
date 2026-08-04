import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Card, CardContent } from "src/components/ui/card"
import { useAuth } from "src/lib/auth/AuthContext"

const CONFIRM_TIMEOUT_MS = 8_000

/**
 * Landing page for the Supabase confirmation-email link. supabase-js's
 * detectSessionInUrl (default true) parses the link's tokens automatically on
 * load and fires a SIGNED_IN auth event — we just wait for AuthContext to
 * pick that up, then send the traveller on to their profile.
 */
function EmailCallback() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (session) {
      const t = setTimeout(() => navigate("/profile", { replace: true }), 1200)
      return () => clearTimeout(t)
    }
  }, [session, navigate])

  useEffect(() => {
    if (loading || session) return
    const t = setTimeout(() => setTimedOut(true), CONFIRM_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [loading, session])

  const failed = !loading && !session && timedOut

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          {failed ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 text-destructive">
                <XCircle size={28} />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold">Confirmation link didn't work</h1>
                <p className="text-sm text-muted-foreground">
                  This link may have expired or already been used. Please try logging in.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold">
                  {session ? "Email confirmed!" : "Confirming your email…"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {session
                    ? "You're logged in — taking you to your profile."
                    : "One moment while we finish signing you in."}
                </p>
              </div>
              {session && (
                <Button asChild className="w-full">
                  <Link to="/profile">Continue to your profile</Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailCallback
