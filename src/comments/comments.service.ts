import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private Prisma: PrismaService) {}
  findAll() {
    return this.Prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(dto: CreateCommentDto, postId: number, user: User) {
    if (!dto || !postId || !user)
      throw new BadRequestException('Parameters missing');

    const newComment = await this.Prisma.comment.create({
      data: {
        content: dto.content,
        authorId: user.id,
        postId: postId,
      },
    });
    return newComment;
  }

  async findAllFromPost(postId: number) {
    if (!postId) throw new BadRequestException('post id missing');
    const postExist = await this.Prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExist) throw new NotFoundException('post not found');

    return this.Prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async remove(user: User, commentId: number) {
    const comment = await this.Prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== user.id && user.role !== 'ADMIN')
      throw new UnauthorizedException('Unauthorized');

    return await this.Prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
