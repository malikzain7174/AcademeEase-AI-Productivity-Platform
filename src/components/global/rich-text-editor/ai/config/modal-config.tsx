import { AI_ASSIST_MODAL_ROUTE, AssistModal } from '../assist-modal';
import { Sparkles } from 'lucide-react';

export type AIModalFeature = {
  routeSuffix: string;
  component: React.ComponentType;
  title: string;
  description: string;
  icon: typeof Sparkles;
};

export const AI_MODAL_FEATURES: AIModalFeature[] = [
  {
    routeSuffix: AI_ASSIST_MODAL_ROUTE,
    component: AssistModal,
    title: 'AI Assist',
    description: 'Get help with your notes.',
    icon: Sparkles,
  },
];
