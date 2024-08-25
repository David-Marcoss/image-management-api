import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/userRegister.dto';

@Controller('api/vi/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() userData: UserRegisterDto) {
    return this.userService.register.execute(userData);
  }
}
