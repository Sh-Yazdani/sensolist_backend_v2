import { Module } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, userPermissionSchema } from './entities/user-permission.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: UserPermission.name, schema: userPermissionSchema }])
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService]
})
export class UserPermissionModule { }
