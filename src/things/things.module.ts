import { Module } from '@nestjs/common';
import { ThingsService } from './things.service';
import { ThingsController } from './things.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Thing, ThingSchema } from './entities/thing.entity';
import { UserPermissionModule } from 'src/user-permission/user-permission.module';

@Module({
  controllers: [ThingsController],
  providers: [ThingsService],
  imports: [
    MongooseModule.forFeature([{ name: Thing.name, schema: ThingSchema }]),
    UserPermissionModule
  ]
})
export class ThingsModule { }
