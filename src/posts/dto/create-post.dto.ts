import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post', example: 'My first post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content of the post', example: 'This is the content of my first post.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The ID of the category this post belongs to', example: 1 })
  @IsInt()
  categoryId: number;
}
