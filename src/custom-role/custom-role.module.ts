import { Module } from '@nestjs/common';
import { CustomRoleService } from './custom-role.service';
import { CustomRoleController } from './custom-role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomRole, CustomRoleSchema } from './entities/custom-role.entity';

@Module({
  controllers: [CustomRoleController],
  providers: [CustomRoleService],
  imports: [
    MongooseModule.forFeature([{ name: CustomRole.name, schema: CustomRoleSchema }])
  ],
  exports:[
    CustomRoleService
  ]
})
export class CustomRoleModule { }
