import { IsNotEmpty, IsString } from "class-validator";

export class RawTelemetryDto {
    @IsString()
    @IsNotEmpty()
    minerId: string;

    @IsString()
    @IsNotEmpty()
    minerData: string;
}