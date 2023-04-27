import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelemetryCollectorModule } from './telemetrycollector/telemetrycollector.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    ScheduleModule.forRoot(),
    TelemetryCollectorModule,
  ]
})
export class AppModule {}
