'use client';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalLink,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import AddColumnForm from './add-column-form';
import React from 'react';

export const ADD_NEW_COLUMN_MODAL_ROUTE = 'add-new-column';

export function AddColumnModal() {
  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={ADD_NEW_COLUMN_MODAL_ROUTE}>
        <ModalTrigger>
          <Button variant='secondary' size='lg' className='w-full mt-6' asChild>
            <ModalLink href={`?${ADD_NEW_COLUMN_MODAL_ROUTE}`}>
              ＋ Add New Column
            </ModalLink>
          </Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>Add New Column</ModalTitle>
            <ModalDescription>
              Add a new column to organize your tasks.
            </ModalDescription>
          </ModalHeader>
          <AddColumnForm className='px-4 md:px-0' />
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
