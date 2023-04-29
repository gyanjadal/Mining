/*
  Warnings:

  - Added the required column `isAnomaly` to the `MinerProcessedTelemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinerProcessedTelemetry" ADD COLUMN     "isAnomaly" BOOLEAN NOT NULL;
