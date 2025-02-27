import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Req,
} from '@nestjs/common';
import { TokenInterceptor } from '../shared/interceptor/token.interceptors';
import { SessionAuthGuard } from '../shared/guards/session-auth.guard';
import { JWTAuthGuard } from '../shared/guards/jwt-auth-guard';
import { User } from '../users/entities/user.entity';
import { LocalAuthGuard } from '../shared/guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import { AuthUser } from '../shared/decorator/user.decorator';
import { SignUp } from './dto/sign-up.dto';
import { GoogleOAuthGuard } from '../shared/guards/google-oauth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUp): Promise<User> {
    return this.authService.register(signUp);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  login(@AuthUser() user: User) {
    return user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<void> {
    // Redirects to Facebook authentication page
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@Req() req: Request): any {
    // Facebook returns user info here
    // @ts-ignore

    return req?.user;
  }

  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }
}
