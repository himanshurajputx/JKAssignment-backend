import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // console.log("err----------->", err);
    // console.log("user----------->", user);
    // console.log("info----------->", info);
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}
