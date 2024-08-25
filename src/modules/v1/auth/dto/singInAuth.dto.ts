import { IsString, IsEmail,MinLength } from 'class-validator';

export class SingInDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
