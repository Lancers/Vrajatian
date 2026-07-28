import 'reflect-metadata';
import 'dotenv/config';
import type { Request, Response } from 'express';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppConfig, CONFIG } from './common/config/config';

/**
 * Serverless entry point for Vercel. Unlike main.ts, this never calls
 * app.listen() — Vercel invokes the exported handler directly per request.
 * The Nest app is built once per warm function instance and reused across
 * invocations (initPromise), not rebuilt per-request.
 */
const server = express();
let initPromise: Promise<void> | null = null;

async function init(): Promise<void> {
  // Vercel sits in front as a proxy — without this, req.ip resolves to the
  // proxy's address for every request, breaking IP-based rate limiting
  // (ThrottlerGuard) by collapsing all callers into one bucket.
  server.set('trust proxy', 1);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const config = app.get<AppConfig>(CONFIG);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  await app.init();
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!initPromise) initPromise = init();
  await initPromise;
  server(req, res);
}
