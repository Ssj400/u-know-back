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
    return this.prisma.user.findMany();
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findProfile(id: number) {
    if (!id) throw new ConflictException('User ID is required');
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
