export type Language = 'hi' | 'en';

export interface TranslationStrings {
  brandName: string;
  tagline: string;
  navHome: string;
  navCheckCrop: string;
  navWeather: string;
  navAdvice: string;
  navHistory: string;
  navMore: string;

  greeting: string;
  homeHeroQuestion: string;
  heroCheckCropBtn: string;
  heroWeatherBtn: string;
  heroAdviceBtn: string;

  howToStartHeading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  recentChecksHeading: string;
  noRecentChecks: string;
  viewDetails: string;
  viewAdvice: string;

  locationTitle: string;
  locationNotSet: string;
  locationUseGps: string;
  locationPickMap: string;
  locationManualInput: string;
  locationDoLater: string;
  locationDeniedMsg: string;
  locationPlaceholder: string;
  saveLocation: string;
  changeLocation: string;

  cropSelectTitle: string;
  cropSelectHint: string;
  cropWheat: string;
  cropPaddy: string;
  cropMaize: string;
  cropSugarcane: string;
  cropPulses: string;
  cropVegetables: string;
  cropCotton: string;
  cropOther: string;

  photoUploadTitle: string;
  btnCamera: string;
  btnChoosePhoto: string;
  photoGuidanceHeading: string;
  photoGuidance1: string;
  photoGuidance2: string;
  photoGuidance3: string;
  photoGuidance4: string;
  maxPhotosNotice: string;
  removePhoto: string;

  problemDescriptionTitle: string;
  problemDescriptionPlaceholder: string;

  soilSectionTitle: string;
  soilSectionSubtitle: string;
  soilPh: string;
  soilNitrogen: string;
  soilPhosphorus: string;
  soilPotassium: string;
  soilOrganicCarbon: string;
  soilDontKnow: string;

  btnStartAnalysis: string;
  analyzingInProgress: string;

  resultTitle: string;
  cropLabel: string;
  statusLabel: string;
  aiSawHeading: string;
  possibleCausesHeading: string;
  whatToDoNowHeading: string;
  weatherImpactHeading: string;
  soilImpactHeading: string;
  whatToWatchHeading: string;
  regenerativeAdviceHeading: string;
  confidenceLabel: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  confidenceNote: string;
  safetyDisclaimer: string;
  infoNotAvailable: string;
  btnReplacePhoto: string;

  btnSaveAdvice: string;
  btnCheckAgain: string;
  adviceSavedSuccess: string;

  askMoreHeading: string;
  askMorePlaceholder: string;
  btnAsk: string;
  askQuick1: string;
  askQuick2: string;
  askingQuestion: string;

  weatherHeading: string;
  tempLabel: string;
  rainProbLabel: string;
  humidityLabel: string;
  windLabel: string;
  rainfallLabel: string;
  forecastTitle: string;
  weatherImpactCropHeading: string;
  weatherNotAvailable: string;
  weatherApiMissing: string;

  advicePageTitle: string;
  todaysAdvice: string;
  whyThisGiven: string;
  actionSteps: string;
  markCompleted: string;
  completed: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityNormal: string;
  noAdviceYet: string;
  regenerativeTabTitle: string;

  historyPageTitle: string;
  historySubtitle: string;
  clearHistory: string;
  noHistoryYet: string;
  deleteItem: string;

  errorInvalidPhoto: string;
  errorPhotoTooLarge: string;
  errorAiUnavailable: string;
  errorRetryBtn: string;
  errorGeminiMissing: string;
  errorNetwork: string;
}

