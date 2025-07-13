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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/roles-decorator';
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
  @Get('/profile')
  findUserProfile(@CurrentUser() user: User) {
    return this.usersService.findProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() user: User, @Body() updateData: UpdateUserDto) {
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  adminOnly() {
    return { message: 'This route is accessible only by admin users.' };
  }
}
