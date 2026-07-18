import { useState } from "react"
import { toast } from "sonner"
import { Mail, Send } from "lucide-react"

import { Input } from "src/components/ui/input"
import { Button } from "src/components/ui/button"

function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      toast.success("Welcome Explorer! You have successfully subscribed to the Vrajatian newsletter. Check your inbox for a 15% discount code on your first customized trip.")
      setEmail("")
      setLoading(false)
    }, 800)
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-8 py-16 text-center text-white shadow-2xl border border-white/5 md:px-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-sky-300 backdrop-blur-sm shadow-sm">
              <Mail className="h-3.5 w-3.5" /> Stay In The Loop
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Unlock Exclusive Indian Escapes
            </h2>
            <p className="mb-10 text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              Subscribe to get curated itineraries, seasonal flash sales, and early-bird coupons delivered directly to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-6 text-sm text-white placeholder-white/40 shadow-inner backdrop-blur-sm transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 rounded-full px-8 font-bold gap-2 bg-gradient-to-r from-primary to-sky-500 hover:from-primary/95 hover:to-sky-500/95 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-350 shrink-0"
              >
                {loading ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <Send size={14} />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-4 text-xs text-white/40">
              We respect your privacy. Unsubscribe at any time. No spam, guaranteed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
