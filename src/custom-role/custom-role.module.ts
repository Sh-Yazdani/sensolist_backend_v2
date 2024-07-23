import { Module } from '@nestjs/common';
import { CustomRoleService } from './custom-role.service';
import { CustomRoleController } from './custom-role.controller';

@Module({
  controllers: [CustomRoleController],
  providers: [CustomRoleService],
})
export class CustomRoleModule {}
