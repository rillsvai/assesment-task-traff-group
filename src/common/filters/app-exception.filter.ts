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
    const validationErrors = this.getValidationErrors(exception);

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      validationErrors,
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

  private getValidationErrors(exception: Error): string[] | undefined {
    if (exception instanceof HttpException && exception.getStatus() === 400) {
      const response = exception.getResponse();

      if (typeof response === 'object') {
        const res = response as { message?: unknown };
        if (Array.isArray(res.message)) {
          return res.message.filter((message): message is string => typeof message === 'string');
        }
      }
    }
    return undefined;
  }
}
