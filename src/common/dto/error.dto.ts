import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'An unexpected error occurred while processing the request.',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp of when the error occurred',
    example: '2025-05-14T15:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path where the error occurred',
    example: '/bot-detection/verdict',
  })
  path: string;

  constructor(message: string, path: string, statusCode: number = 500) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
