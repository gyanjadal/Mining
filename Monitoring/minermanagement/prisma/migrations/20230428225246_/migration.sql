/*
  Warnings:

  - You are about to drop the `Anomaly` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessedTelemetry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Anomaly";

-- DropTable
DROP TABLE "ProcessedTelemetry";

-- CreateTable
CREATE TABLE "MinerProcessedTelemetry" (
    "id" SERIAL NOT NULL,
    "minerId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyValue" TEXT NOT NULL,
    "isAnomaly" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinerProcessedTelemetry_pkey" PRIMARY KEY ("id")
);
