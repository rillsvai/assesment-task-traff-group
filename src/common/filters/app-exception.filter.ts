import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorResponse } from '../interfaces/error.interface';
import { ErrorMessage } from '../enums/error-message.enum';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../enums/environment.enum';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception);

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    reply.status(statusCode).send(errorResponse);
  }

  private getErrorMessage(exception: Error): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as { message?: string }).message || exception.message;
    }

    return this.configService.get<Environment>('NODE_ENV') === Environment.Production
      ? ErrorMessage.InternalServerError
      : exception.message;
  }
}
