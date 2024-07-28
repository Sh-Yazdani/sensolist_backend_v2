import { SetMetadata } from "@nestjs/common"

export const IS_PUBLIC_KEY = "IS_PUBLIC_KEY"
export const UnAuthorizedRoute = () => SetMetadata(IS_PUBLIC_KEY, true)


