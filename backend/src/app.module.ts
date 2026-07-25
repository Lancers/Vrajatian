import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AdminGuard } from './common/auth/admin.guard';
import { AdminSessionController } from './common/auth/admin-session.controller';
import { HealthController } from './health/health.controller';
import { PackagesModule } from './modules/packages/packages.module';

@Module({
  imports: [ConfigModule, SupabaseModule, PackagesModule],
  controllers: [HealthController, AdminSessionController],
  providers: [AdminGuard],
})
export class AppModule {}
