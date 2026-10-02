import React from 'react';
import { AddWorkspaceModal } from '../main/workspaces/add-workspace-modal';
import { UpgradeSubscriptionModal } from './upgrade-modal';
import { AI_MODAL_FEATURES } from './rich-text-editor/ai/config/modal-config';
import { UserPreferencesModal } from '../main/dashboard/layout/navbar/user-preferences-modal';

const ModalRenderer = () => {
  return (
    <>
      <AddWorkspaceModal />
      <UpgradeSubscriptionModal />
      <UserPreferencesModal />

      {/* AI MODALS */}
      {AI_MODAL_FEATURES.map(({ component: Component, routeSuffix }) => (
        <Component key={routeSuffix} />
      ))}
    </>
  );
};

export default ModalRenderer;
