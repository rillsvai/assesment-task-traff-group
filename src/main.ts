// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from './common/enums/environment.enum';
import { LogLevel } from './common/enums/log-level.enum';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Application } from 'express';
import * as spdy from 'spdy';
import { RequestListener } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const isDev = config.get<Environment>('NODE_ENV') === Environment.Development;
  const allLevels = Object.values(LogLevel) as LogLevel[];
  const prodLevels = [LogLevel.Log, LogLevel.Warn, LogLevel.Error, LogLevel.Fatal];
  app.useLogger(isDev ? allLevels : prodLevels);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as Application;

  const keyPath = join(__dirname, '..', 'config', 'certs', 'tls.key');
  const certPath = join(__dirname, '..', 'config', 'certs', 'tls.crt');
  const key = readFileSync(keyPath);
  const cert = readFileSync(certPath);

  const port = config.get<number>('PORT')!;

  const handler = expressApp as RequestListener;
  const spdyServer = spdy.createServer(
    {
      key,
      cert,
      spdy: { protocols: ['h2', 'http/1.1'] },
    },
    handler,
  );

  spdyServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on :${port.toString()}`);
  });
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Application failed to start', error);
  process.exit(1);
});
