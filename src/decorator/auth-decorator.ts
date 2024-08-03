import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common"
import { IdentityDTO } from "../dto/identity.dto"

export const IS_PUBLIC_KEY = "IS_PUBLIC_KEY"
export const UnAuthorizedRoute = () => SetMetadata(IS_PUBLIC_KEY, true)

export const Identifier = createParamDecorator((field: any, ctx: ExecutionContext): IdentityDTO => {

    const req = ctx.switchToHttp().getRequest()


    return {
        userId: req.identity.userId,
        phonenumber: req.identity.phonenumber,
        systemRole: req.identity.systemRole
    }

})


