import { ApiProperty } from '@nestjs/swagger';
import { Verdict } from './bot-detection.enum';

export class VerdictResponseDto {
  @ApiProperty({
    description: 'The verdict of the bot detection (either "bot" or "not_bot")',
    example: 'bot',
  })
  verdict: Verdict;

  @ApiProperty({
    description:
      'The score indicating whether the request was identified as a bot (0: not bot, 1: bot)',
    example: 1,
  })
  score: number;
}
