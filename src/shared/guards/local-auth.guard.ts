import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // only debug used
    // console.log('Request URL:', request.url);
    // console.log('Request method:', request.method);
    // console.log('Request headers:', request.headers);
    // console.log('Request body before auth:', request.body);
    // console.log('Query parameters:', request.query);

    try {
      // Force the strategy to run
      const result = (await super.canActivate(context)) as boolean;
      console.log('Authentication result:', result);

      if (result && context.getType() === 'http') {
        await super.logIn(request);
      }

      return result;
    } catch (error) {
      console.error('Authentication error type:', error.constructor.name);
      console.error('Authentication error:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }
}
