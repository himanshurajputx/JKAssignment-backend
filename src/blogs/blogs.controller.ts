import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBlogDto, BlogIdDto } from './dto/blog.dto';
import { SessionAuthGuard } from '../shared/guards/session-auth.guard';
import { JWTAuthGuard } from '../shared/guards/jwt-auth-guard';
import { AuthUser } from '../shared/decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import { BlogsService } from './blogs.service';
import { PaginationInterceptor } from '../shared/interceptor/pagination.interceptor';
import { PaginationQuery } from '../shared/pagination/pagination-query.dto';
import { Blogs } from './entities/blogs.entity';

@Controller('blogs')
@UseInterceptors(ClassSerializerInterceptor)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Post()
  async createBlog(@Body() blog: CreateBlogDto, @AuthUser() user: User) {
    return await this.blogsService.create(blog, user);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async getBlogs(
    @Query() pagination: PaginationQuery,
  ): Promise<[Blogs[], number]> {
    return await this.blogsService.getBlogsData(pagination);
  }

  @Get('/get-details/:blogId')
  async getBlogDetails(@Param() blogId: BlogIdDto): Promise<Blogs> {
    return await this.blogsService.details(blogId);
  }

  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Get('/blog-list')
  @UseInterceptors(PaginationInterceptor)
  async blogList(
    @Query() pagination: PaginationQuery,
    @AuthUser() user: User,
  ): Promise<[Blogs[], number]> {
    return await this.blogsService.blogList(pagination, user);
  }

  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Get('/details/:blogId')
  async details(
    @Param() blogId: BlogIdDto,
    @AuthUser() user: User,
  ): Promise<Blogs> {
    return await this.blogsService.details(blogId, user);
  }

  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Delete('/:blogId')
  async deleteBlog(
    @Param() blogId: BlogIdDto,
    @AuthUser() user: User,
  ): Promise<any> {
    return await this.blogsService.deleteBlog(blogId, user);
  }
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Put('/:blogId')
  async updateBlog(
    @Param() blogId: BlogIdDto,
    @Body() blog: CreateBlogDto,
    @AuthUser() user: User,
  ): Promise<any> {
    return await this.blogsService.updateBlog(blogId, blog, user);
  }
}
