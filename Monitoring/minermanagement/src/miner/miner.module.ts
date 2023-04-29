import { Module } from '@nestjs/common';
import { MinerController } from './miner.controller';
import { MinerService } from './miner.service';

@Module({
    controllers: [MinerController],
    providers: [MinerService]
})
export class MinerModule {}