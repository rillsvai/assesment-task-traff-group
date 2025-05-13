import { Controller, Post, Req } from '@nestjs/common';
import { BotDetectionService } from './bot-detection.service';
import { FastifyRequest } from 'fastify';
import { HttpHeaderKey } from './bot-detection.enum';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerdictResponseDto } from './bot-detection.dto';

@ApiTags('Bot Detection')
@Controller('bot-detection')
export class BotDetectionController {
  constructor(private readonly botDetectionService: BotDetectionService) {}

  @Post('verdict')
  @ApiOperation({
    summary: 'Get Bot Detection Verdict',
    description: 'Detects if a request is coming from a bot based on multiply filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns bot detection verdict.',
    type: VerdictResponseDto,
  })
  @ApiBody({
    description: 'Request headers with User-Agent and other headers.',
    type: Object,
  })
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
