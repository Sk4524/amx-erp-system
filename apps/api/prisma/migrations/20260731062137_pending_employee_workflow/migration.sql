/*
  Warnings:

  - The `status` column on the `PendingEmployee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PendingEmployeeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "PendingEmployee" DROP COLUMN "status",
ADD COLUMN     "status" "PendingEmployeeStatus" NOT NULL DEFAULT 'PENDING';
