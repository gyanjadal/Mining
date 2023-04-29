/*
  Warnings:

  - You are about to drop the `Anomalies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Anomalies";

-- CreateTable
CREATE TABLE "Anomaly" (
    "id" SERIAL NOT NULL,
    "minerId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("id")
);
