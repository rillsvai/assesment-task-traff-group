import { Controller, Post, Req } from '@nestjs/common';
import { BotDetectionService } from './bot-detection.service';
import { FastifyRequest } from 'fastify';
import { VerdictResponseDto } from './bot-detection.interface';
import { HttpHeaderKey } from './bot-detection.enum';

@Controller('bot-detection')
export class BotDetectionController {
  constructor(private readonly botDetectionService: BotDetectionService) {}

  @Post('verdict')
  async getBotDetectionVerdict(@Req() request: FastifyRequest): Promise<VerdictResponseDto> {
    const headers = request.headers;

    const ip = this.getClientIp(request);
    const verdict = await this.botDetectionService.getBotDetectionVerdict(headers, ip);

    return verdict;
  }

  private getClientIp(request: FastifyRequest): string {
    const forwardedFor = request.headers[HttpHeaderKey.XForwardedFor] as string;

    if (forwardedFor) {
      const ipArray = forwardedFor.split(',');
      return ipArray[0].trim();
    }

    const ip = request.socket.remoteAddress;
    return ip ? ip.replace('::ffff:', '') : '';
  }
}
