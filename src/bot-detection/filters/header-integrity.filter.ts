import { InjectModel } from '@nestjs/mongoose';
import { BotDetectionFilter } from '../bot-detection.interface';
import { UserAgentSafety } from '../schemas/user-agent-safety.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import crawlerList from 'crawler-user-agents';
import userAgentList from 'user-agents';
import { HttpHeaderKey } from '../bot-detection.enum';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class HeaderIntegrityFilter implements BotDetectionFilter<IncomingHttpHeaders> {
  private readonly requiredOrderedHeaders: HttpHeaderKey[] = [
    HttpHeaderKey.Host,
    HttpHeaderKey.UserAgent,
    HttpHeaderKey.Accept,
    HttpHeaderKey.AcceptLanguage,
    HttpHeaderKey.AcceptEncoding,
  ];

  constructor(
    @InjectModel(UserAgentSafety.name) private userAgentSafetyModel: Model<UserAgentSafety>,
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

    await this.userAgentSafetyModel.create({ userAgent, safe: isUserAgentSafe });

    return isUserAgentSafe;
  }

  private checkHeadersConsistency(headers: IncomingHttpHeaders): boolean {
    let lastIndex = -1;

    for (const header of this.requiredOrderedHeaders) {
      if (!(header in headers)) {
        return false;
      }

      const index = Object.keys(headers)
        .map(k => k)
        .indexOf(header);

      if (index === -1 || index < lastIndex) {
        return false;
      }

      lastIndex = index;
    }

    return true;
  }
}
