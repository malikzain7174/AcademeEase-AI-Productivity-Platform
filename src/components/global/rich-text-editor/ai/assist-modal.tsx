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
import AssistForm from './assist-form';

export const AI_ASSIST_MODAL_ROUTE = 'ai-assist';

export function AssistModal() {
  return (
    <React.Suspense fallback={null}>
      <Modal routeName={AI_ASSIST_MODAL_ROUTE}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>AI Assist</ModalTitle>
            <ModalDescription>
              Use AI to enhance your content with various features.
            </ModalDescription>
          </ModalHeader>

          <div className='px-4 md:px-0'>
            <AssistForm />
          </div>

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
