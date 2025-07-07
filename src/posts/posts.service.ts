import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: createPostDto.categoryId,
      },
    });
    if (!categoryExists) throw new NotFoundException('Category not found');

    const newPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: userId,
        categoryId: createPostDto.categoryId,
      },
    });
    return newPost;
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User) {
    if (updatePostDto.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          id: updatePostDto.categoryId,
        },
      });
      if (!categoryExists) throw new NotFoundException('Category not found');
    }

    const postExists = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!postExists) throw new NotFoundException('Post not found');

    const permission = postExists.authorId === user.id || user.role === 'ADMIN';

    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to update this post',
      );

    return this.prisma.post.update({
      where: { id },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        categoryId: updatePostDto.categoryId,
      },
    });
  }

  async remove(id: number, user: User) {
    const postExists = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!postExists) throw new NotFoundException('Post not found');

    const permission = postExists.authorId === user.id || user.role === 'ADMIN';

    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to delete this post',
      );

    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
