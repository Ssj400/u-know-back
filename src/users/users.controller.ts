import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '@prisma/client';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/profile/:id')
  findProfile(@Param('id') id: string) {
    return this.usersService.findProfile(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() user: User, @Body() updateData: Partial<User>) {
    if (!updateData) {
      throw new BadRequestException('No update data provided');
    }
    return this.usersService.updateProfile(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  remove(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
