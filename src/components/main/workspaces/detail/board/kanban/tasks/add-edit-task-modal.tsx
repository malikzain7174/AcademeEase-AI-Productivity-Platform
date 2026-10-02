import { Button } from '@/components/ui/button';

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import AddOrEditTaskForm from './add-edit-task-form';
import { Task } from '@prisma/client';
import React from 'react';

export const ADD_TASK_MODAL_ROUTE = 'add-task';
export const ADD_SUBTASK_MODAL_ROUTE = 'add-subtask';
export const EDIT_TASK_MODAL_ROUTE = 'edit-task';
export const EDIT_SUBTASK_MODAL_ROUTE = 'edit-subtask';

interface Props {
  task?: Task;
  type?: 'task' | 'subtask';
  redirectToBoard?: boolean;
}
export async function AddOrEditTaskModal({
  task,
  type = 'task',
  redirectToBoard = false,
}: Props) {
  const getRoutename = () => {
    if (type === 'task') {
      if (task) {
        return EDIT_TASK_MODAL_ROUTE;
      }
      return ADD_TASK_MODAL_ROUTE;
    } else {
      if (task) {
        return EDIT_SUBTASK_MODAL_ROUTE;
      }
      return ADD_SUBTASK_MODAL_ROUTE;
    }
  };

  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={getRoutename()}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>
              {type === 'task'
                ? task
                  ? 'Edit Task'
                  : 'Add Task'
                : task
                  ? 'Edit Subtask'
                  : 'Add Subtask'}
            </ModalTitle>
            <ModalDescription>
              {type === 'task'
                ? task
                  ? 'Edit your task'
                  : 'Add a new task'
                : task
                  ? 'Edit your subtask'
                  : 'Add a new subtask'}
            </ModalDescription>
          </ModalHeader>
          <AddOrEditTaskForm
            className='px-4 md:px-0'
            task={task}
            redirectToBoard={redirectToBoard}
          />
          <ModalFooter className='pt-2 block md:hidden'>
            <ModalClose asChild>
              <Button variant='outline' className='w-full'>
                Cancel
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Suspense>
  );
}
