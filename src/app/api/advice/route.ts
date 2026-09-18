import { NextRequest, NextResponse } from 'next/server';
import { askGeminiFollowUp } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context, language } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'कृपया अपना प्रश्न दर्ज करें।' },
        { status: 400 }
      );
    }

    const result = await askGeminiFollowUp(context || '', question, language || 'hi');

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          isConfigured: result.isConfigured,
        },
        { status: result.isConfigured ? 500 : 503 }
      );
    }

    return NextResponse.json({
      success: true,
      answer: result.answer,
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Advice route error:', err);
    return NextResponse.json(
      { success: false, error: 'प्रश्न का उत्तर देने में असमर्थ।' },
      { status: 500 }
    );
  }
}
