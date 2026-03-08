-- CreateEnum
CREATE TYPE "StressLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "StressQuestion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StressQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressAnswer" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StressAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressDiagnostic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" "StressLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressDiagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressDiagnosticAnswer" (
    "id" TEXT NOT NULL,
    "diagnosticId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "StressDiagnosticAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StressQuestion_isActive_order_idx" ON "StressQuestion"("isActive", "order");

-- CreateIndex
CREATE UNIQUE INDEX "StressQuestion_order_key" ON "StressQuestion"("order");

-- CreateIndex
CREATE UNIQUE INDEX "StressAnswer_questionId_order_key" ON "StressAnswer"("questionId", "order");

-- CreateIndex
CREATE INDEX "StressDiagnostic_userId_idx" ON "StressDiagnostic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StressDiagnosticAnswer_diagnosticId_questionId_key" ON "StressDiagnosticAnswer"("diagnosticId", "questionId");

-- AddForeignKey
ALTER TABLE "StressAnswer" ADD CONSTRAINT "StressAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "StressQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StressDiagnostic" ADD CONSTRAINT "StressDiagnostic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StressDiagnosticAnswer" ADD CONSTRAINT "StressDiagnosticAnswer_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "StressDiagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StressDiagnosticAnswer" ADD CONSTRAINT "StressDiagnosticAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "StressQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StressDiagnosticAnswer" ADD CONSTRAINT "StressDiagnosticAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "StressAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
