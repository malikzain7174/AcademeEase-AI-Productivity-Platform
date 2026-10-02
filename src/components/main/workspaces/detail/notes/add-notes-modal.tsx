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

export const ADD_NOTES_MODAL_ROUTE = 'add-notes';

interface Props {
  children: React.ReactNode;
}

export function AddNotesModal({ children }: Props) {
  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={ADD_NOTES_MODAL_ROUTE}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>Add Notes</ModalTitle>
            <ModalDescription>
              Create notes to keep track of important information.
            </ModalDescription>
          </ModalHeader>
          {children}
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
