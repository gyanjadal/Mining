import { Controller, Get, Param} from '@nestjs/common';
import { TelemetryCollectorService } from './telemetrycollector.service';

@Controller('telemetry/')
export class TelemetryCollectorController {
    constructor(private telemetryCollectorService: TelemetryCollectorService) {}
        
    @Get(':minerUrl')
    async getTelemetry(@Param('minerUrl') minerUrl: string ) {
        await this.telemetryCollectorService.getAndQueueProducerTelemetry(minerUrl);
    }
}
