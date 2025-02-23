import {
  ValidationPipe,
  HttpStatus,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';

export function setup(app: INestApplication): INestApplication {
  const logger = new Logger('Application Setup');
  const configService = app.get(ConfigService);

  try {
    // Enable logging
    app.useLogger(logger);

    // Set global prefix and enable versioning
    app.setGlobalPrefix('api');

    // Security middleware
    app.use(helmet());
    app.use(compression());

    // Global interceptors
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Validation pipe configuration
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Cookie parser setup
    const appSecret = configService.get<string>('APP_SECRET');
    if (!appSecret) {
      throw new Error('APP_SECRET is not defined in environment variables');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    app.use(cookieParser(appSecret));

    // Session configuration
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    const sessionStore = isProduction
      ? new (connectPgSimple(session))({
        // PostgreSQL connection config
        conObject: {
          connectionString: configService.get<string>('DATABASE_URL'),
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        },
        tableName: 'session', // Table to store sessions
        createTableIfMissing: true,
      })
      : new session.MemoryStore();

    app.use(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      session({
        secret: appSecret,
        resave: false,
        saveUninitialized: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        store: sessionStore,
        name: 'sessionId', // Custom cookie name
        cookie: {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: isProduction,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          path: '/',
        },
        rolling: true, // Refresh session with each request
      }),
    );

    // Authentication setup
    app.use(passport.initialize());
    app.use(passport.session());

    // CORS configuration
    const allowedOrigins = configService
      .get<string>('ALLOWED_ORIGINS')
      ?.split(/\s*,\s*/)
      .filter(Boolean) || ['http://localhost:4200'];
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          callback(null, true);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      exposedHeaders: ['Authorization'],
      maxAge: 86400, // 24 hours in seconds
    });

    // Set up dependency injection for custom validators
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    logger.log('Application setup completed successfully');
    return app;
  } catch (error) {
    logger.error(`Error during application setup: ${error.message}`, error.stack);
    throw error;
  }
}
