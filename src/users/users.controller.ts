import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/roles-decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from '../posts/posts.service';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Fetches a list of all registered users.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No users found.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/profile/:id')
  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Fetches the profile of a user by their ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @UseGuards(JwtAuthGuard)
  findProfile(@Param('id') id: string) {
    return this.usersService.findProfile(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Fetches the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Get('/profile')
  findUserProfile(@CurrentUser() user: User) {
    return this.usersService.findProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, no update data provided.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  updateProfile(@CurrentUser() user: User, @Body() updateData: UpdateUserDto) {
    if (!updateData) {
      throw new BadRequestException('No update data provided');
    }
    return this.usersService.updateProfile(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  @ApiOperation({
    summary: 'Delete user profile',
    description: 'Deletes the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  @ApiOperation({
    summary: 'Admin-only route',
    description: 'This route is accessible only by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin route accessed successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, access denied for non-admin users.',
  })
  adminOnly() {
    return { message: 'This route is accessible only by admin users.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/posts')
  findUserPosts(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.role !== 'ADMIN' && user.id !== Number(id)) {
      throw new UnauthorizedException(
        'You do not have permission to view these posts',
      );
    }
    return this.postsService.findUserPosts(Number(id));
  }
}
