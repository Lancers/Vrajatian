import { useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { sendChatMessage, type ChatMessage } from "src/lib/data/chat"

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi! Ask me about our trip packages or destinations, and I'll help you find the right one.",
}

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    // The greeting is shown locally but was never part of an actual API exchange — exclude it.
    const history = messages.filter((m) => m !== GREETING)
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setIsSending(true)

    try {
      const { reply } = await sendChatMessage(text, history)
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't reach the chat assistant.")
      setMessages((prev) => prev.slice(0, -1))
      setInput(text)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <Button
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-lg"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        <MessageCircle className="!size-6" />
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-4 z-40 flex h-[28rem] max-h-[70vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border bg-background shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 sm:w-80"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-semibold text-foreground">Vrajatian Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a destination..."
              maxLength={1000}
              disabled={isSending}
              autoFocus
            />
            <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget
