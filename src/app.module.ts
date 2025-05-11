import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { HealthModule } from './health/health.module';
import { MongoModule } from './databases/mongo/mongo.module';

@Module({
  imports: [ConfigurationModule, HealthModule, MongoModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
