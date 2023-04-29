import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { ProcessedTelemetryDto } from './dto/processedTelemetry.dto';
import { MAXNORMALTEMPIN, MAXNORMALTEMPOUT, MINNORMALFANSPEED, MINNORMALHASHRATE } from './constants';

export enum UpDown {
    Up = "up", Down = "down"
  }

@Injectable()
export class DetectorHelpers {
    private readonly logger = new Logger(DetectorHelpers.name);
    private maxNormalTempIn = 50;
    private maxNormalTempOut = 90;
    private minNormalHashRate = 100000;
    private minNormalFanSpeed = 4000;

    constructor(private config: ConfigService,) {
    }

    convertTelemetryToKeyValueArray(telemetry: string): ProcessedTelemetryDto[] {
        
        const processedTelemetryDtos: ProcessedTelemetryDto[] = [];
        const minerDataObject = JSON.parse(telemetry);
        this.logger.log("MinerDataObject property count is : " +  Object.keys(minerDataObject).length)
        const minerId = minerDataObject["id"];
        Object.keys(minerDataObject).forEach(prop => {
            if (prop == "id") {
                //do nothing
            }
            else if (prop == "fans") {
                const fanSpeedArray = minerDataObject[prop].toString().split(',');
                fanSpeedArray.forEach(async fanSpeed => {
                    processedTelemetryDtos.push(this.GetProcessedTelemetryDto(minerId, "fan", fanSpeed));
                })
            }
            else {
                processedTelemetryDtos.push(this.GetProcessedTelemetryDto(minerId, prop, minerDataObject[prop]));
            }
            this.logger.log("ProcessedTelemetryDtos property count is : " +  processedTelemetryDtos.length)
        });

        return processedTelemetryDtos;
    }
    
    private GetProcessedTelemetryDto(minerId: string, propertyName: string, propertyValue: string): ProcessedTelemetryDto {
        const processedTelemetryDto = new ProcessedTelemetryDto();
        processedTelemetryDto.minerId = minerId;
        processedTelemetryDto.propertyName = propertyName;
        processedTelemetryDto.propertyValue = propertyValue.toString();
        processedTelemetryDto.isAnomaly = this.IsAnomaly(propertyName, propertyValue);
        return processedTelemetryDto;
    }

    private IsAnomaly(propertyName: string, propertyValue: string): boolean {

        if (propertyName == "health" || propertyName == "pool") {
            return propertyValue == UpDown.Down;
        }

        if (propertyName.startsWith("temp") && propertyName.endsWith("_in")) {
            return Number(propertyValue) > MAXNORMALTEMPIN;
        }

        if (propertyName.startsWith("temp") && propertyName.endsWith("_out")) {
            return Number(propertyValue) > MAXNORMALTEMPOUT;
        }

        if (propertyName == "fan") {
            return Number(propertyValue) < MINNORMALFANSPEED;
        }

        if (propertyName == "hashrate") {
            return Number(propertyValue) < MINNORMALHASHRATE;
        }

        return false;
    }
}
