import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TELEMETRY_QUEUE } from './constants';
import { DetectorController } from './detector.controller';
import { DetectorService } from './detector.service';
import { DetectorHelpers } from './detector.helpers';

@Module({
    imports: [
      BullModule.forRoot({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
      BullModule.registerQueue({
        name: TELEMETRY_QUEUE
    })],
    controllers: [DetectorController],
    providers: [DetectorService, DetectorHelpers]
})
export class DetectorModule {}