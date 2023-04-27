import { Controller, Post} from '@nestjs/common';
import { DetectorService } from './detector.service';

@Controller('detector')
export class DetectorController {
    constructor(private detectorService: DetectorService) {}
        
    @Post()
    async GetProducerTelemetryAndQueue() {
       // const telemetryDTO = await this.detectorService.ProcessQueue();
    }
}
