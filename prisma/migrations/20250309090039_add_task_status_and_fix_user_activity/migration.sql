/*
  Warnings:

  - You are about to drop the column `action` on the `UserActivity` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `UserActivity` table. All the data in the column will be lost.
  - Added the required column `type` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "action",
DROP COLUMN "metadata",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
