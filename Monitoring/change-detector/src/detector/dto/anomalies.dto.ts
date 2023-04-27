import { IsNotEmpty, IsString } from "class-validator";

export class CreateAnomaliesDTO {
    @IsString()
    @IsNotEmpty()
    minerId: string;

    @IsString()
    @IsNotEmpty()
    propertyName: string;

    @IsString()
    @IsNotEmpty()
    propertyValue: string;
}