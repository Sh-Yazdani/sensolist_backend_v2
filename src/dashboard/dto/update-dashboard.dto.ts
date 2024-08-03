import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDashboardDto } from './create-dashboard.dto';

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) { }

export class UpdateDashboardPinDTO {
    @ApiProperty({ type: Boolean })
    pin: boolean
}
