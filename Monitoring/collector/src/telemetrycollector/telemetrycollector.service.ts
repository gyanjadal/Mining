import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import axios from "axios";
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { TELEMETRY_QUEUE } from './constants';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';


@Injectable()
export class TelemetryCollectorService {
  private readonly logger = new Logger(TelemetryCollectorService.name);

  constructor(@InjectQueue(TELEMETRY_QUEUE) 
    private readonly telemetryQueue: Queue,
    private readonly config: ConfigService
    ) {
  }

  async getAndQueueProducerTelemetry(minerUrl: string): Promise<void> {

    try {
      this.logger.log("Fetching telemetry for miner", minerUrl);
      const response = await axios.get(minerUrl);
      this.logger.log("Telemetry of miner received successfully", response.data);

      this.logger.log("Queueing telemetry for miner", minerUrl);
      await this.telemetryQueue.add(response.data);
      this.logger.log("Queued telemetry for miner successfully", minerUrl);
    }
    catch(error) {
      this.logger.error(error);
    }
  }

  //TODO - Move this to fetch from DB after creating a Miner Management Module
  async getMinerUrls(): Promise<string[]> {

    const minerUrl = this.config.get('MINER_URL');
    const minerCount = Number(this.config.get('MINER_COUNT'));

    const minerUrls: string[] = [];
    for (let i = 0; i < minerCount; i++) {
      minerUrls.push(minerUrl + randomUUID());
    }
    return minerUrls;
  }
}
