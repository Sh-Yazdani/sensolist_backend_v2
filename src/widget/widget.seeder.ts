import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { WidgetGroup } from "./entities/widget-group.entity";
import { Model } from "mongoose";
import { RawWidget, WidgetFieldsUnits } from "./entities/raw-widget.entity";

@Injectable()
export class WidgetSeeder implements Seeder {

    groupes = [
        "Indoor",
        "Outdoor",
        "Charts"
    ]

    widgets = [
        {
            name: "time series chart",
            widgetGroup: this.groupes[2],
            fields: [
                {
                    name: "label",
                    groupLabel: "X Axes",
                    description: "",
                    type: String.name
                },
                {
                    name: "label",
                    groupLabel: "Y Axes",
                    description: "",
                    type: String.name
                },
                {
                    name: "min",
                    groupLabel: "Y Axes",
                    description: "",
                    type: Number.name
                },
                {
                    name: "max",
                    groupLabel: "Y Axes",
                    description: "",
                    type: Number.name
                },
                {
                    name: "unit",
                    groupLabel: "Y Axes",
                    description: "",
                    enum: WidgetFieldsUnits
                },
                {
                    name: "description",
                    description: "",
                    type: String.name
                },
            ]
        }
    ]

    constructor(
        @InjectModel(WidgetGroup.name) private readonly groupModel: Model<WidgetGroup>,
        @InjectModel(RawWidget.name) private readonly widgetModel: Model<RawWidget>,
    ) { }

    async seed(): Promise<any> {

        let _groupes = DataFactory.createForClass(WidgetGroup).generate(3)
        _groupes = _groupes.map((g, index) => {
            return {
                ...g,
                name: this.groupes[index]
            }
        })
        _groupes = await this.groupModel.insertMany(_groupes)

        let _widgets = DataFactory.createForClass(RawWidget).generate(2)
        _widgets = _widgets.map((w, index) => {
            return {
                ...w,
                name: this.widgets[0].name,
                fields: this.widgets[0].fields,
                widgetGroup: _groupes[2]._id
            }
        })
        return this.widgetModel.insertMany(_widgets)

    }
    async drop(): Promise<any> {
        await this.widgetModel.deleteMany()
        return this.groupModel.deleteMany()
    }

}

