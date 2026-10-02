import { FormValues } from './assist-form';

type MockResponse = {
  text: string;
  feature: FormValues['aiFeature'];
  context?: {
    lengthAdjustment?: number;
    writingTone?: string;
    customInstructions?: string;
  };
};

const MARKDOWN_EXAMPLES = {
  headings: `# Main Heading
## Secondary Heading
### Tertiary Heading`,

  emphasis: `**Bold text** and *italic text* and ***bold italic***
~~Strikethrough~~ and ==highlighted text==`,

  lists: `1. First ordered item
2. Second ordered item
   - Nested unordered item
   - Another nested item
3. Third ordered item

- Unordered list
  * Nested with asterisk
  + Nested with plus`,

  codeBlocks: `\`Inline code\` in a sentence

\`\`\`typescript
// Code block with syntax highlighting
function example() {
  const x = "Hello World";
  return x.toLowerCase();
}
\`\`\``,

  blockquotes: `> This is a blockquote
> With multiple lines
>> And nested quotes`,

  tables: `| Header 1 | Header 2 | Header 3 |
|----------|-----------|-----------|
| Row 1    | Data      | More Data |
| Row 2    | **Bold**  | *Italic*  |`,

  links: `[External Link](https://example.com)
![Image Alt Text](https://example.com/image.jpg)`,

  taskLists: `- [x] Completed task
- [ ] Incomplete task
  - [x] Nested completed task`,

  definitions: `Term 1
: Definition of term 1

Term 2
: Definition of term 2`,
};

