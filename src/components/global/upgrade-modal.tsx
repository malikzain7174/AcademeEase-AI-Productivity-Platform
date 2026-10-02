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

export const UPGRADE_SUBSCRIPTION_MODAL_ROUTE = 'upgrade-subscription';

export function UpgradeSubscriptionModal() {
  return (
    // TODO: INVESTIGATE
    <React.Suspense fallback={null}>
      <Modal routeName={UPGRADE_SUBSCRIPTION_MODAL_ROUTE}>
        <ModalContent>
          <ModalHeader className='text-left'>
            <ModalTitle>Upgrade to Premium</ModalTitle>
            <ModalDescription>
              Upgrade to Premium to unlock all features.
            </ModalDescription>
          </ModalHeader>
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
