import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppConfig, CONFIG } from '../../common/config/config';

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 15_000;
const UNAVAILABLE_MESSAGE = 'Chat assistant is temporarily unavailable.';

/**
 * Thin wrapper around Groq's OpenAI-compatible chat endpoint. Uses the
 * platform's built-in fetch — no HTTP client dependency needed. Any failure
 * (network, timeout, bad response shape) collapses to a generic 503; Groq's
 * raw error body is never forwarded to the client.
 */
@Injectable()
export class GroqClient {
  constructor(@Inject(CONFIG) private readonly config: AppConfig) {}

  async complete(messages: GroqChatMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.GROQ_MODEL,
          messages,
          temperature: 0.4,
          max_tokens: 400,
        }),
        signal: controller.signal,
      });
    } catch {
      throw new HttpException(UNAVAILABLE_MESSAGE, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      throw new HttpException(UNAVAILABLE_MESSAGE, HttpStatus.SERVICE_UNAVAILABLE);
    }

    const body = await res.json().catch(() => null);
    const reply = body?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) {
      throw new HttpException(UNAVAILABLE_MESSAGE, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return reply.trim();
  }
}
