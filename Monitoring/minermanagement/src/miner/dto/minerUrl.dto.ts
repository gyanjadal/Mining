import { IsNotEmpty, IsString } from "class-validator";

export class MinerUrlDto {
    @IsString()
    @IsNotEmpty()
    minerUrl: string;
}