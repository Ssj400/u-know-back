import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
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
