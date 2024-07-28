import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OTP, otpSchema } from './entities/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiTokenModule } from './api-token.module';
import { AccessTokenModule } from './access-token.module';
import { RefreshTokenModule } from './refresh-token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    ApiTokenModule,
    AccessTokenModule,
    RefreshTokenModule,
    MongooseModule.forFeature([{ name: OTP.name, schema: otpSchema }])
  ]
})
export class AuthModule { }
