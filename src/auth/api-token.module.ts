import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('API_Token_Secret'),
                signOptions: { expiresIn: "120" }
            })
        })
    ],
    providers: [
        {
            provide: "ApiTokenService",
            useExisting: JwtService
        }
    ],
    exports:["ApiTokenService"]
})
export class ApiTokenModule { }

