-- CreateTable
CREATE TABLE "Anomalies" (
    "id" SERIAL NOT NULL,
    "minerid" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anomalies_pkey" PRIMARY KEY ("id")
);
