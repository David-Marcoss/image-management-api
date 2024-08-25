import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRegisterDto } from "../../user/dto/userRegister.dto";
import { SingInDto } from "../dto/singInAuth.dto";
import {
	hashSync as bcryptHashSync,
	compareSync as bcryptCompareSync,
} from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class SingInAuthUseCase {
	constructor(
		private readonly jwtSevise: JwtService,
		private readonly userSerivce: UserService,
	
	) {}

	async execulte(authData: SingInDto): Promise<object> {
		const getUser = await this.userSerivce.findUserByEmail.execute(authData.email)

		if (!getUser || !bcryptCompareSync(authData.password, getUser.password)) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const token = this.jwtSevise.sign({sub: getUser.id})

		return { authorizationBearerToken: token, userId: getUser.id };
	}
}
