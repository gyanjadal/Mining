import { Injectable, Logger } from '@nestjs/common';
import { CreateRawTelemetryDTO } from "./dto/rawTelemetry.dto";
import { CreateAnomaliesDTO } from "./dto/anomalies.dto";
import { ConfigService } from "@nestjs/config";

export enum UpDown {
    Up = "up", Down = "down"
  }

@Injectable()
export class DetectorHelpers {
    private readonly logger = new Logger(DetectorHelpers.name);

    constructor(private config: ConfigService,) {}

    async DetectAnomalies(rawTelemetryDTO: CreateRawTelemetryDTO): Promise<CreateAnomaliesDTO[]> {
        
        const anomaliesDTOs: CreateAnomaliesDTO[] = [];
        const minerDataObject = JSON.parse(rawTelemetryDTO.minerData);

        this.logger.log("Raw Telemetry: " + JSON.stringify(rawTelemetryDTO));

        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        const stateArray = ['health', 'pool'];
        stateArray.forEach(propertyType => {
            var anomaly = this.GetUpDownAnomaly(rawTelemetryDTO.minerId, propertyType, minerDataObject);
            if (anomaly != null)
                anomaliesDTOs.push(anomaly);
        });

        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        const tempInArray = ['temp1_in', 'temp2_in', 'temp3_in', 'temp4_in'];
        tempInArray.forEach(propertyType => {
            var anomaly = this.GetTempInAnomaly(rawTelemetryDTO.minerId, propertyType, minerDataObject);
            if (anomaly != null)
                anomaliesDTOs.push(anomaly);
        });

        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        const tempOutArray = ['temp1_out', 'temp2_out', 'temp3_out', 'temp4_out'];
        tempOutArray.forEach(propertyType => {
            var anomaly = this.GetTempOutAnomaly(rawTelemetryDTO.minerId, propertyType, minerDataObject);
            if (anomaly != null)
                anomaliesDTOs.push(anomaly);
        });
    
        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        const hashrateArray = ['hashrate'];
        hashrateArray.forEach(propertyType => {
            var anomaly = this.GetHashrateAnomaly(rawTelemetryDTO.minerId, propertyType, minerDataObject);
            if (anomaly != null)
                anomaliesDTOs.push(anomaly);
        });

        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        const fanArray = ['fans'];
        fanArray.forEach(propertyType => {
            var anomalies = this.GetFanSpeedAnomaly(rawTelemetryDTO.minerId, propertyType, minerDataObject);
            if (anomalies != null)
                anomaliesDTOs.push(...anomalies);
        });

        this.logger.log("Anomalies found: " + anomaliesDTOs.length);
        return anomaliesDTOs;
    }

    private GetUpDownAnomaly(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO {
        if (minerDataObject[propertyName] == UpDown.Down) {
            return this.CreateAnomalyDTO(minerId, propertyName, minerDataObject);
        }
    }

    private GetTempInAnomaly(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO {

        const minNormalTemp = Number(this.config.get('MinNormalTemp'));

        if (Number(minerDataObject[propertyName]) < minNormalTemp) {
            return this.CreateAnomalyDTO(minerId, propertyName, minerDataObject);
        }
    }

    private GetTempOutAnomaly(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO {

        const maxNormalTemp = Number(this.config.get('MaxNormalTemp'));

        if (Number(minerDataObject[propertyName]) > maxNormalTemp) {
            return this.CreateAnomalyDTO(minerId, propertyName, minerDataObject);
        }
    }

    private GetHashrateAnomaly(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO {

        const minNormalHashRate = Number(this.config.get('MinNormalHashRate'));

        if (Number(minerDataObject[propertyName]) < minNormalHashRate) {
            return this.CreateAnomalyDTO(minerId, propertyName, minerDataObject);
        }
    }

    private GetFanSpeedAnomaly(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO[] {

        const minNormalFanSpeed = Number(this.config.get('MinNormalFanSpeed'));
        const fanSpeeds = minerDataObject[propertyName].toString();
        const fanSpeedArray = fanSpeeds.split(',');
        const anomaliesDTOs: CreateAnomaliesDTO[] = [];

        let i = 0;
        fanSpeedArray.forEach(fanSpeed => {
            if (Number(fanSpeed) < minNormalFanSpeed) {
                anomaliesDTOs.push(this.CreateAnomalyDTO(minerId, propertyName, minerDataObject));
            }
        });

        return anomaliesDTOs;
    }

    private CreateAnomalyDTO(minerId: string, propertyName: string, minerDataObject: object): CreateAnomaliesDTO {
        const anomaly = new CreateAnomaliesDTO();
        anomaly.minerId = minerId;
        anomaly.propertyName = propertyName;
        anomaly.propertyValue = minerDataObject[propertyName];
        return anomaly;
    }
}
