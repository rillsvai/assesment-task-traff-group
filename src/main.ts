import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Environment } from './common/enums/environment.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HealthModule } from './health/health.module';

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

  const isProd = config.get('NODE_ENV') === Environment.Production;

  if (!isProd) {
    const docsConfig = new DocumentBuilder()
      .setTitle('Cloak Service API')
      .setDescription('REST API documentation for Cloak Service')
      .addTag('Health', 'Liveness & readiness probes')
      .addTag('Bot Detection')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, docsConfig, {
      include: [HealthModule],
    });

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { docExpansion: 'none' },
    });
  }

  const port = config.get<number>('PORT')!;

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Application failed to start', error);
  process.exit(1);
});
