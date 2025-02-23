import { ValidationPipe, HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';

export function setup(app: INestApplication): INestApplication {
  /**
   * Global prefix for all routes.
   */
  app.useLogger(new Logger());

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(
    new ResponseInterceptor(), // Format successful responses
  );

  /**
   * Set up validation pipe.
   */

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  /**
   * Set up cookie parser
   */
  app.use(cookieParser(process.env.APP_SECRET));

  /**
   * Configure session management
   */
  const sessionStore =
    process.env.NODE_ENV === 'production'
      ? new (connectPgSimple(session))()
      : new session.MemoryStore();

  app.use(
    session({
      secret: process.env.APP_SECRET || 'development-secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  /**
   * Configure session management
   */
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Configure CORS - only once, with all needed settings
   */
  const origins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(/\s*,\s*/)
    : ['http://localhost:4200'];

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  /**
   * Set up dependency injection for custom validators
   */
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
