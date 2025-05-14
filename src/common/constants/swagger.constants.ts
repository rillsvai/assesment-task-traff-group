import { HttpStatus } from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error.dto';

export const internalServerErrorDocumentation = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error. An unexpected error occurred.',
  type: ErrorResponseDto,
};
