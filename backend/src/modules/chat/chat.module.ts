import { Module } from '@nestjs/common';
import { PackagesModule } from '../packages/packages.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GroqClient } from './groq.client';

// Deliberately NOT using @nestjs/throttler's ThrottlerModule.forRoot() here:
// BookingRequestsModule already calls it, and its options provider is
// application-global — a second forRoot() call collided with the first
// (chat silently ran under booking-requests' 5-per-10-minutes limit instead
// of its own), confirmed by testing. Per-IP limiting is done in ChatService
// via the existing CacheService instead — same mechanism as the daily
// budget cap, with no shared global state to collide with.
@Module({
  imports: [PackagesModule],
  controllers: [ChatController],
  providers: [ChatService, GroqClient],
})
export class ChatModule {}
