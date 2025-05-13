import { InjectModel } from '@nestjs/mongoose';
import { BotDetectionFilter } from '../bot-detection.interface';
import { UserAgentSafety } from '../schemas/user-agent-safety.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import crawlerList from 'crawler-user-agents';
import userAgentList from 'user-agents';
import { HttpHeaderKey } from '../bot-detection.enum';
import { IncomingHttpHeaders } from 'http';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class HeaderIntegrityFilter implements BotDetectionFilter<IncomingHttpHeaders> {
  private readonly requiredOrderedHeaders: HttpHeaderKey[][] = [
    [HttpHeaderKey.Host, HttpHeaderKey.Authority],
    [HttpHeaderKey.UserAgent],
    [HttpHeaderKey.Accept],
    [HttpHeaderKey.AcceptLanguage],
    [HttpHeaderKey.AcceptEncoding],
  ];

  constructor(
    @InjectModel(UserAgentSafety.name)
    private readonly userAgentSafetyModel: Model<UserAgentSafety>,
    private readonly logger: PinoLogger,
  ) {}

  async getScore(headers: IncomingHttpHeaders): Promise<number> {
    const areHeadersConsistent = this.checkHeadersConsistency(headers);

    if (!areHeadersConsistent) {
      return 1;
    }

    const userAgent = headers[HttpHeaderKey.UserAgent];

    const isUserAgentSafe = await this.getUserAgentSafety(userAgent!);

    if (!isUserAgentSafe) {
      return 1;
    }

    return 0;
  }

  private async getUserAgentSafety(userAgent: string) {
    const cachedSafetyResult = await this.userAgentSafetyModel.findOne({ userAgent }).lean();

    if (cachedSafetyResult) {
      return cachedSafetyResult.safe;
    }

    const isCrawler = crawlerList.some(c => new RegExp(c.pattern, 'i').test(userAgent));
    const isFake = !userAgentList.data.some(e => e.userAgent === userAgent);

    const isUserAgentSafe = !isCrawler && !isFake;

    this.logger.info('User-Agent safety check', {
      userAgent,
      isCrawler,
      isFake,
      isUserAgentSafe,
    });

    await this.userAgentSafetyModel.create({ userAgent, safe: isUserAgentSafe });

    return isUserAgentSafe;
  }

  private checkHeadersConsistency(headers: IncomingHttpHeaders): boolean {
    let lastIndex = -1;

    for (const headerGroup of this.requiredOrderedHeaders) {
      let headerFound = false;
      let headerIndex = -1;

      for (const header of headerGroup) {
        const index = Object.keys(headers).indexOf(header);

        if (index !== -1) {
          headerFound = true;
          headerIndex = index;
          break;
        }
      }

      if (!headerFound) {
        this.logger.info(`All headers from [${headerGroup.join(', ')}] group are missing`);
        return false;
      }

      if (headerIndex < lastIndex) {
        this.logger.info(`"${headerGroup.join(', ')}" doesn't have correct placement`);
        return false;
      }

      lastIndex = headerIndex;
    }

    return true;
  }
}
