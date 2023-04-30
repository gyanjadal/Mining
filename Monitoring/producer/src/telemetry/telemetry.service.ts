import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UUID } from 'crypto';
import { TelemetryDto } from './dto/telemetry.dto';
import { TelemetryHelpers } from './telemetry.helpers';
import { FAILURETHRESHOLD, MAXNORMALTEMPIN, MAXNORMALTEMPOUT, MINNORMALFANSPEED, MINNORMALHASHRATE, TELEMETRYPOINTS } from './constants';
import { TelemetryEventsDto } from './dto/telemetryevents.dto';


@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private config: ConfigService, private helpers: TelemetryHelpers) {
  }

  async getTelemetry(uuid: UUID): Promise<TelemetryEventsDto> {

    //Simulated TELEMETRYPOINTS records per call
    const telemetryEventsDto: TelemetryEventsDto = new TelemetryEventsDto();
    const telemetryDtos: TelemetryDto[] = [];

    for (let index = 0; index < TELEMETRYPOINTS; index++) {
      telemetryDtos.push(await this.generateTelemetryDto(uuid));
    }
    this.logger.log("Generated " + telemetryDtos.length + " telemetry records for :", uuid);

    telemetryEventsDto.minerId = uuid;
    telemetryEventsDto.telemetryDtos = telemetryDtos;

    return telemetryEventsDto;
  }

  private async generateTelemetryDto(uuid: UUID): Promise<TelemetryDto> {

    const telemetryDto = new TelemetryDto();
    telemetryDto.id = uuid;

    telemetryDto.health = this.helpers.getUpDownStatus(FAILURETHRESHOLD);
    telemetryDto.pool = this.helpers.getUpDownStatus(FAILURETHRESHOLD);
    telemetryDto.temp1_in = this.helpers.getRandomTempIn(MAXNORMALTEMPIN, FAILURETHRESHOLD);
    telemetryDto.temp1_out = this.helpers.getRandomTempOut(MAXNORMALTEMPOUT, FAILURETHRESHOLD);
    telemetryDto.temp2_in = this.helpers.getRandomTempIn(MAXNORMALTEMPIN, FAILURETHRESHOLD);
    telemetryDto.temp2_out = this.helpers.getRandomTempOut(MAXNORMALTEMPOUT, FAILURETHRESHOLD);
    telemetryDto.temp3_in = this.helpers.getRandomTempIn(MAXNORMALTEMPIN, FAILURETHRESHOLD);
    telemetryDto.temp3_out = this.helpers.getRandomTempOut(MAXNORMALTEMPOUT, FAILURETHRESHOLD);
    telemetryDto.temp4_in = this.helpers.getRandomTempIn(MAXNORMALTEMPIN, FAILURETHRESHOLD);
    telemetryDto.temp4_out = this.helpers.getRandomTempOut(MAXNORMALTEMPOUT, FAILURETHRESHOLD);
    telemetryDto.fans = [
                            this.helpers.getRandomFanSpeed(MINNORMALFANSPEED, FAILURETHRESHOLD), 
                            this.helpers.getRandomFanSpeed(MINNORMALFANSPEED, FAILURETHRESHOLD), 
                            this.helpers.getRandomFanSpeed(MINNORMALFANSPEED, FAILURETHRESHOLD), 
                            this.helpers.getRandomFanSpeed(MINNORMALFANSPEED, FAILURETHRESHOLD), 
                          ];
    telemetryDto.hashrate = this.helpers.getRandomHashRate(MINNORMALHASHRATE, FAILURETHRESHOLD);
    telemetryDto.clientTime = new Date();

    return telemetryDto;
  }
}
