import { CircleCheckBig } from 'lucide-react';
import React from 'react';
import SubtaskForm from './subtask-form';
import { getSubtasksByTaskId } from '@/actions/subtasks';
import AddSubtaskForm from './add-subtask-form';
import SuggestTasks from './suggest-tasks';

type Props = {
  taskId: string;
};

const Subtasks = async ({ taskId }: Props) => {
  const completedSubtasks = await getSubtasksByTaskId(taskId, 'completed');
  const incompleteSubtasks = await getSubtasksByTaskId(taskId, 'incomplete');

  if (!completedSubtasks || !incompleteSubtasks) return null;

  return (
    <div className='px-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-medium'>
          Subtask{' '}
          <span className='text-muted-foreground text-medium'>
            {completedSubtasks.length}/
            {completedSubtasks.length + incompleteSubtasks.length}
          </span>
        </h2>
        <SuggestTasks taskId={taskId} />
      </div>
      <div className='relative min-h-[200px] flex flex-col'>
        {incompleteSubtasks.length > 0 ? (
          incompleteSubtasks.map((subtask, index) => (
            <SubtaskForm
              key={subtask.id}
              subtask={subtask}
              bgColorMuted={index % 2 === 0}
            />
          ))
        ) : (
          <div className='text-muted-foreground m-auto'>
            Hurray! 🍾 Nothing new here.
          </div>
        )}
        <AddSubtaskForm taskId={taskId} />
      </div>
      {completedSubtasks.length > 0
        ? completedSubtasks.map((subtask, index) => (
            <SubtaskForm
              key={subtask.id}
              subtask={subtask}
              bgColorMuted={index % 2 === 0}
            />
          ))
        : null}
      {completedSubtasks.length > 0 && (
        <div className='m-4 flex items-center gap-2'>
          <CircleCheckBig size={20} />
          <span className='text-muted-foreground'>
            {`+ ${completedSubtasks.length} Completed Tasks`}
          </span>
        </div>
      )}
    </div>
  );
};

export default Subtasks;
