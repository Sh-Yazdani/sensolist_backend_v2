import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WidgetGroup } from './entities/widget-group.entity';
import { RawWidget } from './entities/raw-widget.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { RawWidgetGroupesDTO } from './dto/widget-list.dto';
import { WidgetConfigDTO } from './dto/widget-config.dto';
import { WidgetConfig } from './entities/widget-config.entity';

@Injectable()
export class WidgetService {

  constructor(
    @InjectModel(WidgetGroup.name) private readonly groupModel: Model<WidgetGroup>,
    @InjectModel(RawWidget.name) private readonly widgetModel: Model<RawWidget>,
    @InjectModel(WidgetConfig.name) private readonly configModel: Model<WidgetConfig>,
  ) { }


  async widgteListWithGroupes(): Promise<RawWidgetGroupesDTO[]> {
    const groupes = await this.groupModel.find().exec()
    const result: RawWidgetGroupesDTO[] = []

    for (let group of groupes) {
      const widgets = await this.widgetModel.find({ widgetGroup: group._id }).exec()
      result.push({
        name: group.name,
        description: group.description,
        imageId: group.imageId,
        widgets: widgets.map(w => {
          return {
            name: w.name,
            description: w.description,
            imageId: w.imageId,
            fields: w.fields,
          }
        })
      })
    }

    return result
  }

  async storeWidgetConfig(data: WidgetConfigDTO): Promise<Types.ObjectId | undefined> {
    const config = new this.configModel({ ...data })

    try {
      await config.save()
      return config._id
    }
    catch {
      return undefined
    }
  }

}
