import { useEffect, useRef, useState, type FormEvent } from "react"
import { Loader2, MessageCircle, Send, X, Sparkles, Compass } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { sendChatMessage, type ChatMessage } from "src/lib/data/chat"

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hello! I am your Vrajatian AI Helpdesk. Ask me anything about destinations, bookings, pricing, or custom itineraries.",
}

const STARTER_PROMPTS = [
  "Romantic Kerala honeymoon under ₹50k",
  "Heritage havelis in Rajasthan",
  "Easy mountain treks in Himachal",
  "Best time for Andaman islands",
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isSending])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim()
    if (!text || isSending) return

    const userMsg: ChatMessage = { role: "user", content: text }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInput("")
    setIsSending(true)

    try {
      const response = await sendChatMessage(text, nextHistory)
      setMessages((prev) => [...prev, { role: "assistant", content: response.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am having trouble connecting to the reservation network. Please reach out to our team at concierge@vrajatian.com or retry shortly.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    handleSend()
  }

  return (
    <>
      {/* Floating Action Trigger - Solid, No Glass */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-3.5 shadow-xl transition-all duration-300 hover:scale-105 group border border-neutral-800"
        aria-label={open ? "Close helpdesk" : "Open AI helpdesk"}
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5 text-sky-400" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
          </span>
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
          AI Helpdesk
        </span>
      </button>

      {/* Helpdesk Panel - 100% Solid, Zero Glass */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-40 flex h-[32rem] max-h-[75vh] w-[calc(100vw-2rem)] sm:w-96 flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
        >
          {/* Header - Solid Neutral 50 */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-neutral-900">AI Helpdesk</span>
                  <Sparkles className="h-3 w-3 text-sky-500" />
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Travel Helpdesk
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4 text-xs bg-white">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-2xs",
                  m.role === "user"
                    ? "ml-auto bg-neutral-900 text-white rounded-br-none font-medium"
                    : "bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-bl-none"
                )}
              >
                {m.content}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 w-fit">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Searching destination guides...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 border-t border-neutral-200 pt-2 bg-neutral-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                Popular Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] rounded-full bg-white hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200 px-2.5 py-1 text-neutral-600 transition-colors text-left shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Form - Solid White */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-neutral-200 p-3 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Helpdesk anything..."
              maxLength={1000}
              disabled={isSending}
              className="h-10 rounded-full border-neutral-300 bg-neutral-50 text-xs pl-4 focus:border-neutral-900 focus:bg-white text-neutral-900"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget
