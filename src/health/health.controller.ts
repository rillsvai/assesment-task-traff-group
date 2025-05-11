import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: MongooseHealthIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('mongo'),
    ]);
  }
}
