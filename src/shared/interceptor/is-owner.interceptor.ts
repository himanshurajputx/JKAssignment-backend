import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { Blogs } from '../../blogs/entities/blogs.entity';
import { Pagination } from '../pagination/pagination.dto';

@Injectable()
export class IsOwnerInterceptor<T extends Blogs | Pagination<Blogs>>
  implements NestInterceptor<T, T>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request: any = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const user: any = request.user;
    return next.handle().pipe(
      tap((r) => {
        if (!user || r instanceof Pagination) return;

        const userId =
          typeof r.blogAuthor === 'object' ? r.blogAuthor : r.blogAuthor;
        const isOwner = userId === user.userId;

        if (!isOwner) {
          throw new ForbiddenException(`Todo does not belong to you`);
        }
      }),
    );
  }
}
