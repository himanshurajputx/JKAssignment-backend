import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    // @ts-ignore
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      profileFields: ['id', 'name', 'displayName', 'photos', 'emails'],
      scope: ['email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): any {
    const { id, name, emails, photos } = profile;
    const user = {
      facebookId: id,
      firstName: name?.givenName,
      lastName: name?.familyName,
      email: emails?.[0]?.value || null,
      picture: photos?.[0]?.value || null,
      accessToken,
    };
    done(null, user);
  }
}
