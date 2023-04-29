import { Body, Controller, Get, Post} from '@nestjs/common';
import { MinerService } from './miner.service';
import { MinerUrlDto } from './dto/minerUrl.dto';
import { MinerDto } from './dto/miner.dto';

@Controller('miner')
export class MinerController {
    constructor(private minerService: MinerService) {}
        
    @Get('list')
    async getMiners(): Promise<MinerDto[]> {
        return await this.minerService.getMiners();
    }

    @Post('onboard')
    async onboardNewMiner(@Body() dto: MinerUrlDto): Promise<string> {
        return await this.minerService.onboardMiner(dto);
    }

}
