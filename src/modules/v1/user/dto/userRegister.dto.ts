import { IsString, IsOptional, IsEmail, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRegisterDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ description: 'User password', example: 'secret123' })
  @IsString()
  @MinLength(6)
  password: string;
}
