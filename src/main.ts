import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Environment } from './common/enums/environment.enum';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { HealthModule } from './health/health.module';
import { FastifyHttp2SecureOptions, RawServerDefault } from 'fastify';
import { Http2SecureServer } from 'http2';

async function bootstrap() {
  const key: NonSharedBuffer = readFileSync(join(__dirname, '../config/certs/tls.key'));
  const cert: NonSharedBuffer = readFileSync(join(__dirname, '../config/certs/tls.crt'));

  const serverOptions: FastifyHttp2SecureOptions<Http2SecureServer> = {
    http2: true,
    https: { key, cert, allowHTTP1: true },
  };

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(serverOptions),
  );

  const config = app.get(ConfigService);

  const isProd: boolean = config.get('NODE_ENV') === Environment.Production;

  if (!isProd) {
    const docsConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('Cloak Service API')
      .setDescription('REST API documentation for Cloak Service')
      .addTag('Health', 'Liveness & readiness probes')
      .addTag('Bot Detection')
      .setVersion('1.0.0')
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, docsConfig, {
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
