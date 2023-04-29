import { Controller, Get, Param,} from '@nestjs/common';
import { UUID } from 'crypto';
import { TelemetryService } from './telemetry.service';
import { TelemetryDto } from './dto/telemetry.dto';

@Controller('telemetry')
export class TelemetryController {
    constructor(private telemetryService: TelemetryService) {}

    @Get(':uuid')
    getTelemetry(@Param('uuid') uuid: UUID ): TelemetryDto {
        return this.telemetryService.getTelemetry(uuid);
    }
        
}
