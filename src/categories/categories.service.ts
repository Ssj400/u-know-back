import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (exists) throw new ConflictException('Category already exists');
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
