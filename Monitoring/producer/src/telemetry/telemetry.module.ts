import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { TelemetryHelpers } from './telemetry.helpers';

@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetryHelpers]
})
export class TelemetryModule {}