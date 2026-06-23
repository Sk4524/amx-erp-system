/*
  Warnings:

  - You are about to drop the column `nextRunAt` on the `ScheduledReport` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ScheduledReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduledReport" DROP COLUMN "nextRunAt",
DROP COLUMN "updatedAt";
