import { GoogleGenAI } from '@google/genai';
import { AnalysisInput, buildCropAnalysisPrompt, buildFollowUpPrompt } from './prompts';

export interface CropAnalysisResponse {
  status: string;
  severity: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  confidenceReason: string;
  observations: string[];
  possibleIssues: string[];
  recommendedActions: string[];
  weatherImpact?: string;
  soilImpact?: string | null;
  whatToWatchNext?: string;
  regenerativeTip?: string;
  followUp?: string;
}

export async function analyzeCropWithGemini(
  imagesBase64: { base64: string; mimeType: string }[],
  input: AnalysisInput
): Promise<{ success: boolean; data?: CropAnalysisResponse; error?: string; isConfigured: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      isConfigured: false,
      error: 'Gemini API configured नहीं है। कृपया .env.local में GEMINI_API_KEY दर्ज करें।',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildCropAnalysisPrompt(input);

    // Prepare content parts
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
    ];

    for (const img of imagesBase64) {
      if (img.base64) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: img.base64,
          },
        });
      }
    }

    // Model candidate cascade for compatibility
    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    let responseText = '';
    let lastError = '';

    for (const modelName of modelsToTry) {
      try {
        // Run with a 20-second timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 20000)
        );

        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: parts as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            },
          ],
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]); // eslint-disable-line @typescript-eslint/no-explicit-any

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        lastError = e.message || String(e);
        console.warn(`Gemini model ${modelName} attempt failed:`, lastError);
      }
    }

    if (!responseText) {
      if (lastError.includes('PERMISSION_DENIED')) {
        return {
          success: false,
          isConfigured: true,
          error: 'Gemini API Key में अनुमति (Permission Denied) त्रुटि है। कृपया Google AI Studio में API Key की अनुमतियां जांचें।',
        };
      }
      if (lastError === 'TIMEOUT') {
        return {
          success: false,
          isConfigured: true,
          error: 'नेटवर्क विलंब के कारण अनुरोध समय समाप्त (Timeout) हो गया। कृपया दोबारा कोशिश करें।',
        };
      }
      return {
        success: false,
        isConfigured: true,
        error: 'AI सलाह अभी उपलब्ध नहीं है। कृपया कुछ देर बाद दोबारा कोशिश करें।',
      };
    }

    const text = responseText;

    // Strip any markdown fences if present
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsed: CropAnalysisResponse = JSON.parse(cleaned);

      // Validate required fields and ensure no null/undefined in UI
      if (!parsed.observations || !Array.isArray(parsed.observations) || parsed.observations.length === 0) {
        parsed.observations = ['फोटो के आधार पर स्थिति का विश्लेषण किया गया।'];
      }
      if (!parsed.possibleIssues || !Array.isArray(parsed.possibleIssues) || parsed.possibleIssues.length === 0) {
        parsed.possibleIssues = ['संभावित लक्षणों की प्राथमिक जांच की जा रही है।'];
      }
      if (!parsed.recommendedActions || !Array.isArray(parsed.recommendedActions) || parsed.recommendedActions.length === 0) {
        parsed.recommendedActions = [
          '1. प्रभावित पौधों की स्थिति पर नजर रखें।',
          '2. नजदीकी कृषि केंद्र या कृषि विशेषज्ञ से संपर्क करें।',
        ];
      }
      if (!parsed.severity) parsed.severity = 'medium';
      if (!parsed.confidence) parsed.confidence = 'medium';
      if (!parsed.status) parsed.status = 'ध्यान देने की जरूरत';

      // Check soil impact: only show if user actually provided soil data
      const userGaveSoil = Boolean(
        input.soilInfo &&
          (input.soilInfo.ph ||
            input.soilInfo.nitrogen ||
            input.soilInfo.phosphorus ||
            input.soilInfo.potassium ||
            input.soilInfo.organicCarbon)
      );

      if (!userGaveSoil || !parsed.soilImpact || parsed.soilImpact === 'null') {
        parsed.soilImpact = null;
      }

      // Ensure whatToWatchNext is present
      if (!parsed.whatToWatchNext && parsed.followUp) {
        parsed.whatToWatchNext = parsed.followUp;
      }
      if (!parsed.whatToWatchNext) {
        parsed.whatToWatchNext =
          input.language === 'en'
            ? 'Monitor changes in leaf coloring and new growth over the next 3 to 5 days.'
            : 'अगले 3 से 5 दिनों में प्रभावित हिस्से के रंग और फैलाव पर नजर रखें।';
      }

      return {
        success: true,
        data: parsed,
        isConfigured: true,
      };
    } catch {
      console.error('Failed to parse Gemini output as JSON:', text);
      return {
        success: false,
        error: 'फोटो के आधार पर समस्या की पक्की पहचान नहीं हो सकी। कृपया एक और स्पष्ट फोटो लेकर पुनः प्रयास करें।',
        isConfigured: true,
      };
    }
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Gemini API request error:', err);
    return {
      success: false,
      error: 'AI सलाह अभी उपलब्ध नहीं है। कृपया कुछ देर बाद दोबारा कोशिश करें।',
      isConfigured: true,
    };
  }
}

export async function askGeminiFollowUp(
  previousContext: string,
  userQuestion: string,
  language = 'hi'
): Promise<{ success: boolean; answer?: string; error?: string; isConfigured: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      isConfigured: false,
      error: 'Gemini API configured नहीं है।',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildFollowUpPrompt(previousContext, userQuestion, language);

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    let answer = '';
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        if (response && response.text) {
          answer = response.text.trim();
          break;
        }
      } catch (e) {
        // try next
      }
    }

    if (!answer) {
      return {
        success: false,
        error: 'AI उत्तर अभी उपलब्ध नहीं है।',
        isConfigured: true,
      };
    }

    return {
      success: true,
      answer,
      isConfigured: true,
    };
  } catch (err) {
    console.error('Gemini follow up error:', err);
    return {
      success: false,
      error: 'AI उत्तर अभी उपलब्ध नहीं है।',
      isConfigured: true,
    };
  }
}
