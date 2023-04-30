import { BadRequestException, Controller, Get, Param,} from '@nestjs/common';
import { UUID } from 'crypto';
import { TelemetryService } from './telemetry.service';
import { TelemetryEventsDto } from './dto/telemetryevents.dto';

@Controller('telemetry')
export class TelemetryController {
    constructor(private telemetryService: TelemetryService) {}

    @Get(':uuid')
    async getTelemetry(@Param('uuid') uuid: UUID ): Promise<TelemetryEventsDto> {

        if (uuid.length < 36)
            throw new BadRequestException('Invalid input data');

        return await this.telemetryService.getTelemetry(uuid);
    }
}
