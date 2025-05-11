import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const key = readFileSync(join(__dirname, '../config/certs/tls.key'));
  const cert = readFileSync(join(__dirname, '../config/certs/tls.crt'));

  const serverOptions = {
    http2: true,
    https: { key, cert },
    allowHTTP1: true,
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(serverOptions),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT')!;

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Application failed to start', error);
  process.exit(1);
});
