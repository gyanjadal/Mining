import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { MinerService } from './miner.service';
import { MinerUrlDto } from './dto/minerUrl.dto';
import { MinerDto } from './dto/miner.dto';

@Controller('miner')
export class MinerController {
    constructor(private minerService: MinerService) {}
        
    @Get('list')
    async getMiners(@Query('limit') limit: number): Promise<MinerDto[]> {
        return await this.minerService.getMiners(limit);
    }

    @Post('onboard')
    async onboardNewMiner(@Body() dto: MinerUrlDto): Promise<MinerDto> {
        return await this.minerService.onboardMiner(dto);
    }

    //For simulation use
    @Post('onboard/100')
    async onboard100Miners(@Body() dto: MinerUrlDto): Promise<MinerDto[]> {
        const minerDtos: MinerDto[] = [];
        for (let index = 0; index < 100; index++) {
            minerDtos.push(await this.minerService.onboardMiner(dto));
        }
        return minerDtos;
    }

}
