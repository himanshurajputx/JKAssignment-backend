import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../shared/validators/is-user-already-exist.validator';

export class SignUp {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabetic characters and spaces'
  })
  @MaxLength(50)
  @MinLength(2)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @MinLength(4)
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and either 1 number or special character',
  })
  readonly password: string;
}
