import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MutationPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(5)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsOptional()
  published: any;

  @IsOptional()
  oldImgUrl: string;
}
