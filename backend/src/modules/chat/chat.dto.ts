import { z } from 'zod';

/**
 * Stateless chat — the backend holds no conversation history. The frontend
 * resends its local transcript as `history` each turn; caps below bound the
 * prompt size (and therefore Groq cost/latency) per request.
 */
const chatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(2000),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required.').max(1000, 'Message is too long (max 1000 characters).'),
  history: z.array(chatHistoryMessageSchema).max(12).default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  reply: string;
}
