// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from './common/enums/environment.enum';
import { LogLevel } from './common/enums/log-level.enum';
import * as spdy from 'spdy';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const isDev = config.get<Environment>('NODE_ENV') === Environment.Development;
  const allLevels = Object.values(LogLevel) as LogLevel[];
  const prodLevels = [LogLevel.Log, LogLevel.Warn, LogLevel.Error, LogLevel.Fatal];
  app.useLogger(isDev ? allLevels : prodLevels);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  const keyPath = join(__dirname, '..', 'config', 'certs', 'tls.key');
  const certPath = join(__dirname, '..', 'config', 'certs', 'tls.crt');
  const key = readFileSync(keyPath);
  const cert = readFileSync(certPath);

  const port = config.get<number>('PORT')!;

  spdy
    .createServer({ key, cert, spdy: { protocols: ['h2', 'http/1.1'] } }, expressApp)
    .listen(port, () => {
      console.log(`Server is listening on :${port}`);
    });
}

bootstrap().catch((err: unknown) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
