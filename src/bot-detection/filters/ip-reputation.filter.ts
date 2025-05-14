import { Injectable } from '@nestjs/common';
import { BotDetectionFilter } from '../bot-detection.interface';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class IpReputationFilter implements BotDetectionFilter<string> {
  constructor(private readonly logger: PinoLogger) {}

  async getScore(ip: string): Promise<number> {
    // do something
    const score = await this.checkIpReputationFromServiceA(ip);

    return score;
  }

  private async checkIpReputationFromServiceA(ip: string): Promise<number> {
    const serviceAScore = await Promise.resolve(0);

    this.logger.info(`Service ip gave score ${serviceAScore.toString()} for ${ip}`);
    return serviceAScore;
  }
}
