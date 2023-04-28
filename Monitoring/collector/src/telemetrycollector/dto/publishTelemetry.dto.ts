import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class PublishTelemetryDto {
    @IsString()
    @IsNotEmpty()
    Url: string;
  }