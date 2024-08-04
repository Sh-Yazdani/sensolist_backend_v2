import { Module } from '@nestjs/common';
import { AppletService } from './applet.service';
import { AppletController } from './applet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Applet, AppletSchema } from './entities/applet.entity';
import { UserPermissionModule } from '../user-permission/user-permission.module';

@Module({
  controllers: [AppletController],
  providers: [AppletService],
  imports: [
    MongooseModule.forFeature([{ name: Applet.name, schema: AppletSchema }]),
    UserPermissionModule
  ]
})
export class AppletModule {}


