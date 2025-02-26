import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';


@Module({
  imports: [
    ConfigModule, // ConfigModule should be explicitly listed in imports
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }), // Ensure session support if needed
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
          algorithm: 'HS384',
        },
        verifyOptions: {
          algorithms: ['HS384'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
  ],
  exports: [JwtModule],
})

export class AuthenticationModule {}
