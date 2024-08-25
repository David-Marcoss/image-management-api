import { ConflictException, Injectable } from "@nestjs/common";
import { UserRegisterDto } from "../dto/userRegister.dto";
import { hash } from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { FindUserByEmailUseCases } from "./findUserByEmail.usecase";

@Injectable()
export class RegisterUserUseCases {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly findUserByEmailUseCase: FindUserByEmailUseCases,
	) {}

	async execute(userData: UserRegisterDto): Promise<Omit<UserRegisterDto,"password">> {
		const { email, name, password } = userData;

		const user = await this.findUserByEmailUseCase.execute(email);
		if (user) {
			throw new ConflictException(`User with email ${email} already exists`);
		}

		let newUser = this.userRepository.create({
			email,
			name,
			password: await hash(password, 10),
		});

		newUser = await this.userRepository.save(newUser);

		return {id : newUser.id, email: newUser.email, name: newUser.name};
	}
}
