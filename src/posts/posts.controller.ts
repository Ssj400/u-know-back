import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
