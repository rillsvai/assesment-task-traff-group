import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import { ignorePaths, staticFileRegex } from './app-logger.constants';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        pinoHttp: {
          level: cfg.get<string>('LOG_LEVEL'),
          autoLogging: {
            ignore: (req: IncomingMessage) => {
              const url = req.url ?? '';
              return staticFileRegex.test(url) || ignorePaths.some(p => url.startsWith(p));
            },
          },
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                level: cfg.get<string>('LOG_LEVEL'),
                options: {
                  colorize: cfg.get('NODE_ENV') !== 'production',
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                  hideObject: false,
                },
              },
              {
                target: 'pino-mongodb',
                level: 'info',
                options: {
                  uri: cfg.get<string>('MONGO_URI'),
                  collection: 'appLogs',
                  capped: true,
                  size: 100 * 1024 * 1024,
                  removeKeys: 'req,res,err.stack',
                  expireAfterSeconds: 60 * 60 * 24 * 30, // 1 month
                },
              },
            ],
          },
          serializers: {
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res,
            err: pino.stdSerializers.err,
          },
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
