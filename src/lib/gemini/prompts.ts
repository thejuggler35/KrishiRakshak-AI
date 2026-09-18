export interface AnalysisInput {
  crop: string;
  farmerDescription?: string;
  locationName?: string;
  weather?: {
    temperature: number;
    humidity: number;
    rainProbability: number;
    windSpeedKmH: number;
    condition: string;
  };
  soilInfo?: {
    ph?: string;
    nitrogen?: string;
    phosphorus?: string;
    potassium?: string;
    organicCarbon?: string;
  };
  language?: 'hi' | 'en';
}

export function buildCropAnalysisPrompt(input: AnalysisInput): string {
  const isHi = input.language !== 'en';

  const weatherContext = input.weather
    ? `
स्थान का वर्तमान मौसम:
- तापमान: ${input.weather.temperature}°C
- बारिश की संभावना: ${input.weather.rainProbability}%
- हवा में नमी: ${input.weather.humidity}%
- हवा की गति: ${input.weather.windSpeedKmH} km/h
- स्थिति: ${input.weather.condition}`
    : 'मौसम की जानकारी उपलब्ध नहीं है।';

  const soilContext = input.soilInfo
    ? `
किसान द्वारा दी गई मिट्टी की जानकारी:
- pH: ${input.soilInfo.ph || 'अज्ञात'}
- नाइट्रोजन: ${input.soilInfo.nitrogen || 'अज्ञात'}
- फॉस्फोरस: ${input.soilInfo.phosphorus || 'अज्ञात'}
- पोटैशियम: ${input.soilInfo.potassium || 'अज्ञात'}
- ऑर्गेनिक कार्बन: ${input.soilInfo.organicCarbon || 'अज्ञात'}`
    : 'मिट्टी की विशेष जानकारी उपलब्ध नहीं है।';

  const hasSoilData = Boolean(
    input.soilInfo &&
      (input.soilInfo.ph ||
        input.soilInfo.nitrogen ||
        input.soilInfo.phosphorus ||
        input.soilInfo.potassium ||
        input.soilInfo.organicCarbon)
  );

  return `
आप भारतीय छोटे और सीमांत किसानों के विश्वसनीय सहायक 'कृषिरक्षक AI' हैं।
आपको किसान के खेत की फसल की फोटो, चुनी गई फसल, किसान का अनुभव, स्थानीय मौसम और मिट्टी की जानकारी दी जा रही है।

फसल: ${input.crop}
किसान की टिप्पणी: ${input.farmerDescription || 'कोई विशेष टिप्पणी नहीं दी गई'}
खेत का स्थान: ${input.locationName || 'अज्ञात'}
${weatherContext}
${soilContext}

महत्वपूर्ण नियम एवं दिशा-निर्देश:
1. भाषा: ${isHi ? 'सरल, बोलचाल की हिन्दी' : 'Clear, simple English'} का प्रयोग करें। कोई भी कठिन किताबी या वैज्ञानिक शब्द न लिखें।
2. किसान के मुख्य सवालों का स्पष्ट उत्तर दें:
   (क) मेरे खेत में क्या हो रहा है? (AI ने क्या देखा? - Observations)
   (ख) संभावित समस्या क्या हो सकती है? (Possible issues)
   (ग) वास्तविक मौसम का इस फसल पर क्या असर है? (Weather impact)
   (घ) ${hasSoilData ? 'दी गई मिट्टी की जानकारी का फसल पर क्या असर है? (मिट्टी का असर)' : 'किसान ने मिट्टी की जानकारी नहीं दी है, अतः मिट्टी का असर न बनाएं (soilImpact: null रखें)। कभी भी अपनी तरफ से मिट्टी का मान न गढ़ें।'}
   (ङ) अभी मुझे क्या करना चाहिए? (अभी क्या करें? - 3-4 Numbered practical steps)
   (च) आगे क्या देखें? (लक्षणों के फैलाव या नए बदलावों की निगरानी के 1-2 संकेत)
3. सुरक्षा एवं सत्यनिष्ठा नियम:
   - कभी भी "100% पक्की बीमारी है" का दावा न करें। केवल "संभावित लक्षण" या "संभावित समस्या" कहें।
   - यदि फोटो धुंधली है या समस्या स्पष्ट नहीं है तो स्पष्ट लिखें: "फोटो के आधार पर समस्या की पक्की पहचान नहीं हो सकी।"
   - कोई भी खतरनाक या अत्यधिक रासायनिक छिड़काव की खुराक न सुझाएं। सुरक्षित, जैविक, या प्रारंभिक कृषि विधियों पर जोर दें।
4. मौसम का संबंध: दिए गए वास्तविक मौसम के आधार पर बताएं कि इस मौसम में फसल पर क्या प्रभाव पड़ेगा।

आपको केवल और केवल एक वैध JSON ऑब्जेक्ट के रूप में उत्तर देना है। कोई मार्कडाउन बैक-टिक्स या अन्य टेक्स्ट न जोड़ें।
JSON संरचना इस प्रकार होनी चाहिए:
{
  "status": "${isHi ? 'सामान्य / ध्यान देने की जरूरत / तुरंत सावधानी' : 'Normal / Needs Attention / Immediate Caution'}",
  "severity": "low" | "medium" | "high",
  "confidence": "high" | "medium" | "low",
  "confidenceReason": "${isHi ? 'फोटो में सीमित जानकारी होने के कारण यह केवल प्रारंभिक AI आकलन है।' : 'Based on visual patterns in the photo, this is a preliminary assessment.'}",
  "observations": [
    "अवलोकन 1 (2-4 छोटे बिंदु)",
    "अवलोकन 2"
  ],
  "possibleIssues": [
    "संभावित समस्या 1",
    "संभावित समस्या 2"
  ],
  "weatherImpact": "दिए गए वास्तविक मौसम के अनुसार फसल पर असर।",
  "soilImpact": ${hasSoilData ? '"दिए गए मृदा आंकड़ों के अनुसार मिट्टी का प्रभाव।"' : 'null'},
  "recommendedActions": [
    "1. प्रभावित पौधों को ध्यान से देखें।",
    "2. आसपास के स्वस्थ पौधों से तुलना करें।",
    "3. खेत में नमी बनाए रखें।"
  ],
  "whatToWatchNext": "आगे क्या देखें? (आने वाले 3-5 दिनों में जिन लक्षणों पर नजर रखनी है)",
  "regenerativeTip": "मिट्टी के स्वास्थ्य या प्राकृतिक उपाय का 1 सरल सुझाव।"
}
`;
}

export function buildFollowUpPrompt(
  previousContext: string,
  userQuestion: string,
  language = 'hi'
): string {
  const isHi = language !== 'en';
  return `
आप 'कृषिरक्षक AI' हैं। किसान भाई ने पहले की गई फसल जांच के आधार पर यह सवाल पूछा है:

पूर्व जांच संदर्भ:
${previousContext}

किसान का सवाल:
"${userQuestion}"

कृपया किसान भाई को ${isHi ? 'सरल और व्यावहारिक हिन्दी' : 'simple English'} में 2-3 पंक्तियों में सीधा उत्तर दें।
- कोई तकनीकी शब्दावली न प्रयोग करें।
- किसान के सवाल का तुरंत समाधान बताएं।
- व्यावहारिक और सुरक्षित सलाह दें।
`;
}
