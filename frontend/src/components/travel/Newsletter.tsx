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
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-8 py-16 text-center text-white shadow-2xl border border-neutral-800 md:px-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-sky-300 shadow-sm">
              <Mail className="h-3.5 w-3.5 text-sky-400" /> Curated Dispatches
            </span>
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Unlock The Untold Stories of India
            </h2>
            <p className="mb-10 text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Subscribe for private itinerary releases, seasonal festival guides, and invitation-only early privileges delivered discreetly to your inbox.
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
                  className="h-12 w-full rounded-full border border-neutral-700 bg-neutral-900 px-6 text-sm text-white placeholder-neutral-400 shadow-inner transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 rounded-full px-8 font-bold gap-2 bg-white text-neutral-950 hover:bg-neutral-100 shadow-md transition-all duration-200 shrink-0"
              >
                {loading ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <Send size={14} className="text-sky-600" />
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
