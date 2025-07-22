import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RefreshJwtAuthGuard } from 'src/common/guards/refresh-jwt-auth.guard';
import { AuthRequest } from './intefaces/auth-request.interface';
import { Response } from 'express';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(
    @Body() dto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.register(dto);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      message: 'User registered successfully',
      access_token: access_token,
    };
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(dto);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Login successful',
      access_token: access_token,
    };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh user access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  refreshToken(@Req() request: AuthRequest) {
    const { user } = request;
    if (!user) {
      throw new BadRequestException('User not found in request');
    }
    return this.authService.refreshToken(user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  logout(@CurrentUser() user: User) {
    if (!user) {
      throw new BadRequestException('User not found in request');
    }
    return this.authService.logout(user.id);
  }
}
