import { AI_CONFIG } from './ai-config';
import { MockAIProvider } from '../providers/mock-ai-provider';
import { OpenAIProvider } from '../providers/openai-provider';
import { AIOperationProvider, AIContext, TextOperation } from './ai-interface';

export class AIUtils {
  private provider: AIOperationProvider;

  constructor() {
    this.provider = AI_CONFIG.useMock
      ? new MockAIProvider()
      : new OpenAIProvider();
  }

  public async generateContent(
    text: string,
    context: AIContext & {
      userPreferences?: {
        gradeYear?: string;
        fieldOfStudy?: string | null;
        learningStyle?: string;
        studyEnvironment?: string;
        ageRange?: string;
      };
    }
  ): Promise<string> {
    try {
      // Add user preferences to the context if they exist
      const enhancedContext = {
        ...context,
        userPreferences: context.userPreferences || undefined,
      };

      return await this.provider.generateResponse(text, enhancedContext);
    } catch (error) {
      console.error('AI Generation failed:', error);
      throw error;
    }
  }

  public async modifyText(
    text: string,
    operation: TextOperation
  ): Promise<string> {
    try {
      return await this.provider.processTextModification(text, operation);
    } catch (error) {
      console.error('Text modification failed:', error);
      throw error;
    }
  }

  public formatForMarkdown(markdown: string): {
    html: string;
    images: Array<{ alt: string; src: string }>;
  } {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: { alt: string; src: string }[] = [];
    const textWithoutImages = markdown.replace(imageRegex, (_, alt, src) => {
      images.push({ alt, src });
      return '{{IMAGE_PLACEHOLDER}}';
    });

    const formatted = textWithoutImages
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/==(.*?)==/g, '<mark>$1</mark>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre><code class="language-$1">$2</code></pre>'
      )
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(
        /^>>\s*(.*$)/gm,
        '<blockquote><blockquote>$1</blockquote></blockquote>'
      )
      .replace(/^>\s*(.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(
        /^\s*[-*+]\s+\[([ x])\]\s*(.*$)/gm,
        '<li class="task-list-item" $1-checked>$2</li>'
      )
      .replace(/^\s*[-*+]\s*(.*$)/gm, '<li>$1</li>')
      .replace(/^\s*(\d+)\.\s*(.*$)/gm, '<li>$2</li>')
      .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
      .replace(/\|.*\|/g, (match) => {
        const cells = match.split('|').filter(Boolean);
        return `<tr>${cells.map((cell) => `<td>${cell.trim()}</td>`).join('')}</tr>`;
      })
      .replace(/(<tr>.*<\/tr>)+/g, '<table>$&</table>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^---+$/gm, '<hr />')
      .replace(/^(.*)\n:\s*(.*$)/gm, '<dl><dt>$1</dt><dd>$2</dd></dl>')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return { html: formatted, images };
  }

  public switchProvider(useMock: boolean): void {
    this.provider = useMock ? new MockAIProvider() : new OpenAIProvider();
  }
}
