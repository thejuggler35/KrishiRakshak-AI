import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropWithGemini } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, crop, description, locationName, weather, soilInfo, language } = body;

    if (!crop) {
      return NextResponse.json(
        { success: false, error: 'कृपया फसल का चयन करें।' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'कृपया फसल की कम से कम एक फोटो जोड़ें।' },
        { status: 400 }
      );
    }

    const result = await analyzeCropWithGemini(images, {
      crop,
      farmerDescription: description,
      locationName,
      weather,
      soilInfo,
      language: language || 'hi',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          isConfigured: result.isConfigured,
        },
        { status: result.isConfigured ? 422 : 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      isConfigured: result.isConfigured,
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Analyze crop route error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'फसल विश्लेषण के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।',
      },
      { status: 500 }
    );
  }
}
