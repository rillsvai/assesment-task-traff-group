import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { HealthModule } from './health/health.module';
import { MongoModule } from './databases/mongo/mongo.module';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { AppLogsSeeder } from './databases/mongo/seeders/app-logs.seeder';

@Module({
  imports: [ConfigurationModule, HealthModule, MongoModule.forRoot(), AppLoggerModule],
  controllers: [],
  providers: [AppLogsSeeder],
})
export class AppModule {}
