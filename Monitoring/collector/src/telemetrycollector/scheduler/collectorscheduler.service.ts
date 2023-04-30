import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelemetryCollectorService } from '../telemetrycollector.service';
import { MinerDto } from '../dto';

@Injectable()
export class CollectorSchedulerService {
    private readonly logger = new Logger(CollectorSchedulerService.name);

    constructor(private telemetryCollectorService: TelemetryCollectorService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduleTask(): Promise<void> {
      this.logger.log('Waking up to collect data from all miners...');

      const miners: MinerDto[] = await this.telemetryCollectorService.getMiners();

      if (miners.length == 0) {
        this.logger.log('No miners found.');
        return;
      }

      const tasks : Promise<any>[] = [];

      miners.forEach(miner => {
        const task = this.telemetryCollectorService.getAndQueueProducerTelemetry(miner);
        tasks.push(task);
      });

      await Promise.all(tasks);
      this.logger.log('Finished collection of data from all ' + miners.length + ' miners.');
    }
  }