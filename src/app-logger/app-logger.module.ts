import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        pinoHttp: {
          level: cfg.get<string>('LOG_LEVEL'),
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                level: cfg.get<string>('LOG_LEVEL'),
                options: {
                  colorize: cfg.get('NODE_ENV') !== 'production',
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
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
