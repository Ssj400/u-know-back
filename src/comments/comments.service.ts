import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private Prisma: PrismaService) {}
  findAll() {
    return this.Prisma.comment.findMany();
  }
}
