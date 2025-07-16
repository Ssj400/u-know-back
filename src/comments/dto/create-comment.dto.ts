import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment', example: 'This is a great post!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
