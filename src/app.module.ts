import { Module } from '@nestjs/common';

import { AuthenticationModule } from './authentication/authentication.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './shared/database/database.postgress';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/.env',
    }),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    AuthenticationModule,
    BlogsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
