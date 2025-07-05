import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
