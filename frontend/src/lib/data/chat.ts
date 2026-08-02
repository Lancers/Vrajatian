import { api } from "src/lib/api"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatReply {
  reply: string
}

/** Send a chat turn — public, no auth. The backend is stateless; we resend recent history each call. */
export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<ChatReply> {
  return api.post<ChatReply>("/chat", { message, history: history.slice(-12) })
}
