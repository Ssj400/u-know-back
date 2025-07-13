import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { nickname: data.nickname }],
      },
    });

    if (exists) throw new ConflictException('Email or nickname already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData: Prisma.UserCreateInput = {
      nickname: data.nickname,
      email: data.email,
      password: hashedPassword,
    };
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findProfile(id: number) {
    if (!id) throw new ConflictException('User ID is required');
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  updateProfile(id: number, updateData: Prisma.UserUpdateInput) {
    console.log(updateData);
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nickname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        bio: true,
        avatarUrl: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
