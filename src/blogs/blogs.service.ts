import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BlogIdDto, CreateBlogDto } from './dto/blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogs } from './entities/blogs.entity';
import { PaginationQuery } from '../shared/pagination/pagination-query.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogRepository: Repository<Blogs>,
  ) {}
  async create(blog: CreateBlogDto, user: any) {
    try {
      const newObj = {
        ...blog,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        blogAuthor: user?.userId,
        createdAt: new Date(),
        blogSlug: blog.blogTitle.toLowerCase(),
      };
      await this.blogRepository.save(newObj);
      return;
    } catch (e) {
      throw new BadRequestException(`
      Error in creating blogs request : ${e.message}`);
    }
  }

  async getBlogsData(pagination: PaginationQuery): Promise<[Blogs[], number]> {
    try {
      return this.blogRepository.findAndCount({
        order: { createdAt: 'DESC' },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['author'], // Changed from 'user' to 'author'
        select: {
          blogId: true,
          blogTitle: true,
          blogDescription: true,
          createdAt: true,
          updatedAt: true,
          blogSlug: true,
          author: {
            name: true,
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Error in getting blogs data : ${e.message}`,
      );
    }
  }

  async blogList(
    pagination: PaginationQuery,
    owner: any,
  ): Promise<[Blogs[], number]> {
    try {
      return await this.blogRepository.findAndCount({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        where: { blogAuthor: owner.userId },
        order: { createdAt: 'DESC' },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['author'], // Changed from 'user' to 'author'
        select: {
          blogId: true,
          blogTitle: true,
          blogDescription: true,
          createdAt: true,
          updatedAt: true,
          blogSlug: true,
          author: {
            name: true,
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Error in getting blogs list : ${e.message}`,
      );
    }
  }

  async details(blogId: BlogIdDto, user?: User) {
    try {
      const condition = {
        blogAuthor: user?.userId,
        ...blogId,
      };
      const value: Blogs | null = await this.blogRepository.findOne({
        where: condition,
        relations: ['author'],
        select: {
          blogId: true,
          blogTitle: true,
          blogDescription: true,
          createdAt: true,
          updatedAt: true,
          blogSlug: true,
          author: {
            name: true,
          },
        },
      });

      if (!value) {
        throw new BadRequestException('Blog not found');
      }
      return value;
    } catch (e) {
      throw new InternalServerErrorException(
        `Error in getting blogs details : ${e.message}`,
      );
    }
  }

  async deleteBlog(blogId: BlogIdDto, user: User) {
    try {
      // Define the condition to ensure only the blog's author can delete it
      const condition = {
        blogAuthor: user.userId,
        ...blogId,
      };

      // Perform the delete operation
      const deleteResult = await this.blogRepository.delete(condition);

      // Check if any records were affected ( deleted)
      if (deleteResult.affected === 0) {
        throw new BadRequestException('Blog not found or not deleted');
      }

      return 'Blog deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting blog: ${error.message}`);
    }
  }


  async updateBlog(blogId: BlogIdDto, blog: CreateBlogDto, user: User) {
    try {
      // Define the condition to find the blog
      const condition = {
        blogAuthor: user.userId, // Ensuring only the author can update their blog
        ...blogId, // Including the blogId in the search condition
      };

      // Fetch the existing blog based on the condition
      const existingBlog = await this.blogRepository.findOne({ where: condition });

      // If blog is not found, throw an error
      if (!existingBlog) {
        throw new BadRequestException('Blog not found');
      }

      // Prepare the updated blog data
      const updateObj = {
        ...blog,
        updatedAt: new Date(), // Auto-updating the modification timestamp
        blogSlug: `${blog.blogTitle
          .slice(0, 20)
          .replace(/[^a-zA-Z0-9]+/g, '-') // Sanitize title for slug
          .toLowerCase()}-${Date.now()}`, // Append timestamp for uniqueness
      };

      // Perform the update operation
      const updateResult = await this.blogRepository.update(blogId, updateObj);

      // If no records were updated, throw an error
      if (updateResult.affected === 0) {
        throw new BadRequestException('Blog update failed');
      }

      return 'Blog updated successfully';
    } catch (error) {
      throw new InternalServerErrorException(`Error updating blog: ${error.message}`);
    }
  }
}
