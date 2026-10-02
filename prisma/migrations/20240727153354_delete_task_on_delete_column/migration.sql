-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_kanbanColumnId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_kanbanColumnId_fkey" FOREIGN KEY ("kanbanColumnId") REFERENCES "KanbanColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
