import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UUID } from 'crypto';
import { TelemetryDto } from './dto/telemetry.dto';
import { TelemetryHelpers } from './telemetry.helpers';


@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private config: ConfigService, private helpers: TelemetryHelpers) {
  }

  // Get Telemetry from Miner
  getTelemetry(uuid: UUID): TelemetryDto {

    //Simulated Data

    const telemetryDto = new TelemetryDto();
    telemetryDto.id = uuid;

    //Add Error Handling here
    if (uuid.length != 36) 
        return telemetryDto;

    const healthFailureThreshold = Number(this.config.get('HealthFailureThreshold'));
    const poolFailureThreshold = Number(this.config.get('PoolFailureThreshold'));
    const abnormalTempThreshold = Number(this.config.get('AbnormalTempThreshold'));
    const maxNormalTemp = Number(this.config.get('MaxNormalTemp'));
    const abnormalHashRateThreshold = Number(this.config.get('AbnormalHashRateThreshold'));
    const minNormalHashRate = Number(this.config.get('MinNormalHashRate'));
    const abnormalFanSpeedThreshold = Number(this.config.get('AbnormalFanSpeedThreshold'));
    const minNormalFanSpeed = Number(this.config.get('MinNormalFanSpeed'));

    telemetryDto.health = this.helpers.getUpDownStatus(healthFailureThreshold);
    telemetryDto.pool = this.helpers.getUpDownStatus(poolFailureThreshold);
    telemetryDto.temp1_in = this.helpers.getRandomTempIn();
    telemetryDto.temp1_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDto.temp2_in = this.helpers.getRandomTempIn();;
    telemetryDto.temp2_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDto.temp3_in = this.helpers.getRandomTempIn();;
    telemetryDto.temp3_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDto.temp4_in = this.helpers.getRandomTempIn();;
    telemetryDto.temp4_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDto.fans = [
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                          ];
    telemetryDto.hashrate = this.helpers.getRandomHashRate(minNormalHashRate, abnormalHashRateThreshold);

    this.logger.log(JSON.stringify(telemetryDto));
    return telemetryDto;
  }
}
