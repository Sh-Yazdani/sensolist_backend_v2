import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDashboardDto } from './create-dashboard.dto';
import { Types } from 'mongoose';

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) { }

export class UpdateDashboardPinDTO {
    @ApiProperty({ type: Boolean })
    pin: boolean
}

export class UpdateDashboardWidgetsDTO {

    @ApiProperty({type:[String]})
    widgetConfigsId:Types.ObjectId[]

}
