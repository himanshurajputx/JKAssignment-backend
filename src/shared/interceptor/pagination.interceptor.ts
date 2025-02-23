import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';
import { Observable, map } from 'rxjs';
import { Pagination } from '../pagination/pagination.dto';
import { PaginationQuery } from '../pagination/pagination-query.dto';
import { PaginationMeta } from '../pagination/pagination-meta.dto';
import { PaginationLink } from '../pagination/pagination-link.dto';

@Injectable()
export class PaginationInterceptor<Item>
  implements NestInterceptor<[Array<Item>, number], Pagination<Item>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<[Array<Item>, number]>,
  ): Observable<Pagination<Item>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { limit: itemsPerPage, page: currentPage } = plainToInstance(
      PaginationQuery,
      request.query,
    );

    return next.handle().pipe(
      map(([items, totalItems]) => {
        const itemCount = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const meta = plainToInstance(PaginationMeta, {
          itemCount,
          totalItems,
          itemsPerPage,
          totalPages,
          currentPage,
        });

        return plainToInstance(Pagination<Item>, {
          items,
          meta,
          links: this.#createLinks(request, meta),
        });
      }),
    );
  }

  #createLinks(request: Request, meta: PaginationMeta): PaginationLink {
    const { limit: defaultLimit } = new PaginationQuery();
    const url = new URL('http://localhost');
    url.protocol = request.protocol;
    url.host = request.get('host')!;
    url.pathname = request.path;

    if (meta.itemsPerPage !== defaultLimit) {
      url.searchParams.set('limit', String(meta.itemsPerPage));
    }

    return plainToInstance(PaginationLink, {
      first: url.toString(),
      previous:
        meta.currentPage > 1
          ? (url.searchParams.set('page', String(meta.currentPage - 1)),
            url.toString())
          : undefined,
      next:
        meta.currentPage < meta.totalPages
          ? (url.searchParams.set('page', String(meta.currentPage + 1)),
            url.toString())
          : undefined,
      last:
        meta.totalPages > 1
          ? (url.searchParams.set('page', String(meta.totalPages)),
            url.toString())
          : undefined,
    });
  }
}
