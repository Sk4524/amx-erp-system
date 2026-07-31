-- AlterTable
ALTER TABLE "PendingEmployee" ADD COLUMN     "employmentType" TEXT DEFAULT 'FULL_TIME',
ADD COLUMN     "joiningDate" TIMESTAMP(3),
ADD COLUMN     "salary" DOUBLE PRECISION DEFAULT 0;
