import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class MinerDto {
    @IsString()
    @IsNotEmpty()
    minerId: string;

    @IsString()
    @IsNotEmpty()
    minerUrl: string;
}