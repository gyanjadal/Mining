import { Injectable, Logger } from '@nestjs/common';
import { UUID, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MinerUrlDto } from './dto/minerUrl.dto';
import { MinerDto } from './dto/miner.dto';

@Injectable()
export class MinerService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(MinerService.name);

  // Get list of miners with their info
  async getMiners() : Promise<MinerDto[]>{
    const miners = await this.prisma.miner.findMany();
    const minersToArray: MinerDto[] = miners.map((miner) => {
      return {
        minerId: miner.minerId,
        minerUrl: miner.minerUrl,
      }
    });
    return minersToArray;
  }
  
  // Onboard a new miner by assign a unique uuid
  async onboardMiner(minerUrlDto: MinerUrlDto): Promise<string> {

    const minerId = randomUUID();

    try {
      this.logger.log("Saving Miner", JSON.stringify(minerUrlDto));
      await this.saveMinerToDB(minerId, minerUrlDto);
      this.logger.log("Miner saved", JSON.stringify(minerUrlDto));
      return minerId;
    }
    catch(error) {
      this.logger.error(error);
      throw error;
    }
  }


  // Save miner info to DB
  private async saveMinerToDB(
    minerId: UUID,
    minerUrlDTO: MinerUrlDto,
  ): Promise<void> {

      await this.prisma.miner.create({
        data: {
          minerId: minerId,
          minerUrl: minerUrlDTO.minerUrl,
        }
      });
    }
  }