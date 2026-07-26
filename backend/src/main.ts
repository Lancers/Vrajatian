import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig, CONFIG } from './common/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfig>(CONFIG);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  await app.listen(config.PORT);
  new Logger('Bootstrap').log(
    `Vrajatian backend listening on http://localhost:${config.PORT}/api/v1`,
  );
}

bootstrap();
