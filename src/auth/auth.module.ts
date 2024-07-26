import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecretKey } from './secrets';
import { OTP, otpSchema } from './entities/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWTSecretKey,
    }),
    MongooseModule.forFeature([{ name: OTP.name, schema: otpSchema }])
  ]
})
export class AuthModule { }
