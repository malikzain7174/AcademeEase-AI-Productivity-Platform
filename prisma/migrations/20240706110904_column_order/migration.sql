/*
  Warnings:

  - Added the required column `order` to the `KanbanColumn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KanbanColumn" ADD COLUMN     "order" INTEGER NOT NULL;
