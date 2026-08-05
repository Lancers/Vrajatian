import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { CacheModule } from './common/cache/cache.module';
import { AdminGuard } from './common/auth/admin.guard';
import { AuthGuard } from './common/auth/auth.guard';
import { AdminSessionController } from './common/auth/admin-session.controller';
import { HealthController } from './health/health.controller';
import { PackagesModule } from './modules/packages/packages.module';
import { BookingRequestsModule } from './modules/booking-requests/booking-requests.module';
import { ChatModule } from './modules/chat/chat.module';
import { ProfilesModule } from './modules/profiles/profiles.module';

@Module({
  imports: [
    ConfigModule,
    SupabaseModule,
    CacheModule,
    PackagesModule,
    BookingRequestsModule,
    ChatModule,
    ProfilesModule,
  ],
  controllers: [HealthController, AdminSessionController],
  providers: [AdminGuard, AuthGuard],
})
export class AppModule {}
