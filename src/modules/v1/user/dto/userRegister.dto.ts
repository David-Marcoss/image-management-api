import { IsString, IsOptional, IsEmail, IsUUID, minLength, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsUUID()
  @IsOptional()
  id: string

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
