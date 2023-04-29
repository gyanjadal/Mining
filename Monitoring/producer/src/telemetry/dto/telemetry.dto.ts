import { ApiProperty } from '@nestjs/swagger';
//import { IsNotEmpty, IsString } from "class-validator"
import { UUID } from 'node:crypto';

export class TelemetryDto {
    @ApiProperty()
    id: UUID;
  
    @ApiProperty()
    health: string;
  
    @ApiProperty()
    pool: string;
  
    @ApiProperty()
    temp1_in: number;
  
    @ApiProperty()
    temp1_out: number;
  
    @ApiProperty()
    temp2_in: number;
  
    @ApiProperty()
    temp2_out: number;
  
    @ApiProperty()
    temp3_in: number;
  
    @ApiProperty()
    temp3_out: number;
  
    @ApiProperty()
    temp4_in: number;
  
    @ApiProperty()
    temp4_out: number;
  
    @ApiProperty({ type: [Number] })
    fans: number[];
  
    @ApiProperty()
    hashrate: number;
  }