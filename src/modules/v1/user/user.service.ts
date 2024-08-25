import { Injectable } from '@nestjs/common';
import { RegisterUserUseCases } from './use-cases/registerUser.usecase';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserByEmailUseCases } from './use-cases/findUserByEmail.usecase';
import { FindlUserByIdUseCases } from './use-cases/findUserById.usecase';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  
  findUserByEmail = new FindUserByEmailUseCases(this.userRepository);
  findUserById = new FindlUserByIdUseCases(this.userRepository);
  register = new RegisterUserUseCases(this.userRepository, this.findUserByEmail);
  
}
