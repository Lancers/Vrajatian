import { Body, Controller, ForbiddenException, HttpCode, Inject, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppConfig, CONFIG } from '../../common/config/config';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { ChatService } from './chat.service';
import { ChatResponse, chatRequestSchema } from './chat.dto';

/**
 * PUBLIC — no auth. Any site visitor can chat with the assistant.
 *   POST /api/v1/chat
 *
 * CORS already stops browsers on other origins from reading the response;
 * this Origin check adds a cheap extra layer against casual scripted abuse,
 * but — like CORS itself — it's not a substitute for auth: a determined
 * caller can set any Origin header it likes from outside a browser. The real
 * cost/abuse backstops are the per-IP rate limit and daily budget cap in
 * ChatService, plus the input/output guard in chat-guard.ts.
 */
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chat: ChatService,
    @Inject(CONFIG) private readonly config: AppConfig,
  ) {}

  @Post()
  @HttpCode(200)
  reply(@Body() body: Record<string, unknown>, @Req() req: Request): Promise<ChatResponse> {
    const origin = req.headers.origin;
    if (origin && !this.config.corsOrigins.includes(origin)) {
      throw new ForbiddenException('Origin not allowed.');
    }
    return this.chat.reply(parseWithSchema(chatRequestSchema, body), req.ip ?? 'unknown');
  }
}
