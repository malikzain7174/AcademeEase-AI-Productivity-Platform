import { NextRequest, NextResponse } from 'next/server';
import openai from '@/config/openai.config';
import { auth } from '@/lib/auth';
import { deductCredits, userCreditsEnough } from '@/actions/global';
import { CREDITS_ON_AI_NOTES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has enough credits
    const hasEnoughCredits = await userCreditsEnough(
      session.user.id,
      CREDITS_ON_AI_NOTES
    );

    if (!hasEnoughCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const {
      model,
      messages,
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
    } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens || 1500,
      temperature: temperature !== undefined ? temperature : 0.7,
      top_p: topP !== undefined ? topP : 0.9,
      presence_penalty: presencePenalty !== undefined ? presencePenalty : 0.1,
      frequency_penalty:
        frequencyPenalty !== undefined ? frequencyPenalty : 0.2,
    });

    // Deduct credits
    const creditResult = await deductCredits(CREDITS_ON_AI_NOTES);

    // Return the response with credit information
    return NextResponse.json({
      ...response,
      creditInfo: {
        deducted: CREDITS_ON_AI_NOTES,
        remaining: creditResult.remainingCredits,
      },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
