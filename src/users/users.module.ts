import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from '../posts/posts.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, PostsService],
})
export class UsersModule {}
