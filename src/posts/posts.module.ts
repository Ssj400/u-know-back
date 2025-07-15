import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [CommentsModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
