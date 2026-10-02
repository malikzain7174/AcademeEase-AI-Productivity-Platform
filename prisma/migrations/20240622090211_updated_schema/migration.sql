/*
  Warnings:

  - You are about to drop the column `userId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `KanbanBoard` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundKnowledgeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fieldOfStudy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gradeYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `learningStyle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studyEnvironment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AcademicGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BackgroundKnowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Challenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpecialRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AcademicGoalToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChallengeToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InterestToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonaToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SpecialRequirementToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspaceId]` on the table `KanbanBoard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `KanbanBoard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('SYSTEM', 'USER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Priority" ADD VALUE 'HIGHEST';
ALTER TYPE "Priority" ADD VALUE 'HIGHER';
ALTER TYPE "Priority" ADD VALUE 'LOWER';
ALTER TYPE "Priority" ADD VALUE 'LOWEST';

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropForeignKey
ALTER TABLE "KanbanBoard" DROP CONSTRAINT "KanbanBoard_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_backgroundKnowledgeId_fkey";

-- DropForeignKey
ALTER TABLE "_AcademicGoalToUser" DROP CONSTRAINT "_AcademicGoalToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_AcademicGoalToUser" DROP CONSTRAINT "_AcademicGoalToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeToUser" DROP CONSTRAINT "_ChallengeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeToUser" DROP CONSTRAINT "_ChallengeToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_PersonaToUser" DROP CONSTRAINT "_PersonaToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonaToUser" DROP CONSTRAINT "_PersonaToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_SpecialRequirementToUser" DROP CONSTRAINT "_SpecialRequirementToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SpecialRequirementToUser" DROP CONSTRAINT "_SpecialRequirementToUser_B_fkey";

-- DropIndex
DROP INDEX "Folder_userId_idx";

-- DropIndex
DROP INDEX "KanbanBoard_subjectId_idx";

-- DropIndex
DROP INDEX "KanbanBoard_subjectId_key";

-- DropIndex
DROP INDEX "Note_subjectId_idx";

-- DropIndex
DROP INDEX "Note_userId_idx";

-- DropIndex
DROP INDEX "Task_subjectId_idx";

-- DropIndex
DROP INDEX "Task_userId_idx";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "KanbanBoard" DROP COLUMN "subjectId",
ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "subjectId",
DROP COLUMN "userId",
ADD COLUMN     "workspaceId" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "subjectId",
DROP COLUMN "userId",
ADD COLUMN     "workspaceId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "backgroundKnowledgeId",
DROP COLUMN "fieldOfStudy",
DROP COLUMN "gradeYear",
DROP COLUMN "learningStyle",
DROP COLUMN "studyEnvironment";

-- DropTable
DROP TABLE "AcademicGoal";

-- DropTable
DROP TABLE "BackgroundKnowledge";

-- DropTable
DROP TABLE "Challenge";

-- DropTable
DROP TABLE "Interest";

-- DropTable
DROP TABLE "Persona";

-- DropTable
DROP TABLE "SpecialRequirement";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "_AcademicGoalToUser";

-- DropTable
DROP TABLE "_ChallengeToUser";

-- DropTable
DROP TABLE "_InterestToUser";

-- DropTable
DROP TABLE "_PersonaToUser";

-- DropTable
DROP TABLE "_SpecialRequirementToUser";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workspace_userId_idx" ON "Workspace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KanbanBoard_workspaceId_key" ON "KanbanBoard"("workspaceId");

-- CreateIndex
CREATE INDEX "KanbanBoard_workspaceId_idx" ON "KanbanBoard"("workspaceId");

-- CreateIndex
CREATE INDEX "Note_workspaceId_idx" ON "Note"("workspaceId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_idx" ON "Task"("workspaceId");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanBoard" ADD CONSTRAINT "KanbanBoard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
