import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DetectorModule } from './detector/detector.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    DetectorModule,
    PrismaModule
  ]
})
export class AppModule {}
