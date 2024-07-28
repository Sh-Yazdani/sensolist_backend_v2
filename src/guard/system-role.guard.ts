import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_SYSTEM_ROLE_KEY } from "../decorator/role.decorator";
import { Request } from "express";
import { Observable } from "rxjs";
import { SystemRoles } from '../enums/role.enum';

@Injectable()
export class SystemRoleGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        return true

        const requiredRoles = this.reflector.getAllAndOverride<SystemRoles[]>(CHECK_SYSTEM_ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredRoles)
            return true

        const req: Request = context.switchToHttp().getRequest()
        const role = req['userRole']

        const haveRole = requiredRoles.find(r => r == role)

        if (haveRole == undefined)
            throw new ForbiddenException(`this route is restricted to ${JSON.stringify(requiredRoles)}`)

        return true

    }
}


