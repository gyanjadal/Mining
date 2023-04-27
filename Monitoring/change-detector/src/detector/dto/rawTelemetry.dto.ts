import { IsNotEmpty, IsString } from "class-validator";

export class CreateRawTelemetryDTO {
    @IsString()
    @IsNotEmpty()
    minerId: string;

    @IsString()
    @IsNotEmpty()
    minerData: string;
}