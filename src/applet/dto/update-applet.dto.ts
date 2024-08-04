import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAppletDto } from './create-applet.dto';

export class UpdateAppletDto extends PartialType(CreateAppletDto) {}

export class UpdateAppletPinDTO {
    @ApiProperty({ type: Boolean })
    pin: boolean
}

