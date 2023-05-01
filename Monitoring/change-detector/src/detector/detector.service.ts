import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { TELEMETRY_QUEUE } from './constants';
import { DetectorHelpers } from './detector.helpers';
import { ProcessedTelemetryDto } from './dto/processedTelemetry.dto';

@Processor(TELEMETRY_QUEUE)
@Injectable()
export class DetectorService {
  constructor(@InjectQueue(TELEMETRY_QUEUE) 
              private readonly telemetryQueue: Queue,
              private prisma: PrismaService, 
              private detectorHelpers: DetectorHelpers) {}

  private readonly logger = new Logger(DetectorService.name);

  @Process()
  async processQueue(job: Job<unknown>): Promise<void> {
    
    const telemetry = JSON.stringify(job.data);

    // Step 1: Save Raw Telemetry to PostGresSQL
    try {

      this.logger.log("Saving Raw Telemetry...");
      
      await this.saveRawTelemetryToDB(telemetry);
      this.logger.log("Successfully saved Raw Telemetry.");
    
      // Step 2: Process Telemetry
      // Convert Raw into key value pairs and add IsAnomaly flag
      this.logger.log("Processing Raw Telemetry...");
      await this.processTelemetry(telemetry)
      this.logger.log("Successfully saved Processed Telemetry");

      const queueCountAfter = await this.telemetryQueue.getWaitingCount();
      this.logger.log("Items waiting in queue: ", queueCountAfter);

    }
    catch(error) {
      this.logger.error(error);
    }
  }

  private async saveRawTelemetryToDB(telemetry: string): Promise<void> {
    
    const parsedTelemetry = JSON.parse(telemetry);
   
    await this.prisma.minerRawTelemetry.create({
        data: {
          minerId: parsedTelemetry.minerId,
          minerData: JSON.stringify(parsedTelemetry.telemetryDtos)
        }
    })
  }
  
  private async processTelemetry(telemetry: string): Promise<void> {

    const processedTelemetryDtos: ProcessedTelemetryDto[] = 
        this.detectorHelpers.convertTelemetryToKeyValueArray(telemetry);

    this.logger.log("Processed property count: " + processedTelemetryDtos.length);

    processedTelemetryDtos.forEach(async dto => {
    
      await this.prisma.minerProcessedTelemetry.create({
          data: {
            minerId: dto.minerId,
            propertyName: dto.propertyName,
            propertyValue: dto.propertyValue,
            isAnomaly: dto.isAnomaly
          }
        })
    });
  }
}