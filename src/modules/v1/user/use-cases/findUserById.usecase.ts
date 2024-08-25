import { Injectable } from "@nestjs/common";
import { UserRegisterDto } from "../dto/userRegister.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FindlUserByIdUseCases {

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async execute(id: string): Promise<UserRegisterDto | null> {
		
        const user = await this.userRepository.findOne({where: { id }})

        return !user ? null : user
	}
}
