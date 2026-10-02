-- CreateEnum
CREATE TYPE "PomodoroSessionType" AS ENUM ('FOCUS', 'SHORT_BREAK', 'LONG_BREAK');

-- AlterTable
ALTER TABLE "PomodoroSession" ADD COLUMN     "sessionType" "PomodoroSessionType" NOT NULL DEFAULT 'FOCUS';

-- CreateIndex
CREATE INDEX "PomodoroSession_sessionType_idx" ON "PomodoroSession"("sessionType");
