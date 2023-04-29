import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MinerModule } from './miner/miner.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    PrismaModule,
    MinerModule
  ]
})
export class AppModule {}
