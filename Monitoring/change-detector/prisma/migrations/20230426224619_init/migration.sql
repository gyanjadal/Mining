-- CreateTable
CREATE TABLE "MinerTelemetry" (
    "id" SERIAL NOT NULL,
    "minerid" TEXT NOT NULL,
    "minerdata" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinerTelemetry_pkey" PRIMARY KEY ("id")
);
