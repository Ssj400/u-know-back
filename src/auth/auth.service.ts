import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private Prisma: PrismaService,
  ) {}

  async register(
    dto: RegisterAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.create(dto);
    const tokens = await this.buildTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(
    dto: LoginAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.buildTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  private async buildTokens(
    userId: number,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: userId, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    if (!refreshToken) {
      console.error('Refresh token is required');
      return;
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.Prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshToken(
    userId: number,
    userRole: string,
  ): Promise<{ access_token: string }> {
    const tokens = await this.buildTokens(userId, userRole);
    await this.updateRefreshToken(userId, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.Prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'User logged out successfully.' };
  }
}
