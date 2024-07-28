import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('Refresh_Token_Secret'),
                signOptions: { expiresIn: "7d" }
            })
        })
    ],
    providers: [
        {
            provide: "RefreshTokenService",
            useExisting: JwtService
        }
    ],
    exports: ["RefreshTokenService"]
})
export class RefreshTokenModule { }


