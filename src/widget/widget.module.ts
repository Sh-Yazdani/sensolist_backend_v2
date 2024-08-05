import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RawWidget, rawWidgetSchema } from './entities/raw-widget.entity';
import { WidgetGroup, widgetGroupSchema } from './entities/widget-group.entity';

@Module({
  controllers: [WidgetController],
  providers: [WidgetService],
  imports: [
    MongooseModule.forFeature([
      { name: RawWidget.name, schema: rawWidgetSchema },
      { name: WidgetGroup.name, schema: widgetGroupSchema },
    ])
  ]
})
export class WidgetModule { }
