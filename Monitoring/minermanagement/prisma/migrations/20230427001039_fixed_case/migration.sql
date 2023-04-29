/*
  Warnings:

  - You are about to drop the column `minerid` on the `Anomalies` table. All the data in the column will be lost.
  - You are about to drop the column `minerdata` on the `MinerTelemetry` table. All the data in the column will be lost.
  - You are about to drop the column `minerid` on the `MinerTelemetry` table. All the data in the column will be lost.
  - Added the required column `minerId` to the `Anomalies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minerData` to the `MinerTelemetry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minerId` to the `MinerTelemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anomalies" DROP COLUMN "minerid",
ADD COLUMN     "minerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MinerTelemetry" DROP COLUMN "minerdata",
DROP COLUMN "minerid",
ADD COLUMN     "minerData" TEXT NOT NULL,
ADD COLUMN     "minerId" TEXT NOT NULL;
