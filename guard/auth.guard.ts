import { Injectable, CanActivate, ExecutionContext, Inject, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "decorator/auth-decorator";
import { Request } from "express";
import { Observable, throwError } from "rxjs";

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        @Inject("AccessTokenService") private readonly accessTokenService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const unAuthRoute: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (unAuthRoute)
            return true

        const req = context.switchToHttp().getRequest()
        const token = this.fetchToken(req)

        if (!token)
            throw new UnauthorizedException("we need a bearer token")

        let payload
        try {
            payload = await this.accessTokenService.verifyAsync(token)
        }
        catch (e) {
            throw new UnauthorizedException("token is not valid or expired")
        }

        req['phonunumber'] = payload.sub

        return true

    }

    fetchToken(req: Request): string | null {
        const [type, token] = req.headers.authorization?.split(" ") ?? []
        return type == "Bearer" ? token : null
    }
}


