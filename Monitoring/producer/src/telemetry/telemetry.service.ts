import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UUID } from 'crypto';
import { TelemetryDTO } from './dto/telemetry.dto';
import { TelemetryHelpers } from './telemetry.helpers';


@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private config: ConfigService, private helpers: TelemetryHelpers) {
  }

  getTelemetry(uuid: UUID): TelemetryDTO {

    const telemetryDTO = new TelemetryDTO();
    telemetryDTO.id = uuid;

    //Add Error Handling here
    if (uuid.length != 36) 
        return telemetryDTO;

    const healthFailureThreshold = Number(this.config.get('HealthFailureThreshold'));
    const poolFailureThreshold = Number(this.config.get('PoolFailureThreshold'));
    const abnormalTempThreshold = Number(this.config.get('AbnormalTempThreshold'));
    const maxNormalTemp = Number(this.config.get('MaxNormalTemp'));
    const abnormalHashRateThreshold = Number(this.config.get('AbnormalHashRateThreshold'));
    const minNormalHashRate = Number(this.config.get('MinNormalHashRate'));
    const abnormalFanSpeedThreshold = Number(this.config.get('AbnormalFanSpeedThreshold'));
    const minNormalFanSpeed = Number(this.config.get('MinNormalFanSpeed'));

    telemetryDTO.health = this.helpers.getUpDownStatus(healthFailureThreshold);
    telemetryDTO.pool = this.helpers.getUpDownStatus(poolFailureThreshold);
    telemetryDTO.temp1_in = this.helpers.getRandomTempIn();
    telemetryDTO.temp1_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDTO.temp2_in = this.helpers.getRandomTempIn();;
    telemetryDTO.temp2_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDTO.temp3_in = this.helpers.getRandomTempIn();;
    telemetryDTO.temp3_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDTO.temp4_in = this.helpers.getRandomTempIn();;
    telemetryDTO.temp4_out = this.helpers.getRandomTempOut(maxNormalTemp, abnormalTempThreshold);
    telemetryDTO.fans = [
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                            this.helpers.getRandomFanSpeed(minNormalFanSpeed, abnormalFanSpeedThreshold), 
                          ];
    telemetryDTO.hashrate = this.helpers.getRandomHashRate(minNormalHashRate, abnormalHashRateThreshold);

    this.logger.log(JSON.stringify(telemetryDTO));
    return telemetryDTO;
  }
}
