import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigurationModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
