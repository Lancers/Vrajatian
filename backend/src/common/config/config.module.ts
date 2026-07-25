import { Global, Module } from '@nestjs/common';
import { CONFIG, loadConfig } from './config';

/**
 * Global config provider — inject the parsed config anywhere with
 * `@Inject(CONFIG) private readonly config: AppConfig`.
 */
@Global()
@Module({
  providers: [{ provide: CONFIG, useFactory: loadConfig }],
  exports: [CONFIG],
})
export class ConfigModule {}
