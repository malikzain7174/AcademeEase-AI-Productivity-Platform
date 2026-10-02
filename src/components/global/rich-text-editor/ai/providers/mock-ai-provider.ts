import {
  AIOperationProvider,
  TextOperation,
  AIContext,
} from '../core/ai-interface';
import { generateMockResponse } from '../mock-responses';

export class MockAIProvider implements AIOperationProvider {
  async generateResponse(prompt: string, context: AIContext): Promise<string> {
    return generateMockResponse({
      feature: context.selectedFeature || 'continue',
      selectedText: prompt,
    });
  }

  async processTextModification(
    text: string,
    operation: TextOperation
  ): Promise<string> {
    return generateMockResponse({ feature: operation, selectedText: text });
  }
}
