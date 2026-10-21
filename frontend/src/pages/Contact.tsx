import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { toast } from "sonner"

import { Button } from "src/components/ui/button"
import { Card, CardContent } from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import { Textarea } from "src/components/ui/textarea"
import { Separator } from "src/components/ui/separator"

const contactInfo = [
  { icon: MapPin, label: "Address", value: "702 Himalayan Blvd, Dehradun, Uttarakhand 248001" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "hello@vrajatian.com" },
]

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const INITIAL_FORM: FormState = { name: "", email: "", subject: "", message: "" }

function buildWhatsAppUrl(form: FormState): string | null {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined
  if (!number) return null

  const text = [
    "New Contact Message",
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Subject: ${form.subject || "General Inquiry"}`,
    `Message: ${form.message}`,
  ].join("\n")

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const url = buildWhatsAppUrl(form)
    if (!url) {
      toast.error("WhatsApp isn't configured yet. Please try again later.")
      return
    }

    window.open(url, "_blank", "noopener,noreferrer")
    toast.success("Opening WhatsApp so you can send us your message directly.")
    setForm(INITIAL_FORM)
  }

  return (
    <div className="min-h-screen">
      <section className="relative flex h-56 items-center justify-center sm:h-72 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
          alt="Snow-capped mountains"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 space-y-3 text-center text-white px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-[2.5px] text-sky-300">
            ✦ Concierge Desk
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Let Us Craft Your Indian Journey
          </h1>
          <p className="mx-auto max-w-lg text-sm text-white/80 sm:text-base leading-relaxed">
            Have questions regarding royal havelis, permits, or private fleet transfers? Our regional specialists are here to assist.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14 max-w-5xl mx-auto">
          <Card className="rounded-3xl border border-border/80 shadow-md p-2 sm:p-4">
            <CardContent className="pt-6">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Send an Inquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Aarav Sharma"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="aarav@example.com"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination / Interest</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Rajasthan Heritage Tour in December"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Message or Dates</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your group size, travel dates, or special requests…"
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full font-bold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                >
                  <Send className="mr-2 h-4 w-4 text-sky-400 dark:text-sky-600" />
                  Connect With Us via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-xl font-semibold">Contact Information</h2>
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="mb-3 text-xl font-semibold">Business Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mon – Fri</span>
                  <span className="font-medium">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
