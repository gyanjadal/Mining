import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TELEMETRY_QUEUE } from './constants';
import { TelemetryCollectorService } from './telemetrycollector.service';
import { TelemetryCollectorController } from './telemetrycollector.controller';
import { CollectorSchedulerService } from './scheduler/collectorscheduler.service';

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
    controllers: [TelemetryCollectorController],
    providers: [TelemetryCollectorService, CollectorSchedulerService]
})
export class TelemetryCollectorModule {}