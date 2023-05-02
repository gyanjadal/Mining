import { ApiProperty } from '@nestjs/swagger';
//import { IsNotEmpty, IsString } from "class-validator"
import { UUID } from 'node:crypto';
import { TelemetryDto } from './telemetry.dto';

export class TelemetryEventsDto {
    @ApiProperty()
    minerId: UUID;
  
    @ApiProperty()
    telemetryDtos: TelemetryDto[];
  }