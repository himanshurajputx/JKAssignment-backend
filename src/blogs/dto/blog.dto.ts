import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(10)
  blogTitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  @MinLength(200)
  blogDescription: string;

}

export class BlogIdDto {
  @IsString()
  blogId: string
}


