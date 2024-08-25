import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail,MinLength } from 'class-validator';

export class SingInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User password, minimum of 6 characters',
    example: 'strongPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
