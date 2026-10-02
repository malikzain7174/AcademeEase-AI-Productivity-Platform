import * as React from 'react';

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
import AddWorkspaceForm from './add-workspace-form';

export const ADD_WORKSPACE_MODAL_ROUTE = 'add-workspace';

export function AddWorkspaceModal() {
  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={ADD_WORKSPACE_MODAL_ROUTE}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>Add Workspace</ModalTitle>
            <ModalDescription>
              Create a new workspace to organize your tasks.
            </ModalDescription>
          </ModalHeader>
          <AddWorkspaceForm className='px-4 md:px-0' />
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
