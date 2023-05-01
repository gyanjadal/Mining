/*
  Warnings:

  - A unique constraint covering the columns `[minerId]` on the table `Miner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Miner_minerId_key" ON "Miner"("minerId");
