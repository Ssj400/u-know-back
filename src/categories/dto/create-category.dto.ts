import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category', example: 'nestjs' })
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  name: string;
}
