import { TextOperation, WritingTone } from './ai-interface';

export const AI_CONFIG = {
  useMock: process.env.NEXT_PUBLIC_AI_MOCK === 'true',
  defaultTone: 'professional' as WritingTone,
  defaultFeature: 'continue' as TextOperation,
  maxRetries: 3,
  retryDelay: 1000,
};
