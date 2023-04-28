import { Controller, Post, Param, Body} from '@nestjs/common';
import { TelemetryCollectorService } from './telemetrycollector.service';
import { PublishTelemetryDto } from './dto';

@Controller('telemetry/')
export class TelemetryCollectorController {
    constructor(private telemetryCollectorService: TelemetryCollectorService) {}
        
    @Post('publish')
    async PublishTelemetry(@Body() dto: PublishTelemetryDto): Promise<void> {
        await this.telemetryCollectorService.getAndQueueProducerTelemetry(dto.Url);
    }
}
