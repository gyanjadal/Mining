import { Injectable } from "@nestjs/common";

export enum UpDown {
    Up = "up", Down = "down"
  }

@Injectable()
export class TelemetryHelpers {
    getUpDownStatus(threshold: number) {
        const upDown = Math.random() >= threshold ? UpDown.Up: UpDown.Down;
        return upDown.toString();
    }

    getRandomTempIn() {
        return 45 + Number(Math.random().toFixed(2)) * 15;
    }

    getRandomTempOut(maxNormalTemp: number, abnormalTempThreshold: number) {
        const r = Number(Math.random().toFixed(2)) * 25;
        return Math.random() >= abnormalTempThreshold ? maxNormalTemp - r : maxNormalTemp + r;
    }

    getRandomHashRate(minNormalHashRate: number, abnormalHashRateThreshold: number) {
        const r = Number(Math.random().toFixed(2)) * 2000;
        return Math.random() >= abnormalHashRateThreshold ? minNormalHashRate + r : minNormalHashRate - r;
    }

    getRandomFanSpeed(minNormalFanSpeed: number, abnormalFanSpeedThreshold: number) {
        const r = Number(Math.random().toFixed(2)) * 2000;
        return Math.random() >= abnormalFanSpeedThreshold ? minNormalFanSpeed + r : minNormalFanSpeed - r;
    }
}
