-- CreateTable
CREATE TABLE "ReportHistory" (
    "id" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ReportHistory_pkey" PRIMARY KEY ("id")
);
