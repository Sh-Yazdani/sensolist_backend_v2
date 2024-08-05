import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class WidgetConfigDTO {
    @ApiProperty({ type: String })
    thingId: Types.ObjectId

    @ApiProperty({ type: String })
    widgetId: Types.ObjectId

    @ApiProperty({ type: String })
    resourceCharachter: string

    @ApiProperty({ type: Object, description:"a JS object of all widget configs, like fields values and etc. then for showing the widget this object is return so any data you need for showing the widget store in this." })
    config: Object
}


