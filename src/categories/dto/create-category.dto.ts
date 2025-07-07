import { IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  name: string;
}
