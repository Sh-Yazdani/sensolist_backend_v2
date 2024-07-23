import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecretKey } from './secrets';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserService,
    JwtModule.register({
      global:true,
      secret:JWTSecretKey,
  })
  ]
})
export class AuthModule {}
