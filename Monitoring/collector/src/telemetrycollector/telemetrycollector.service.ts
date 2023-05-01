import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import axios from "axios";
import { TELEMETRY_QUEUE } from './constants';
import { MinerDto } from './dto';


@Injectable()
export class TelemetryCollectorService {
  private readonly logger = new Logger(TelemetryCollectorService.name);

  constructor(@InjectQueue(TELEMETRY_QUEUE) 
    private readonly telemetryQueue: Queue,
    private readonly config: ConfigService
    ) {
  }

  async getAndQueueProducerTelemetry(minerDto: MinerDto): Promise<MinerDto> {
    try {
      this.logger.log("Fetching telemetry for miner", JSON.stringify(minerDto));
      const response = await axios.get(minerDto.minerUrl + minerDto.minerId);
      this.logger.log("Telemetry of miner received successfully", response.data);

      this.logger.log("Queueing telemetry for miner", minerDto.minerId);
      await this.telemetryQueue.add(response.data);
      this.logger.log("Queued telemetry for miner successfully", minerDto.minerId);
      return {
        minerId: response.data.minerId,
        minerUrl: minerDto.minerUrl
      }
    }
    catch(error) {
      this.logger.error(error);
      throw error;
    }
  }

  // Retrieves Miners info with URL and ID
  async getMiners(): Promise<MinerDto[]> {
    try {
      this.logger.log("Fetching Miner Info");
      const minerServiceUrl = this.config.get('MINERSERVICE_URL');
      const response = await axios.get(minerServiceUrl);
      this.logger.log("Fetched Miner data successfully", response.data);
      
      const minersToArray: MinerDto[] = await response.data.map((miner) => {
                                              return {
                                                minerId: miner.minerId,
                                                minerUrl: miner.minerUrl,
                                              }
      });
      
      return minersToArray;
    }
    catch(error) {
      this.logger.error(error);
      throw error;
    }
  }
}
