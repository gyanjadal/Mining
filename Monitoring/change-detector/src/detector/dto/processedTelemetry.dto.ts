import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";

export class ProcessedTelemetryDto {
    @IsString()
    @IsNotEmpty()
    minerId: string;

    @IsString()
    @IsNotEmpty()
    propertyName: string;

    @IsString()
    @IsNotEmpty()
    propertyValue: string;

    @IsBoolean()
    @IsNotEmpty()
    isAnomaly: boolean;

    @IsDate()
    @IsNotEmpty()
    clientTime: Date;

}