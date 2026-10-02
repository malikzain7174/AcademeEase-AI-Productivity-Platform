export interface AIOperationProvider {
  generateResponse(prompt: string, context: AIContext): Promise<string>;
  processTextModification(
    text: string,
    operation: TextOperation
  ): Promise<string>;
}

export type TextOperation =
  | 'grammar'
  | 'length'
  | 'continue'
  | 'improve'
  | 'custom';

export type WritingTone = 'professional' | 'casual' | 'academic' | 'creative';

export interface AIContext {
  selectedFeature?: TextOperation;
  editorContent?: string;
  selectedText?: string;
  cursorPosition?: number;
  lengthAdjustment?: number;
  tone?: WritingTone;
  customPrompt?: string;
  userPreferences?: {
    gradeYear?: string;
    fieldOfStudy?: string | null;
    learningStyle?: string;
    studyEnvironment?: string;
    ageRange?: string;
  };
}
