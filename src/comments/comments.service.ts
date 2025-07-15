import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private Prisma: PrismaService) {}
  findAll() {
    return this.Prisma.comment.findMany();
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
}
