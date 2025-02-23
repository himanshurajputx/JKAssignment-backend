import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUserAlreadyExist } from '../shared/validators/is-user-already-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, IsUserAlreadyExist],
  exports: [UserService],

})
export class UsersModule {}
