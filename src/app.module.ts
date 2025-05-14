import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MongoModule } from './databases/mongo/mongo.module';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { BotDetectionModule } from './bot-detection/bot-detection.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigurationModule,
    HealthModule,
    MongoModule.forRoot(),
    AppLoggerModule,
    BotDetectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
