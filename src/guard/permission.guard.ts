import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { PERMISSION_SUBJECT_KEY, REQUIRED_PERMISSION_KEY } from "../decorator/permission.decorator";
import { SystemRoles } from "../enums/role.enum";
import { PermissionAccess } from "../user-permission/dto/permission-model.dto";
import { UserPermissionService } from "../user-permission/user-permission.service";

@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly permissionService: UserPermissionService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest()
        const systemRole = req["systemRole"]
        const phonenumner = req["phonunumber"]

        if (systemRole == SystemRoles.Admin)
            return true

        const permission = this.reflector.getAllAndOverride<PermissionAccess>(REQUIRED_PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        const entity = this.reflector.getAllAndOverride<Type>(PERMISSION_SUBJECT_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        // if (!permission || !entity)
        //     return true

        let haveAccess = false

        if (permission == PermissionAccess.Add) {
            haveAccess = await this.permissionService.userHaveCreatePermission(phonenumner, entity)
        }
        else {
            const targetEntityId = req.params["id"]
            haveAccess = await this.permissionService.userHavPermissions(phonenumner, entity, targetEntityId, permission)
        }

        if (!haveAccess)
            throw new ForbiddenException("permission not granted")

        return true

    }

}

