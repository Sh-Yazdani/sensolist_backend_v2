import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CustomRoleModule } from '../custom-role/custom-role.module';
import { CustomRole, CustomRoleSchema } from '../custom-role/entities/custom-role.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: CustomRole.name, schema: CustomRoleSchema }])
  ],
  exports:[UserService]
})
export class UserModule { }
