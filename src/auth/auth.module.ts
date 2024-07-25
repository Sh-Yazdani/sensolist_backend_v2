import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecretKey } from './secrets';
import { OTP, otpSchema } from './entities/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserService,
    JwtModule.register({
      global: true,
      secret: JWTSecretKey,
    }),
    MongooseModule.forFeature([{ name: OTP.name, schema: otpSchema }])
  ]
})
export class AuthModule { }
