import { Controller, Post, Param, Body} from '@nestjs/common';
import { TelemetryCollectorService } from './telemetrycollector.service';
import { MinerDto } from './dto';

@Controller('telemetry/')
export class TelemetryCollectorController {
    constructor(private telemetryCollectorService: TelemetryCollectorService) {}
        
    // Pulls telemetry from producer using URL and ID and queues it. Use for test
    @Post('pull')
    async getAndQueueProducerTelemetry(@Body() dto: MinerDto): Promise<MinerDto> {
        return await this.telemetryCollectorService.getAndQueueProducerTelemetry(dto);
    }
}
