import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelemetryCollectorService } from '../telemetrycollector.service';

@Injectable()
export class CollectorSchedulerService {
    private readonly logger = new Logger(CollectorSchedulerService.name);

    constructor(private telemetryCollectorService: TelemetryCollectorService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async scheduleTask() {
      this.logger.log('Waking up to collect data from all miners...');

      const minerUrls: string[] = await this.telemetryCollectorService.getMinerUrls();

      const tasks : Promise<any>[] = [];

      minerUrls.forEach(minerUrl => {
        const task = this.telemetryCollectorService.getAndQueueProducerTelemetry(minerUrl);
        tasks.push(task);
      });

      await Promise.all(tasks);
      this.logger.log('Finished collection of data from all miners.');
    }
  }