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
import { UserPreferencesFormWrapper } from './user-preferences-form-wrapper';

export const USER_PREFERENCES_MODAL_ROUTE = 'user-preferences';

export function UserPreferencesModal() {
  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={USER_PREFERENCES_MODAL_ROUTE}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>User Preferences</ModalTitle>
            <ModalDescription>
              Customize your academic profile to get personalized study
              recommendations.
            </ModalDescription>
          </ModalHeader>
          <UserPreferencesFormWrapper />
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
