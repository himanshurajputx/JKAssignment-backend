import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

class BlogsNotFoundConstraintErrorToCatch {
  static [Symbol.hasInstance](instance: unknown) {
    return instance instanceof EntityNotFoundError;
  }
}

@Catch(BlogsNotFoundConstraintErrorToCatch)
export class BlogFilter implements ExceptionFilter<EntityNotFoundError> {
  catch(_: EntityNotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Not found any blog with id: ${request.params.id}`,
      error: 'Blog Not Found',
    });
  }
}
