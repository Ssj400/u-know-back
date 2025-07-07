import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    return await this.prisma.post.findMany({
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
}
