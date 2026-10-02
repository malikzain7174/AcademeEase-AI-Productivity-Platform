import {
  AIOperationProvider,
  TextOperation,
  AIContext,
  WritingTone,
} from '../core/ai-interface';
import { AI_CONFIG } from '../core/ai-config';
import { toast } from 'sonner';
import { CREDITS_ON_AI_NOTES } from '@/lib/constants';

export class OpenAIProvider implements AIOperationProvider {
  // Increased max tokens for GPT-4o-mini to allow for more comprehensive responses
  private maxTokens: number = 1500;
  // Default model is GPT-3.5-turbo
  private defaultModel: string = 'gpt-3.5-turbo';

  async generateResponse(prompt: string, context: AIContext): Promise<string> {
    try {
      // Use the appropriate operation based on context
      const operation = context.selectedFeature || 'continue';

      // Debug log to see what's coming in
      console.log('DEBUGGING AI REQUEST:');
      console.log('Operation:', operation);
      console.log('Prompt:', prompt);
      console.log('Context:', JSON.stringify(context, null, 2));

      // For continue writing, if the prompt is empty but we have text in the editor,
      // use the entire editor content as the text to continue from
      if (operation === 'continue' && !prompt.trim() && context.editorContent) {
        console.log('Using editor content as prompt for continuation');
        return await this.processTextModification(
          context.editorContent,
          operation,
          context
        );
      }

      return await this.processTextModification(prompt, operation, context);
    } catch (error) {
      console.error('OpenAI generation failed:', error);

      // Handle insufficient credits error
      if (
        error instanceof Error &&
        error.message.includes('Insufficient credits')
      ) {
        toast.error(`Insufficient credits`, {
          description: `You need ${CREDITS_ON_AI_NOTES} credits to use this AI feature`,
          position: 'top-right',
          richColors: true,
        });
        return `⚠️ Insufficient credits: You need ${CREDITS_ON_AI_NOTES} credits to use this AI feature.`;
      }

      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async processTextModification(
    text: string,
    operation: TextOperation,
    context?: AIContext
  ): Promise<string> {
    try {
      // If text is empty, return a helpful message for the user
      if (!text.trim() && operation === 'continue') {
        return 'Please enter some text to continue from. The editor appears to be empty.';
      }

      // Create system prompt based on operation
      const systemPrompt = this.createSystemPrompt(operation, context);

      // Create user prompt based on operation and context
      const userPrompt = this.createUserPrompt(text, operation, context);

      // Select the appropriate model based on the operation
      const model = this.getModelForOperation(operation, text.length);

      // Debug log the prompts and model
      console.log('DEBUGGING PROMPT GENERATION:');
      console.log('Model selected:', model);
      console.log('System prompt:', systemPrompt);
      console.log('User prompt:', userPrompt);
      console.log('Temperature:', this.getTemperatureForOperation(operation));

      // For continue writing with selected text, we need to handle it differently
      let responseText = '';

      if (
        operation === 'continue' &&
        context?.selectedText &&
        text.includes(context.selectedText)
      ) {
        // Call the server-side API route instead of OpenAI directly
        console.log('Sending API request for continuation with selected text');
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            maxTokens: this.maxTokens,
            temperature: this.getTemperatureForOperation(operation),
            topP: 0.9,
            presencePenalty: 0.2,
            frequencyPenalty: 0.3,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        responseText = data.choices[0]?.message?.content || '';

        // Show toast with credit information if available
        if (data.creditInfo) {
          toast.success(`AI operation completed`, {
            description: `${data.creditInfo.deducted} credits used. ${data.creditInfo.remaining} credits remaining.`,
            position: 'top-right',
            richColors: true,
          });
        }

        // If the selected text is in the middle of the document, we need to extract only the continuation part
        if (!text.endsWith(context.selectedText)) {
          // Find where the original text ends in the response
          const lastSentenceOfOriginal =
            context.selectedText.split(/[.!?]\s+/).pop() || '';

          // Only return the new content that comes after the original text
          const originalTextIndex = responseText.indexOf(
            lastSentenceOfOriginal
          );
          if (originalTextIndex !== -1) {
            const endOfOriginalIndex =
              originalTextIndex + lastSentenceOfOriginal.length;
            responseText = responseText.substring(endOfOriginalIndex);
          }
        }
      } else {
        // For other operations, process normally
        console.log('Sending API request for standard operation');
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            maxTokens: this.maxTokens,
            temperature: this.getTemperatureForOperation(operation),
            topP: 0.9,
            presencePenalty: 0.1,
            frequencyPenalty: 0.2,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        responseText = data.choices[0]?.message?.content || '';

        // Show toast with credit information if available
        if (data.creditInfo) {
          toast.success(`AI operation completed`, {
            description: `${data.creditInfo.deducted} credits used. ${data.creditInfo.remaining} credits remaining.`,
            position: 'top-right',
            richColors: true,
          });
        }
      }

      return responseText;
    } catch (error) {
      console.error('OpenAI text modification failed:', error);
      throw new Error(
        `Failed to modify text: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Selects the appropriate model based on the operation and text length
   * Uses GPT-4o-mini for most tasks, and falls back to GPT-3.5-turbo for simpler tasks
   */
  private getModelForOperation(
    operation: TextOperation,
    textLength: number
  ): string {
    // For creative tasks or operations requiring more context understanding, use GPT-4o-mini
    if (
      operation === 'continue' ||
      operation === 'improve' ||
      operation === 'custom' ||
      textLength > 1500
    ) {
      return this.defaultModel; // gpt-3.5-turbo (changed from gpt-4o-mini)
    }

    // For simple grammar checking of short texts, use GPT-3.5-turbo to optimize for cost
    if (operation === 'grammar' && textLength < 800) {
      return 'gpt-3.5-turbo';
    }

    // For length adjustments of short to medium texts, use GPT-3.5-turbo
    if (operation === 'length' && textLength < 1000) {
      return 'gpt-3.5-turbo';
    }

    // Default to GPT-3.5-turbo for everything else
    return this.defaultModel;
  }

  private createSystemPrompt(
    operation: TextOperation,
    context?: AIContext
  ): string {
    const tone = context?.tone || 'professional';
    const preferences = context?.userPreferences;

    // Create preference context string
    const preferenceContext = preferences
      ? `
USER PREFERENCES:
${preferences.gradeYear ? `- Academic Level: ${preferences.gradeYear.charAt(0) + preferences.gradeYear.slice(1).toLowerCase()}` : ''}
${preferences.fieldOfStudy ? `- Field of Study: ${preferences.fieldOfStudy}` : ''}
${preferences.learningStyle ? `- Learning Style: ${preferences.learningStyle.charAt(0) + preferences.learningStyle.slice(1).toLowerCase()}` : ''}
${
  preferences.studyEnvironment
    ? `- Study Environment: ${preferences.studyEnvironment
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')}`
    : ''
}
${
  preferences.ageRange
    ? `- Age Range: ${preferences.ageRange
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')}`
    : ''
}
`
      : '';

    switch (operation) {
      case 'continue':
        return `You are an expert writing assistant specializing in continuing text with perfect coherence and flow.
                
                ${preferenceContext}
                
                CONTEXT ANALYSIS:
                - Carefully analyze the writing style, vocabulary level, tone, and structure
                - Identify key themes, arguments, or narrative elements
                - Note any specialized terminology, citation styles, or formatting patterns
                ${preferences?.fieldOfStudy ? `- Pay special attention to ${preferences.fieldOfStudy} terminology and concepts` : ''}
                
                OUTPUT REQUIREMENTS:
                - Continue the text as if written by the same author
                - Maintain consistent tone (${tone}), voice, and terminology
                - Follow the established structure and formatting patterns
                - For academic content: maintain citation style and scholarly approach
                - For creative content: maintain character voices, narrative perspective, and plot consistency
                - Organize information with clear paragraph structure and transitions
                - Avoid introducing new themes that conflict with the original content
                - Never include meta-commentary about what you're doing
                ${preferences?.learningStyle === 'VISUAL' ? `- Include visual descriptions and spatial organization` : ''}
                ${preferences?.learningStyle === 'AUDITORY' ? `- Use rhythmic language and clear verbal patterns` : ''}
                ${preferences?.learningStyle === 'KINESTHETIC' ? `- Include action-oriented descriptions and practical examples` : ''}
                
                FORMAT:
                - Use proper markdown formatting with appropriate headings/subheadings
                - Maintain paragraph length consistent with the original text
                - Continue directly from where the text ends - do not restate or summarize
                
                Do not ask questions or request clarification. Continue writing based on the provided context.`;

      case 'grammar':
        return `You are a professional editor with expertise in grammar, syntax, and style correction.
                
                ${preferenceContext}
                
                CORRECTION PRIORITIES:
                - Fix grammatical errors, spelling mistakes, and punctuation issues
                - Improve awkward sentence structure and word choice
                - Correct inconsistencies in tense, voice, and style
                - Enhance clarity without changing the author's intended meaning
                - Maintain the author's unique voice and terminology
                ${preferences?.fieldOfStudy ? `- Ensure proper use of ${preferences.fieldOfStudy} terminology` : ''}
                
                OUTPUT REQUIREMENTS:
                - Preserve the original meaning, tone, and key points
                - Make only necessary corrections - don't rewrite unnecessarily
                - Maintain specialized terminology and technical language
                - Preserve document structure and formatting
                - For academic content: ensure proper citation format
                ${preferences?.learningStyle === 'VISUAL' ? `- Ensure visual descriptions are clear and well-structured` : ''}
                ${preferences?.learningStyle === 'AUDITORY' ? `- Maintain clear verbal patterns and rhythm` : ''}
                ${preferences?.learningStyle === 'KINESTHETIC' ? `- Keep action-oriented descriptions clear and practical` : ''}
                
                FORMAT:
                - Return the corrected text in markdown format
                - Include a "## Summary of Changes" section at the end that briefly explains key improvements
                - Keep the summary concise and focused on patterns rather than individual fixes
                
                The goal is to enhance readability and correctness while respecting the author's voice.`;

      case 'length':
        return `You are a content editor specializing in precise text length adjustment.
                
                ADJUSTMENT APPROACH:
                - Analyze the text structure, key points, and supporting details
                - Identify core arguments/themes vs. supplementary information
                - Maintain the original meaning, tone, and author's voice
                
                FOR SHORTENING (if length adjustment < 40%):
                - Remove redundancies and unnecessary elaboration
                - Consolidate similar points while preserving key information
                - Tighten language without losing substance or nuance
                - Focus on preserving the strongest examples and evidence
                
                FOR LENGTHENING (if length adjustment > 60%):
                - Add relevant supporting details, examples, and evidence
                - Elaborate on complex concepts with additional explanation
                - Expand key points with nuanced analysis
                - Add appropriate transitions between ideas
                - Ensure additions are consistent with the original style and purpose
                
                FORMAT:
                - Maintain original document structure with proper markdown formatting
                - Preserve heading hierarchy and paragraph organization
                - Ensure smooth transitions between original and new content
                
                The adjusted text should read as a cohesive whole, not as an edited document.`;

      case 'improve':
        return `You are a professional writing coach who transforms good writing into exceptional writing.
                
                ${preferenceContext}
                
                IMPROVEMENT FOCUS:
                - Enhance clarity, coherence, and impact
                - Refine word choice for precision and engagement
                - Improve sentence structure and paragraph flow
                - Strengthen arguments and evidence presentation
                - Adjust tone to be ${tone} while maintaining the author's voice
                - Improve the formatting and structure
                ${preferences?.fieldOfStudy ? `- Ensure proper use of ${preferences.fieldOfStudy} terminology and concepts` : ''}
                ${preferences?.learningStyle === 'VISUAL' ? `- Enhance visual descriptions and spatial organization` : ''}
                ${preferences?.learningStyle === 'AUDITORY' ? `- Strengthen verbal patterns and rhythm` : ''}
                ${preferences?.learningStyle === 'KINESTHETIC' ? `- Improve action-oriented descriptions and practical examples` : ''}
                
                OUTPUT REQUIREMENTS:
                - Preserve the original meaning and key points
                - Maintain the author's unique perspective and insights
                - Enhance rather than completely rewrite the content
                - Ensure logical progression of ideas with clear transitions
                - Eliminate vague language, redundancies, and weak phrasing
                - Add context or clarification only where needed
                - Improve the formatting and structure
                
                FORMAT:
                - Return the improved text in markdown format
                - Maintain the original document structure and heading hierarchy
                - Preserve specialized terminology and technical language
                
                The goal is to elevate the writing while respecting the author's original intent and voice.`;

      case 'custom':
        return `You are an advanced AI writing assistant that follows custom instructions with precision.
                
                APPROACH:
                - Analyze the text and custom instructions carefully
                - Identify the specific changes or improvements requested
                - Apply changes while maintaining overall coherence and quality
                
                OUTPUT REQUIREMENTS:
                - Follow the custom instructions exactly as specified
                - Maintain the text's original meaning unless instructed otherwise
                - Preserve the document structure unless changes are requested
                - Apply consistent style and tone throughout the modified text
                - Be creative and thoughtful in fulfilling special requirements
                
                FORMAT:
                - Return the modified text in markdown format
                - Maintain appropriate heading hierarchy and paragraph structure
                - Ensure the output is ready to use without further editing
                
                The goal is to transform the text according to the custom instructions while maintaining professional quality.`;

      default:
        return `You are a helpful writing assistant that improves text quality.
                
                ${preferenceContext}
                
                APPROACH:
                - Analyze the text for structure, style, and purpose
                - Identify opportunities for improvement while respecting the original
                ${preferences?.fieldOfStudy ? `- Consider ${preferences.fieldOfStudy} context and terminology` : ''}
                
                OUTPUT REQUIREMENTS:
                - Enhance clarity, coherence, and impact
                - Maintain the author's voice and key points
                - Organize information logically with clear transitions
                - Improve word choice and sentence structure
                ${preferences?.learningStyle === 'VISUAL' ? `- Include clear visual descriptions` : ''}
                ${preferences?.learningStyle === 'AUDITORY' ? `- Maintain clear verbal patterns` : ''}
                ${preferences?.learningStyle === 'KINESTHETIC' ? `- Include practical examples and action-oriented descriptions` : ''}
                
                FORMAT:
                - Return the improved text in markdown format
                - Maintain appropriate document structure
                
                The goal is to enhance the writing while preserving its original intent and character.`;
    }
  }

  private createUserPrompt(
    text: string,
    operation: TextOperation,
    context?: AIContext
  ): string {
    // Function to limit context to a reasonable amount
    const limitContext = (
      fullText: string,
      maxLength: number = 1500
    ): string => {
      if (fullText.length <= maxLength) return fullText;

      // For longer texts, keep beginning and end with an indicator in the middle
      const halfLength = Math.floor(maxLength / 2);
      return (
        fullText.slice(0, halfLength) +
        '\n\n[...content omitted for brevity...]\n\n' +
        fullText.slice(-halfLength)
      );
    };

    // Get editor content if available, otherwise use the provided text
    const fullEditorContent = context?.editorContent || text;

    switch (operation) {
      case 'continue': {
        // If there's selected text and the user wants to continue from that selection
        if (context?.selectedText && context.selectedText.length > 0) {
          // If the selected text is at the end of the document
          if (text.endsWith(context.selectedText)) {
            const limitedText = limitContext(text);
            return `Continue writing from the following text, maintaining the exact same style, tone, and flow:

TEXT TO CONTINUE:
"""
${limitedText}
"""

Your continuation should begin immediately where the text ends, without any introduction or meta-commentary. Write as if you are the same author continuing their work.`;
          }
          // If the selected text is somewhere in the middle of the document
          else {
            const textPosition =
              text.indexOf(context.selectedText) + context.selectedText.length;

            // Get text before the selection (limited to 750 chars)
            const beforeText = text.substring(
              Math.max(0, textPosition - 750),
              textPosition
            );

            // Check if there's text after the selection
            const hasTextAfter = textPosition < text.length;

            if (hasTextAfter) {
              // Get text after the selection (limited to 750 chars)
              const afterText = text.substring(
                textPosition,
                Math.min(text.length, textPosition + 750)
              );

              return `I need to connect two sections of text with new content that flows naturally.

SECTION BEFORE GAP:
"""
${beforeText}
"""

SECTION AFTER GAP:
"""
${afterText}
"""

Write content that connects these two sections seamlessly. Your writing should:
1. Match the style, tone, and vocabulary level of the surrounding text
2. Create a logical bridge between the ideas in both sections
3. Maintain any established themes, arguments, or narrative elements
4. Use consistent formatting and citation style (if applicable)

The new content should read as if it was always part of the original document, with no indication of being added later.`;
            }

            return `Continue writing from the following text, maintaining the exact same style, tone, and flow:

TEXT TO CONTINUE:
"""
${beforeText}
"""

Your continuation should begin immediately where the text ends, without any introduction or meta-commentary. Write as if you are the same author continuing their work.`;
          }
        }
        // Otherwise continue from the whole text
        const limitedText = limitContext(text);
        return `Continue writing from the following text, maintaining the exact same style, tone, and flow:

TEXT TO CONTINUE:
"""
${limitedText}
"""

Your continuation should begin immediately where the text ends, without any introduction or meta-commentary. Write as if you are the same author continuing their work.`;
      }

      case 'grammar': {
        const limitedText = limitContext(text);
        return `Correct the grammar, spelling, punctuation, and improve the clarity of this text while preserving its original meaning and style:

TEXT TO CORRECT:
"""
${limitedText}
"""

Return the corrected version with a brief "## Summary of Changes" section at the end that highlights the key improvements made. Focus on patterns of errors rather than listing every individual correction.`;
      }

      case 'length': {
        const lengthAdjustment = context?.lengthAdjustment || 50;
        const limitedText = limitContext(text);

        if (lengthAdjustment < 40) {
          return `Make this text more concise while preserving all key points and maintaining the author's voice. Aim to reduce length by approximately 40-50%.

TEXT TO SHORTEN:
"""
${limitedText}
"""

Focus on eliminating redundancies, tightening language, and consolidating similar points. The shortened text should maintain the same meaning, tone, and essential information as the original.`;
        } else if (lengthAdjustment > 60) {
          return `Expand this text with relevant details, examples, and elaboration while maintaining the original style and voice. Aim to increase length by approximately 60-70%.

TEXT TO EXPAND:
"""
${limitedText}
"""

Add depth through relevant examples, supporting evidence, additional context, and thoughtful elaboration of key points. Ensure all additions are consistent with the original text's purpose, tone, and style.`;
        } else {
          return `Optimize this text while maintaining similar length. Improve clarity, coherence, and impact without significantly changing the word count.

TEXT TO OPTIMIZE:
"""
${limitedText}
"""

Focus on improving word choice, sentence structure, and overall flow while preserving the original meaning and key points.`;
        }
      }

      case 'improve': {
        const tone = context?.tone || 'professional';
        const limitedText = limitContext(text);
        return `Improve the following text to make it more clear, coherent, and impactful. Adjust the tone to be ${tone} while maintaining the author's voice and key points:

TEXT TO IMPROVE:
"""
${limitedText}
"""

Focus on enhancing:
1. Clarity and precision of language
2. Sentence structure and paragraph flow
3. Word choice and expression
4. Logical organization and transitions
5. Overall impact and engagement

The improved version should preserve the original meaning while significantly enhancing the quality of writing.`;
      }

      case 'custom': {
        const limitedText = limitContext(text);
        const customPrompt =
          context?.customPrompt || 'Improve the following text';
        return `${customPrompt}:

TEXT TO MODIFY:
"""
${limitedText}
"""

Follow the above instructions precisely while maintaining professional quality and coherence in the output.`;
      }

      default: {
        const limitedText = limitContext(text);
        return `Process the following text according to best practices for professional writing:

"""
${limitedText}
"""

Return the improved version in markdown format.`;
      }
    }
  }

  private getTemperatureForOperation(operation: TextOperation): number {
    switch (operation) {
      case 'grammar':
        return 0.2; // Lower temperature for more deterministic corrections
      case 'continue':
        return 0.8; // Higher creativity for continuations with GPT-4o-mini
      case 'improve':
        return 0.7; // Moderate to high creativity for improvements
      case 'length':
        return 0.6; // Moderate temperature for length adjustments
      case 'custom':
        return 0.7; // Moderate creativity for custom operations
      default:
        return 0.6; // Default temperature
    }
  }
}
