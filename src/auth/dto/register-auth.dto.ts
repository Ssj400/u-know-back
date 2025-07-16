import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ description: 'The nickname of the user', example: 'jonny' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'The email of the user', example: 'jonny@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}
