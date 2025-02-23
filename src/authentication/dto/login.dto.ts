import { IsString, IsOptional, IsEmail } from 'class-validator';

// DTOs (Data Transfer Objects)
export class SocialsLoginDto {
  @IsString()
  provider: 'google' | 'facebook';

  @IsString()
  token: string;
}

