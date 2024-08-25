import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly jwtSecretKey: string

  constructor(
    private readonly jwtSevise: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtSecretKey = configService.get<string>("JWT_SECRET")
  }

  async canActivate(
    context: ExecutionContext,
  
  ): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest()

    const token = this.exctractTokenHeader(request)

    if(!token) throw new UnauthorizedException();

    try {
      const user = await this.jwtSevise.verifyAsync(token,{secret:this.jwtSecretKey})

      request["user"] = user

    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private exctractTokenHeader(request:Request){
    if(!request.headers.authorization) throw new UnauthorizedException();

    const [type,token] = request.headers.authorization.split(" ") ?? []

    if(type === "Bearer") return token

    throw new UnauthorizedException();
  }
}