export function generateMockResponse({
  feature,
  selectedText,
  context,
}: {
  feature: FormValues['aiFeature'];
  selectedText?: string;
  context?: MockResponse['context'];
}): string {
  const text = selectedText || 'The quick brown fox jumps over the lazy dog.';

  switch (feature) {
    case 'continue':
      return `${text}\n\n# The Tale Continues\n\n**Chapter 1: The Forest's Secret**\n\nSuddenly, a wise owl perched nearby, observing the scene with keen interest. The fox, now aware of being watched, slowed its pace and approached the owl with curiosity.\n\n> "Why do you watch so intently?" the fox inquired.\n\nThe owl's response was both cryptic and intriguing:\n\n\`\`\`markdown
1. "I watch because you run"
2. "I watch because you leap"
3. "I watch because you *exist*"
\`\`\`\n\n### The Conversation\n\nTheir dialogue continued, marked by:\n- Philosophical questions
- Natural observations
- Shared wisdom\n\n![Forest Scene](https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg)\n\n---\n\n*To be continued...*`;

    case 'grammar':
      return `## Grammar Analysis\n\n**Original Text:**\n${text}\n\n**Corrected Version:**\n${text.replace('jumps', 'jumped')} ✨\n\n### Changes Made:\n1. Updated verb tense for consistency
2. Improved punctuation\n\n> **Note:** The correction maintains the original meaning while enhancing clarity.\n\n\`\`\`diff
- ${text}
+ ${text.replace('jumps', 'jumped')}
\`\`\`\n\n| Element | Before | After |
|----------|---------|-------|
| Verb Tense | Present | Past |
| Flow | ⭐⭐⭐ | ⭐⭐⭐⭐ |`;

    case 'length': {
      const lengthAdjustment = context?.lengthAdjustment || 50;
      if (lengthAdjustment < 40) {
        return `# Concise Version\n\n**Original Length:** ${text.length} characters\n**New Length:** 19 characters\n\n---\n\n### Summary\nA fox jumped over a dog.\n\n> Maintaining core meaning with maximum brevity.\n\n- [x] Reduced length
- [x] Preserved meaning
- [x] Enhanced clarity`;
      } else if (lengthAdjustment > 60) {
        return `# Extended Narrative\n\n## Setting the Scene\n\nIn the midst of a sun-dappled forest clearing, where golden rays filtered through ancient oak leaves, a remarkable scene unfolded. A quick-witted brown fox, its russet fur gleaming with health and vitality, demonstrated its natural athleticism.\n\n### The Action\n\nWith graceful precision, the fox:\n1. Gauged the distance
2. Tensed its powerful muscles
3. Executed a perfect leap\n\n> "In that moment, time seemed to slow, as nature's agility was displayed in its purest form."\n\n#### Technical Analysis\n\n\`\`\`markdown
* Initial Position: Calculated
* Trajectory: Optimal
* Landing: Flawless
\`\`\`\n\n| Aspect | Rating | Notes |
|---------|---------|-------|
| Grace | ⭐⭐⭐⭐⭐ | Perfect form |
| Speed | ⭐⭐⭐⭐ | Well-paced |
| Style | ⭐⭐⭐⭐⭐ | Exceptional |`;
      }
      return text;
    }

    case 'improve': {
      const tone = context?.writingTone?.toLowerCase() || 'professional';
      const toneMap = {
        professional: `# Professional Analysis\n\n## Executive Summary\n\nIn a demonstration of optimal resource utilization and efficiency metrics, the specimen (classified as *Vulpes vulpes*) executed a precision-calculated traversal over a stationary canine obstacle.\n\n### Key Performance Indicators\n\n1. Velocity Optimization
2. Trajectory Calculation
3. Energy Efficiency\n\n\`\`\`typescript
interface PerformanceMetrics {
  velocity: number;  // m/s
  height: number;    // meters
  efficiency: number; // percentage
}
\`\`\`\n\n> **Critical Analysis:** The observed behavior demonstrates exemplary resource allocation and task completion parameters.`,

        casual: `# Hey, Check This Out! 🦊\n\n**OMG**, you won't believe what I just saw! This super quick brown fox just did the most amazing thing!\n\n## The Play-by-Play\n\n- First, this fox was like *zooming* around 🏃‍♂️
- Then, it went all ~~walking~~ **JUMPING** mode
- And this totally chill dog was just vibing below\n\n> LOL, it was epic! 😎\n\n### Fun Fact Time!\n\nDid you know? Foxes can jump up to **2 meters** high! That's like, a lot of smartphones stacked on top of each other! 📱\n\n---\n\n*BTW, no dogs were disturbed in this totally awesome scene* 🐕`,

        academic: `# Observational Analysis of Canid Locomotion Patterns\n\n## Abstract\n\nThis study examines the locomotive capabilities of *Vulpes vulpes* specimens in relation to obstacle traversal, specifically analyzing the biomechanical implications of leaping trajectories over stationary *Canis lupus familiaris* subjects.\n\n### Methodology\n\n1. Observational Parameters
   - Temporal Factors
   - Spatial Dynamics
   - Environmental Variables\n\n## Results\n\n\`\`\`r
data <- analyze_trajectory(
  initial_velocity = 8.2,  // m/s
  angle = 45,             // degrees
  height = 1.2            // meters
)
\`\`\`\n\n| Variable | Measurement | Significance |\n|-----------|--------------|---------------|\n| Velocity | 8.2 m/s | p < 0.001 |\n| Angle | 45° | p < 0.005 |\n\n> The findings suggest statistically significant optimization of energy expenditure during obstacle traversal.\n\n## References\n\n1. Smith et al. (2024). *Journal of Canid Behavior*
2. Johnson & Williams (2023). *Biomechanics Quarterly*`,

        creative: `# 🌟 The Dance of the Trickster 🌟\n\n*In the golden theater of autumn's embrace,*\n*Where shadows dance and sunbeams chase,*\n*A russet spirit with grace divine,*\n*Performs its ballet, one leap at a time.*\n\n## The Stage\n\n> Leaves whisper secrets of ancient lore,\n> As our protagonist prepares for something more.\n\n### The Performance\n\n1. **Act I:** The Preparation
   - *Muscles coiled like springs of gold*
   - *Stories untold, about to unfold*\n\n2. **Act II:** The Flight
   \`\`\`verse
   Through air so sweet,
   With dancing feet,
   A flash of red,
   Stories unsaid
   \`\`\`\n\n3. **Act III:** The Landing\n\n| Movement | Emotion | Magic |\n|----------|----------|--------|\n| Leap | Joy | ✨ |\n| Soar | Freedom | 🌟 |\n| Land | Grace | 💫 |`,

        persuasive: `# Witness the Extraordinary! 🌟\n\n## Why This Moment Matters\n\nLet me share with you an **absolutely remarkable** demonstration of nature's perfection. You won't believe what you're about to read!\n\n### The Undeniable Facts\n\n1. **Unprecedented Skill**
   - *Lightning-fast* reflexes
   - **Perfect** execution
   - *Flawless* landing\n\n> "In all my years of observation, I've never seen anything quite like this!" - Wildlife Expert\n\n## The Evidence\n\n\`\`\`markdown
✓ Speed: Faster than average
✓ Grace: Unmatched
✓ Style: Revolutionary
\`\`\`\n\n### Why You Should Be Impressed\n\n| Aspect | Rating | Why It Matters |\n|--------|---------|----------------|\n| Skill | ⭐⭐⭐⭐⭐ | Sets new standards |\n| Impact | ⭐⭐⭐⭐⭐ | Changes everything |\n\n---\n\n**Act Now!** Don't miss the chance to appreciate this incredible feat of natural athleticism!`,
      };
      return toneMap[tone as keyof typeof toneMap];
    }

    case 'custom': {
      const instructions =
        context?.customInstructions || 'make it more interesting';
      return `# Custom Enhancement\n\n## Original Prompt\n> "${instructions}"\n\n### Enhanced Version\n\nIn a surprising twist of events, the quick brown fox, wearing a tiny top hat and monocle, performed an elegant pirouette before jumping over the lazy dog, who was busy solving a crossword puzzle.\n\n## Scene Details\n\n1. **The Fox's Attire**
   - *Tiny top hat* (tilted at a jaunty angle)
   - *Monocle* (pure crystal)\n\n2. **The Dance**
   \`\`\`markdown
   * First Position
   * Graceful Spin
   * Perfect Landing
   \`\`\`\n\n3. **The Dog's Activity**
   > 7-Down: "A quick-witted canid" (3 letters)\n\n| Character | Activity | Style Points |\n|-----------|-----------|---------------|\n| Fox | Dancing | ⭐⭐⭐⭐⭐ |\n| Dog | Puzzling | ⭐⭐⭐⭐ |\n\n---\n\n*Sometimes the most interesting stories are the ones we least expect!* 🎩🦊`;
    }

    default:
      return text;
  }
}
