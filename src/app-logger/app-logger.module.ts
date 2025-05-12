import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { appLoggerFactory } from './app-logger.provider';
import { getConnectionToken } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService, getConnectionToken()],
      useFactory: appLoggerFactory,
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
