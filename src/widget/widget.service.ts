import { Injectable } from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WidgetGroup } from './entities/widget-group.entity';
import { RawWidget } from './entities/raw-widget.entity';
import { Model } from 'mongoose';
import { RawWidgetGroupesDTO } from './dto/widget-list.dto';

@Injectable()
export class WidgetService {

  constructor(
    @InjectModel(WidgetGroup.name) private readonly groupModel: Model<WidgetGroup>,
    @InjectModel(RawWidget.name) private readonly widgetModel: Model<RawWidget>,
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

  findAll() {
    return `This action returns all widget`;
  }

  findOne(id: number) {
    return `This action returns a #${id} widget`;
  }

  update(id: number, updateWidgetDto: UpdateWidgetDto) {
    return `This action updates a #${id} widget`;
  }

  remove(id: number) {
    return `This action removes a #${id} widget`;
  }
}
