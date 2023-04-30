import { Injectable } from "@nestjs/common";

export enum UpDown {
    Up = "up", Down = "down"
  }

@Injectable()
export class TelemetryHelpers {
    getUpDownStatus(threshold: number): string {
        const upDown = Math.random() >= threshold ? UpDown.Up: UpDown.Down;
        return upDown.toString();
    }

    getRandomTempIn(maxNormalTemp: number, threshold: number): number {
        const r = Number(Math.random().toFixed(2)) * 25;
        return Math.random() >= threshold ? maxNormalTemp - r : maxNormalTemp + r;
    }

    getRandomTempOut(maxNormalTemp: number, threshold: number) {
        const r = Number(Math.random().toFixed(2)) * 25;
        return Math.random() >= threshold ? maxNormalTemp - r : maxNormalTemp + r;
    }

    getRandomHashRate(minNormalHashRate: number, threshold: number) {
        const r = Number(Math.random().toFixed(2)) * 2000;
        return Math.random() >= threshold ? minNormalHashRate + r : minNormalHashRate - r;
    }

    getRandomFanSpeed(minNormalFanSpeed: number, threshold: number) {
        const r = Number(Math.random().toFixed(2)) * 2000;
        return Math.random() >= threshold ? minNormalFanSpeed + r : minNormalFanSpeed - r;
    }
}
