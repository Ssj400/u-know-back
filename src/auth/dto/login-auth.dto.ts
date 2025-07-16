import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'The email of the user', example: 'jonny@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
