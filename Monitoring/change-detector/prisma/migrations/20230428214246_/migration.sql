/*
  Warnings:

  - You are about to drop the `Anomalies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinerTelemetry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Anomalies";

-- DropTable
DROP TABLE "MinerTelemetry";

-- CreateTable
CREATE TABLE "Miner" (
    "id" SERIAL NOT NULL,
    "minerId" TEXT NOT NULL,
    "minerUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Miner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinerRawTelemetry" (
    "id" SERIAL NOT NULL,
    "minerId" TEXT NOT NULL,
    "minerData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinerRawTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinerProcessedTelemetry" (
    "id" SERIAL NOT NULL,
    "minerId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinerProcessedTelemetry_pkey" PRIMARY KEY ("id")
);
