import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { TELEMETRY_QUEUE } from './constants';
import { CreateRawTelemetryDTO } from './dto/rawTelemetry.dto'
import { CreateAnomaliesDTO } from './dto/anomalies.dto'
import { DetectorHelpers } from './detector.helpers';

@Processor(TELEMETRY_QUEUE)
@Injectable()
export class DetectorService {
  constructor(private prisma: PrismaService, 
              private detectorHelpers: DetectorHelpers) {}

  private readonly logger = new Logger(DetectorService.name);

  @Process()
  async ProcessQueue(job: Job<unknown>): Promise<void> {
    
    const telemetry = JSON.stringify(job.data);
    this.logger.log(telemetry);

    //Save Queue Telemetry to PostGresSQL
    const rawTelemetryDTO = new CreateRawTelemetryDTO();
    rawTelemetryDTO.minerId = JSON.parse(telemetry)['id'];
    //Rethink : Do we want to store individual fields as columns
    rawTelemetryDTO.minerData = telemetry;

    try {
      await this.SaveRawTelemetryToDB(rawTelemetryDTO);

      //Detect Anomalies
      const anomaliesDTOs = await this.detectorHelpers.DetectAnomalies(rawTelemetryDTO);

      //Detect Anomalies and Save to DB
      this.logger.log("Anomalies found: " + anomaliesDTOs.length);
      await this.SaveAnomaliesToDB(anomaliesDTOs);
    }
    catch(error) {
      this.logger.error(error);
    }
  }

  async SaveRawTelemetryToDB(
    rawTelemetryDTO: CreateRawTelemetryDTO,
  ): Promise<void> {
      this.logger.log("Saving Raw Telemetry : ", JSON.stringify(rawTelemetryDTO));

      await this.prisma.minerTelemetry.create({
        data: {
          minerId: rawTelemetryDTO.minerId,
          minerData: rawTelemetryDTO.minerData,
        }
      });
    }
  
  async SaveAnomaliesToDB(
    anomaliesDTOs: CreateAnomaliesDTO[],
  ): Promise<void> {
    this.logger.log("Saving Anomalies : ", JSON.stringify(anomaliesDTOs));

    //TODO : Convert above to a single call
    // await this.prisma.anomalies.createMany ({
    //       data: anomaliesCreateManyInput
    //     });
    // }

    anomaliesDTOs.forEach(
      async anomaliesDTO => {
        await this.prisma.anomalies.create({
          data: {
            minerId: anomaliesDTO.minerId,
            propertyName: anomaliesDTO.propertyName.toString(),
            propertyValue: anomaliesDTO.propertyValue.toString(),
          }
        });
      }
    );
    }
  }