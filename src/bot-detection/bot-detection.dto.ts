import { ApiProperty } from '@nestjs/swagger';
import { Verdict } from './bot-detection.enum';

export class VerdictResponseDto {
  @ApiProperty({
    description: 'The verdict of the bot detection',
    example: Verdict.Human,
    enum: Verdict,
    enumName: 'Verdict',
  })
  verdict: Verdict;

  @ApiProperty({
    description: 'The score indicates confidence that the request was made by a bot.',
    example: 0.24,
  })
  score: number;
}