export const translations: Record<Language, TranslationStrings> = {
  hi: {
    brandName: 'कृषिरक्षक AI',
    tagline: 'अपने खेत की बेहतर समझ, सही समय पर सही सलाह।',
    navHome: 'होम',
    navCheckCrop: 'फसल की जांच',
    navWeather: 'मौसम',
    navAdvice: 'कृषि सलाह',
    navHistory: 'इतिहास',
    navMore: 'अन्य',

    greeting: 'नमस्ते किसान भाई 👋',
    homeHeroQuestion: 'आज अपने खेत के लिए क्या जानना चाहते हैं?',
    heroCheckCropBtn: '📷 फसल की जांच करें',
    heroWeatherBtn: '🌦️ आज का मौसम देखें',
    heroAdviceBtn: '💡 कृषि सलाह',

    howToStartHeading: 'आप कैसे शुरू कर सकते हैं?',
    step1Title: 'फसल की फोटो लें',
    step1Desc: 'खेत में पौधे या पत्ते की साफ फोटो खींचें या गैलरी से चुनें।',
    step2Title: 'मौसम देखें',
    step2Desc: 'अपने क्षेत्र की बारिश, तापमान और हवा की स्थिति जानें।',
    step3Title: 'सरल सलाह पाएं',
    step3Desc: 'AI से समझें कि अभी क्या करना चाहिए और कैसे देखभाल करें।',

    recentChecksHeading: 'हाल की फसल जांच',
    noRecentChecks: 'अभी तक कोई जांच नहीं की गई है। अपनी पहली फसल की जांच करें!',
    viewDetails: 'जांच देखें',
    viewAdvice: 'सलाह देखें',

    locationTitle: 'आप किस जगह खेती करते हैं?',
    locationNotSet: 'स्थान नहीं चुना गया',
    locationUseGps: 'मेरी लोकेशन इस्तेमाल करें',
    locationPickMap: 'मानचित्र पर जगह चुनें',
    locationManualInput: 'स्थान या जिले का नाम लिखें',
    locationDoLater: 'बाद में करें',
    locationDeniedMsg: 'लोकेशन की अनुमति नहीं मिली। आप इसे मानचित्र पर चुन सकते हैं या बाद में जोड़ सकते हैं।',
    locationPlaceholder: 'जैसे: करनाल, हरियाणा या इंदौर, मध्य प्रदेश',
    saveLocation: 'स्थान सुरक्षित करें',
    changeLocation: 'स्थान बदलें',

    cropSelectTitle: 'अपनी फसल चुनें',
    cropSelectHint: 'जिस फसल की जांच करनी है उस पर टैप करें',
    cropWheat: 'गेहूं',
    cropPaddy: 'धान',
    cropMaize: 'मक्का',
    cropSugarcane: 'गन्ना',
    cropPulses: 'दलहन',
    cropVegetables: 'सब्जी',
    cropCotton: 'कपास',
    cropOther: 'अन्य',

    photoUploadTitle: 'फसल की फोटो लें या चुनें',
    btnCamera: 'कैमरा से फोटो लें',
    btnChoosePhoto: 'गैलरी से फोटो चुनें',
    photoGuidanceHeading: 'बेहतर जांच के लिए:',
    photoGuidance1: 'फसल का हिस्सा साफ दिखाई दे',
    photoGuidance2: 'पर्याप्त रोशनी में फोटो लें',
    photoGuidance3: 'बहुत दूर से फोटो न लें',
    photoGuidance4: 'प्रभावित पत्ते या हिस्से पर ध्यान केंद्रित करें',
    maxPhotosNotice: 'आप 1 से 3 फोटो जोड़ सकते हैं (1 फोटो भी काफी है)',
    removePhoto: 'हटाएं',

    problemDescriptionTitle: 'आपको क्या समस्या दिखाई दे रही है? (वैकल्पिक)',
    problemDescriptionPlaceholder: 'जैसे: पत्ते पीले हो रहे हैं, धब्बे दिख रहे हैं या कीड़े लगे हैं...',

    soilSectionTitle: 'मिट्टी और खेत की जानकारी (वैकल्पिक)',
    soilSectionSubtitle: 'यदि आपके पास मृदा स्वास्थ्य कार्ड है तो दर्ज करें। नहीं पता तो छोड़ दें।',
    soilPh: 'मिट्टी का pH',
    soilNitrogen: 'नाइट्रोजन (N)',
    soilPhosphorus: 'फॉस्फोरस (P)',
    soilPotassium: 'पोटैशियम (K)',
    soilOrganicCarbon: 'ऑर्गेनिक कार्बन (%)',
    soilDontKnow: 'मुझे नहीं पता (आगे बढ़ें)',

    btnStartAnalysis: 'जांच शुरू करें',
    analyzingInProgress: 'AI आपकी फसल और मौसम की जांच कर रहा है...',

    resultTitle: 'आपकी फसल की जांच',
    cropLabel: 'फसल',
    statusLabel: 'स्थिति',
    aiSawHeading: 'AI ने क्या देखा?',
    possibleCausesHeading: 'संभावित समस्या',
    whatToDoNowHeading: 'अभी क्या करें?',
    weatherImpactHeading: 'मौसम का असर',
    soilImpactHeading: 'मिट्टी का असर',
    whatToWatchHeading: 'आगे क्या देखें?',
    regenerativeAdviceHeading: 'मिट्टी व प्राकृतिक देखभाल',
    confidenceLabel: 'AI आकलन स्तर',
    confidenceHigh: 'उच्च (High)',
    confidenceMedium: 'मध्यम (Medium)',
    confidenceLow: 'प्रारंभिक (Low)',
    confidenceNote: 'फोटो में सीमित जानकारी होने के कारण यह केवल प्रारंभिक AI आकलन है। पक्की पहचान के लिए स्थानीय कृषि अधिकारी से पुष्टि करें।',
    safetyDisclaimer: 'महत्वपूर्ण: यह AI सलाह प्राथमिक जानकारी के लिए है। किसी भी रासायनिक छिड़काव से पहले कृषि केंद्र या विशेषज्ञ की सलाह लें।',
    infoNotAvailable: 'यह जानकारी अभी उपलब्ध नहीं है।',
    btnReplacePhoto: 'फोटो बदलें',

    btnSaveAdvice: 'सलाह सेव करें',
    btnCheckAgain: 'दोबारा जांचें',
    adviceSavedSuccess: 'सलाह सफलतापूर्वक सेव हो गई!',

    askMoreHeading: 'कुछ और पूछना है?',
    askMorePlaceholder: 'अपना सवाल यहां लिखें...',
    btnAsk: 'पूछें',
    askQuick1: 'क्या यह समस्या बढ़ सकती है?',
    askQuick2: 'मुझे अभी क्या देखना चाहिए?',
    askingQuestion: 'उत्तर तैयार हो रहा है...',

    weatherHeading: 'आज का मौसम',
    tempLabel: 'तापमान',
    rainProbLabel: 'बारिश की संभावना',
    humidityLabel: 'नमी',
    windLabel: 'हवा की गति',
    rainfallLabel: 'अनुमानित वर्षा',
    forecastTitle: 'आगामी दिनों का मौसम',
    weatherImpactCropHeading: 'आपकी फसल पर संभावित असर',
    weatherNotAvailable: 'मौसम की लाइव जानकारी अभी उपलब्ध नहीं है।',
    weatherApiMissing: 'Weather API configured नहीं है।',

    advicePageTitle: 'मेरी कृषि सलाह',
    todaysAdvice: 'आज की महत्वपूर्ण सलाह',
    whyThisGiven: 'यह जानकारी क्यों दी गई?',
    actionSteps: 'कार्य योजना (अभी क्या करें)',
    markCompleted: 'पूरा हुआ',
    completed: 'पूरा हो गया ✓',
    priorityHigh: 'जरूरी',
    priorityMedium: 'सामान्य',
    priorityNormal: 'नियमित',
    noAdviceYet: 'अभी कोई सेव की गई सलाह नहीं है। फसल की जांच करके सलाह सेव करें।',
    regenerativeTabTitle: 'मिट्टी और प्राकृतिक खेती के उपाय',

    historyPageTitle: 'पिछली जांच का इतिहास',
    historySubtitle: 'आपके फोन पर सुरक्षित पिछली फसल जांचें (लॉगिन की जरूरत नहीं)',
    clearHistory: 'इतिहास साफ करें',
    noHistoryYet: 'अभी तक कोई जांच रिकॉर्ड नहीं है।',
    deleteItem: 'हटाएं',

    errorInvalidPhoto: 'कृपया फसल की साफ फोटो चुनें।',
    errorPhotoTooLarge: 'फोटो थोड़ी बड़ी है। कृपया दूसरी फोटो चुनें।',
    errorAiUnavailable: 'AI सलाह अभी उपलब्ध नहीं है। कृपया दोबारा कोशिश करें।',
    errorRetryBtn: 'दोबारा कोशिश करें',
    errorGeminiMissing: 'Gemini API configured नहीं है।',
    errorNetwork: 'इंटरनेट कनेक्शन जांचें और दोबारा कोशिश करें।',
  },
  en: {
    brandName: 'KrishiRakshak AI',
    tagline: 'Better understanding of your field, timely and accurate advice.',
    navHome: 'Home',
    navCheckCrop: 'Check Crop',
    navWeather: 'Weather',
    navAdvice: 'My Advice',
    navHistory: 'History',
    navMore: 'More',

    greeting: 'Namaste Farmer Friend 👋',
    homeHeroQuestion: 'What would you like to know about your field today?',
    heroCheckCropBtn: '📷 Check Crop Now',
    heroWeatherBtn: '🌦️ View Today’s Weather',
    heroAdviceBtn: '💡 Farming Advice',

    howToStartHeading: 'How can you get started?',
    step1Title: 'Take Crop Photo',
    step1Desc: 'Take a clear picture of the plant or leaf in your field, or pick from gallery.',
    step2Title: 'Check Weather',
    step2Desc: 'Know current rain chances, temperature, and wind conditions in your area.',
    step3Title: 'Get Simple Advice',
    step3Desc: 'Receive clear, actionable steps on what to do right now.',

    recentChecksHeading: 'Recent Crop Checks',
    noRecentChecks: 'No checks performed yet. Start your first crop diagnosis!',
    viewDetails: 'View Details',
    viewAdvice: 'View Advice',

    locationTitle: 'Where is your farm located?',
    locationNotSet: 'Location not set',
    locationUseGps: 'Use My Location',
    locationPickMap: 'Choose on Map',
    locationManualInput: 'Enter City or District Name',
    locationDoLater: 'Do It Later',
    locationDeniedMsg: 'Location permission was not granted. You can select it on the map or add it later.',
    locationPlaceholder: 'e.g., Karnal, Haryana or Indore, Madhya Pradesh',
    saveLocation: 'Save Location',
    changeLocation: 'Change Location',

    cropSelectTitle: 'Select Your Crop',
    cropSelectHint: 'Tap on the crop you wish to inspect',
    cropWheat: 'Wheat',
    cropPaddy: 'Paddy / Rice',
    cropMaize: 'Maize',
    cropSugarcane: 'Sugarcane',
    cropPulses: 'Pulses',
    cropVegetables: 'Vegetables',
    cropCotton: 'Cotton',
    cropOther: 'Other Crop',

    photoUploadTitle: 'Take or Upload Crop Photo',
    btnCamera: 'Take Photo with Camera',
    btnChoosePhoto: 'Select from Gallery',
    photoGuidanceHeading: 'Tips for accurate diagnosis:',
    photoGuidance1: 'Ensure the crop part is clearly visible',
    photoGuidance2: 'Capture under sufficient lighting',
    photoGuidance3: 'Do not take the photo from too far away',
    photoGuidance4: 'Focus on affected leaves or symptomatic area',
    maxPhotosNotice: 'You can upload up to 3 photos (1 photo is plenty)',
    removePhoto: 'Remove',

    problemDescriptionTitle: 'What problem are you noticing? (Optional)',
    problemDescriptionPlaceholder: 'e.g., leaves turning yellow, spots appearing, or insect signs...',

    soilSectionTitle: 'Soil & Field Details (Optional)',
    soilSectionSubtitle: 'Enter details from your Soil Health Card if available. Otherwise skip.',
    soilPh: 'Soil pH',
    soilNitrogen: 'Nitrogen (N)',
    soilPhosphorus: 'Phosphorus (P)',
    soilPotassium: 'Potassium (K)',
    soilOrganicCarbon: 'Organic Carbon (%)',
    soilDontKnow: 'I don’t know (Proceed)',

    btnStartAnalysis: 'Start Crop Check',
    analyzingInProgress: 'AI is analyzing your crop and local weather...',

    resultTitle: 'Crop Diagnosis Result',
    cropLabel: 'Crop',
    statusLabel: 'Condition',
    aiSawHeading: 'What AI Observed',
    possibleCausesHeading: 'Possible Issues',
    whatToDoNowHeading: 'What to do right now?',
    weatherImpactHeading: 'Weather Impact',
    soilImpactHeading: 'Soil Impact',
    whatToWatchHeading: 'What to watch for next',
    regenerativeAdviceHeading: 'Soil & Natural Field Care',
    confidenceLabel: 'AI Confidence',
    confidenceHigh: 'High',
    confidenceMedium: 'Medium',
    confidenceLow: 'Preliminary',
    confidenceNote: 'Due to limited visual context in photos, this is a preliminary AI assessment. Always verify with local agricultural extension officers.',
    safetyDisclaimer: 'Important: This AI advisory is for primary guidance. Consult a qualified agricultural expert before using chemical sprays.',
    infoNotAvailable: 'This information is currently unavailable.',
    btnReplacePhoto: 'Replace Photo',

    btnSaveAdvice: 'Save Advice',
    btnCheckAgain: 'Check Again',
    adviceSavedSuccess: 'Advice saved successfully to your device!',

    askMoreHeading: 'Have more questions?',
    askMorePlaceholder: 'Type your question here...',
    btnAsk: 'Ask',
    askQuick1: 'Could this issue spread further?',
    askQuick2: 'What symptoms should I observe next?',
    askingQuestion: 'Preparing answer...',

    weatherHeading: 'Today’s Weather',
    tempLabel: 'Temperature',
    rainProbLabel: 'Rain Probability',
    humidityLabel: 'Humidity',
    windLabel: 'Wind Speed',
    rainfallLabel: 'Expected Rain',
    forecastTitle: 'Upcoming Days Forecast',
    weatherImpactCropHeading: 'Likely Impact on Your Crop',
    weatherNotAvailable: 'Live weather information is currently unavailable.',
    weatherApiMissing: 'Weather API is not configured.',

    advicePageTitle: 'My Farming Advice',
    todaysAdvice: 'Today’s Key Advice',
    whyThisGiven: 'Why was this advice given?',
    actionSteps: 'Action Steps (What to do)',
    markCompleted: 'Mark Done',
    completed: 'Completed ✓',
    priorityHigh: 'Urgent',
    priorityMedium: 'Moderate',
    priorityNormal: 'Routine',
    noAdviceYet: 'No saved advice yet. Inspect your crop to save actionable advice.',
    regenerativeTabTitle: 'Soil & Regenerative Farming Practices',

    historyPageTitle: 'Crop Check History',
    historySubtitle: 'Past crop inspections saved on your device (No login required)',
    clearHistory: 'Clear History',
    noHistoryYet: 'No past scan records found.',
    deleteItem: 'Delete',

    errorInvalidPhoto: 'Please select a clear crop photo.',
    errorPhotoTooLarge: 'Photo size is too large. Please select a smaller photo.',
    errorAiUnavailable: 'AI advice is temporarily unavailable. Please try again.',
    errorRetryBtn: 'Try Again',
    errorGeminiMissing: 'Gemini API is not configured.',
    errorNetwork: 'Check your internet connection and try again.',
  },
};
