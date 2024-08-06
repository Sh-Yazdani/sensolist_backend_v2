import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './entities/dashboard.entity';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { ThingsModule } from 'src/things/things.module';
import { WidgetModule } from 'src/widget/widget.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
    UserPermissionModule,
    WidgetModule,
    ThingsModule
  ]
})
export class DashboardModule { }
