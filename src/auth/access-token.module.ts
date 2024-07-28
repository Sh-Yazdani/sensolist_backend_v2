import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('Access_Token_Secret'),
                signOptions: { expiresIn: "900" }
            })
        })
    ],
    providers:[
        {
            provide:"AccessTokenService",
            useExisting:JwtService
        }
    ],
    exports:["AccessTokenService"]
})
export class AccessTokenModule { }


