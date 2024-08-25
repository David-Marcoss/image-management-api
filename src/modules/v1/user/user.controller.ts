import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/userRegister.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  register(@Body() userData: UserRegisterDto) {
    return this.userService.register.execute(userData);
  }
}
