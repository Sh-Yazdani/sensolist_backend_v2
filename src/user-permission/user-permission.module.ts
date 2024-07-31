import { Module } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, userPermissionSchema } from './entities/user-permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserPermission.name, schema: userPermissionSchema }])
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
})
export class UserPermissionModule { }
