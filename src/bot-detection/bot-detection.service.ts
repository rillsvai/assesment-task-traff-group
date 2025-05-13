import { Inject, Injectable } from '@nestjs/common';
import { Verdict } from './bot-detection.enum';
import { HeaderIntegrityFilter } from './filters/header-integrity.filter';
import { IpReputationFilter } from './filters/ip-reputation.filter';
import { VerdictResponseDto } from './bot-detection.interface';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class BotDetectionService {
  private readonly thresholdScore: number = 0.7;
  constructor(
    @Inject() private readonly headerIntegrityFilter: HeaderIntegrityFilter,
    @Inject() private readonly ipReputationFilter: IpReputationFilter,
  ) {}

  async getBotDetectionVerdict(
    headers: IncomingHttpHeaders,
    clientIp: string,
  ): Promise<VerdictResponseDto> {
    let totalScore = 0;
    const maxVerdict = { score: 1, verdict: Verdict.Bot };

    totalScore += await this.headerIntegrityFilter.getScore(headers);

    if (totalScore >= 1) {
      return maxVerdict;
    }

    totalScore += await this.ipReputationFilter.getScore(clientIp);

    const normalizedScore = Math.min(1, totalScore);

    if (normalizedScore >= this.thresholdScore) {
      return { score: normalizedScore, verdict: Verdict.Bot };
    }

    return { score: normalizedScore, verdict: Verdict.Human };
  }
}
