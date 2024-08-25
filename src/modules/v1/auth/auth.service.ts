import { Injectable } from "@nestjs/common";
import { SingInAuthUseCase } from "./use-cases/SingInAuth.usecase";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
	singIn = new SingInAuthUseCase(this.jwtSevise,this.userSerivce);
	constructor(
		private readonly jwtSevise: JwtService,
		private readonly userSerivce: UserService,

	) {}
}
