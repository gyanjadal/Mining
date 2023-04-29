import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { TELEMETRY_QUEUE } from './constants';
import { DetectorHelpers } from './detector.helpers';
import { RawTelemetryDto } from './dto/rawTelemetry.dto';
import { ProcessedTelemetryDto } from './dto/processedTelemetry.dto';

@Processor(TELEMETRY_QUEUE)
@Injectable()
export class DetectorService {
  constructor(private prisma: PrismaService, 
              private detectorHelpers: DetectorHelpers) {}

  private readonly logger = new Logger(DetectorService.name);

  @Process()
  async processQueue(job: Job<unknown>): Promise<void> {
    
    const telemetry = JSON.stringify(job.data);
    this.logger.log(telemetry);

    // Step 1: Save Raw Telemetry to PostGresSQL
    try {
      this.logger.log("Saving Raw Telemetry : ", telemetry);
      await this.saveRawTelemetryToDB(telemetry);
      this.logger.log("Successfully saved Raw Telemetry");
    }
    catch(error) {
      this.logger.error(error);
    }

    // Step 2: Process Telemetry
    // Convert Raw into key value pairs and add IsAnomaly flag
    try {
      this.logger.log("Processing Raw Telemetry : ", telemetry);
      await this.processTelemetry(telemetry);
      this.logger.log("Successfully saved Processed Telemetry");
    }
    catch(error) {
      this.logger.error(error);
    }
  }

  private async saveRawTelemetryToDB(telemetry: string): Promise<void> {
    
      await this.prisma.minerRawTelemetry.create({
        data: {
          minerId: JSON.parse(telemetry)['id'],
          minerData: telemetry
        }
      });
    }
  
  private async processTelemetry(telemetry: string): Promise<void> {

    const processedTelemetryDtos: ProcessedTelemetryDto[] = 
        this.detectorHelpers.convertTelemetryToKeyValueArray(telemetry);

    this.logger.log("Processed property count: " + processedTelemetryDtos.length);

    processedTelemetryDtos.forEach(async dto => {
    
      this.logger.log("Creating processed telemetry property : " + dto.propertyName);

      await this.prisma.minerProcessedTelemetry.create({
          data: {
            minerId: dto.minerId,
            propertyName: dto.propertyName,
            propertyValue: dto.propertyValue,
            isAnomaly: dto.isAnomaly
          }
        });
    });
  }
}