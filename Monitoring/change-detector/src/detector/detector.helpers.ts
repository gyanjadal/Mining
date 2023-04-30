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
        const parsedTelemetryObject = JSON.parse(telemetry);

        const minerId = parsedTelemetryObject.minerId;
        const telemetryDtos = parsedTelemetryObject.telemetryDtos;

        this.logger.log("Processing MinerId", minerId);
        this.logger.log("Miner Telemetry Dtos count is : " +  telemetryDtos.length);

        //Now convert each telemetry dto into keyvalue format
        telemetryDtos.forEach((telemetryDto) => {

            this.logger.log("telemetryDto property count is : " + Object.keys(telemetryDto).length);
    
            Object.keys(telemetryDto).forEach(prop => {
                if (prop == "id") {
                    //do nothing
                }
                else if (prop == "fans") {
                    const fanSpeedMap = this.convertStringToMap(telemetryDto[prop].toString(), "fan");
                    for (const [key, value] of fanSpeedMap.entries()) {
                        processedTelemetryDtos.push(this.GetProcessedTelemetryDto(minerId, key, value));
                    }
                }
                else {
                    processedTelemetryDtos.push(this.GetProcessedTelemetryDto(minerId, prop, telemetryDto[prop]));
                }
                this.logger.log("ProcessedTelemetryDtos property count is : " +  processedTelemetryDtos.length)
            });
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

        if (propertyName.startsWith("fan")) {
            return Number(propertyValue) < MINNORMALFANSPEED;
        }

        if (propertyName == "hashrate") {
            return Number(propertyValue) < MINNORMALHASHRATE;
        }

        return false;
    }

    private convertStringToMap(input: string, keyPrefix: string): Map<string, string> {
        const values = input.split(',');
        return values.reduce((map, value, index) => {
          map.set(keyPrefix + `${index + 1}`, value);
          return map;
        }, new Map<string, string>());
      }
}
