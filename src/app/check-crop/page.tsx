'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { storage, FarmerLocation, CropScanRecord } from '@/lib/storage/localStorage';
import { compressImage, CompressedImage } from '@/lib/utils/imageCompressor';
import {
  Camera,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CloudSun,
  Sprout,
  HelpCircle,
  Send,
  RotateCcw,
  Bookmark,
  Check,
  MapPin,
  Layers,
} from 'lucide-react';

const CROP_OPTIONS = [
  { id: 'गेहूं', labelHi: 'गेहूं', labelEn: 'Wheat', icon: '🌾' },
  { id: 'धान', labelHi: 'धान', labelEn: 'Paddy / Rice', icon: '🌱' },
  { id: 'मक्का', labelHi: 'मक्का', labelEn: 'Maize', icon: '🌽' },
  { id: 'गन्ना', labelHi: 'गन्ना', labelEn: 'Sugarcane', icon: '🎋' },
  { id: 'दलहन', labelHi: 'दलहन', labelEn: 'Pulses', icon: '🫘' },
  { id: 'सब्जी', labelHi: 'सब्जी', labelEn: 'Vegetables', icon: '🥬' },
  { id: 'कपास', labelHi: 'कपास', labelEn: 'Cotton', icon: '☁️' },
  { id: 'अन्य', labelHi: 'अन्य', labelEn: 'Other', icon: '🌿' },
];

export default function CheckCropPage() {
  const { t, language } = useLanguage();

  // Inputs
  const [selectedCrop, setSelectedCrop] = useState('गेहूं');
  const [photos, setPhotos] = useState<CompressedImage[]>([]);
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState<FarmerLocation | null>(null);

  // Soil details (optional)
  const [showSoilSection, setShowSoilSection] = useState(false);
  const [soilPh, setSoilPh] = useState('');
  const [soilNitrogen, setSoilNitrogen] = useState('');
  const [soilPhosphorus, setSoilPhosphorus] = useState('');
  const [soilPotassium, setSoilPotassium] = useState('');
  const [soilCarbon, setSoilCarbon] = useState('');

  // States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Result state
  const [result, setResult] = useState<any | null>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Follow-up Q&A
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<Array<{ q: string; a: string }>>([]);
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCrop = storage.getSelectedCrop();
    if (savedCrop) setSelectedCrop(savedCrop);
    setLocation(storage.getLocation());
  }, []);

  // Handle Photo selection and compression
  const handlePhotoFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');
    const newPhotos: CompressedImage[] = [...photos];

    for (let i = 0; i < files.length; i++) {
      if (newPhotos.length >= 3) break;
      try {
        const compressed = await compressImage(files[i]);
        newPhotos.push(compressed);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (err.message === 'TOO_LARGE') {
          setErrorMessage(t.errorPhotoTooLarge);
        } else if (err.message === 'INVALID_TYPE') {
          setErrorMessage(t.errorInvalidPhoto);
        } else {
          setErrorMessage(t.errorInvalidPhoto);
        }
      }
    }

    setPhotos(newPhotos);
    // Reset file input value so user can re-select same file if desired
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // Start Crop Analysis
  const handleStartAnalysis = async () => {
    if (photos.length === 0) {
      setErrorMessage(t.errorInvalidPhoto);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setSavedSuccessMsg(false);
    setFollowUpAnswers([]);

    // Save selected crop to localStorage
    storage.setSelectedCrop(selectedCrop);

    try {
      // 1. Fetch current weather for context if location exists
      let weatherPayload: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
      const locLat = location?.lat || 23.2599;
      const locLon = location?.lon || 77.4126;

      try {
        const weatherRes = await fetch(`/api/weather?lat=${locLat}&lon=${locLon}&name=${encodeURIComponent(location?.name || '')}`);
        if (weatherRes.ok) {
          const wJson = await weatherRes.json();
          if (wJson.success && wJson.data) {
            weatherPayload = {
              temperature: wJson.data.temperature,
              humidity: wJson.data.humidity,
              rainProbability: wJson.data.rainProbability,
              windSpeedKmH: wJson.data.windSpeedKmH,
              condition: wJson.data.condition,
            };
          }
        }
      } catch (wErr) {
        console.warn('Weather fetch warning (non-blocking):', wErr);
      }

      // 2. Call Analyze Crop API
      const res = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: photos.map((p) => ({ base64: p.base64, mimeType: p.mimeType })),
          crop: selectedCrop,
          description: problemDescription,
          locationName: location?.name || '',
          weather: weatherPayload,
          soilInfo:
            showSoilSection &&
            (soilPh.trim() ||
              soilNitrogen.trim() ||
              soilPhosphorus.trim() ||
              soilPotassium.trim() ||
              soilCarbon.trim())
              ? {
                  ph: soilPh.trim() || undefined,
                  nitrogen: soilNitrogen.trim() || undefined,
                  phosphorus: soilPhosphorus.trim() || undefined,
                  potassium: soilPotassium.trim() || undefined,
                  organicCarbon: soilCarbon.trim() || undefined,
                }
              : undefined,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || t.errorAiUnavailable);
        setIsAnalyzing(false);
        return;
      }

      setResult(data.data);

      // Save to localStorage history
      storage.saveScan({
        crop: selectedCrop,
        status: data.data.status,
        severity: data.data.severity || 'medium',
        confidence: data.data.confidence || 'medium',
        confidenceReason: data.data.confidenceReason,
        observations: data.data.observations || [],
        possibleIssues: data.data.possibleIssues || [],
        recommendedActions: data.data.recommendedActions || [],
        weatherImpact: data.data.weatherImpact,
        soilImpact: data.data.soilImpact,
        whatToWatchNext: data.data.whatToWatchNext,
        regenerativeTip: data.data.regenerativeTip,
        photoUrl: photos[0]?.dataUrl,
        locationName: location?.name,
      });

      setIsAnalyzing(false);

      // Scroll smoothly to results
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }, 100);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Analysis error:', err);
      setErrorMessage(t.errorNetwork);
      setIsAnalyzing(false);
    }
  };

  // Save Advice to LocalStorage
  const handleSaveAdvice = () => {
    if (!result) return;
    storage.saveAdvice({
      title: `${selectedCrop} - ${result.status}`,
      crop: selectedCrop,
      why: result.possibleIssues?.[0] || result.observations?.[0] || 'फसल की AI जांच',
      steps: result.recommendedActions || [],
      priority: result.severity === 'high' ? 'high' : result.severity === 'low' ? 'normal' : 'medium',
    });
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 4000);
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setPhotos([]);
    setProblemDescription('');
    setErrorMessage('');
    setFollowUpAnswers([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Farmer Follow-up Question
  const handleAskQuestion = async (customQ?: string) => {
    const q = (customQ || followUpQuestion).trim();
    if (!q || !result) return;

    setIsAskingFollowUp(true);
    try {
      const context = `
फसल: ${selectedCrop}
स्थिति: ${result.status}
अवलोकन: ${result.observations?.join(', ')}
संभावित कारण: ${result.possibleIssues?.join(', ')}
सुझाए गए कदम: ${result.recommendedActions?.join('; ')}
`;
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setFollowUpAnswers((prev) => [...prev, { q, a: data.answer }]);
        setFollowUpQuestion('');
      } else {
        setFollowUpAnswers((prev) => [
          ...prev,
          { q, a: data.error || (language === 'hi' ? 'उत्तर प्राप्त नहीं हो सका।' : 'Could not get answer.') },
        ]);
      }
    } catch {
      setFollowUpAnswers((prev) => [
        ...prev,
        { q, a: language === 'hi' ? 'इंटरनेट समस्या के कारण उत्तर नहीं मिला।' : 'Network error.' },
      ]);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
          <Camera className="w-6 h-6 text-emerald-700" />
          <span>{t.navCheckCrop}</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {language === 'hi'
            ? 'फसल चुनें, फोटो लें और तुरंत समझें कि खेत में क्या हो रहा है।'
            : 'Select crop, take a photo, and immediately understand field health.'}
        </p>

        {location && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 py-1 px-2.5 rounded-lg border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{location.name}</span>
          </div>
        )}
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-sm flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-950">{errorMessage}</p>
            <div className="flex items-center gap-3 mt-2.5">
              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.errorRetryBtn}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-xs text-stone-600 hover:text-stone-900 underline"
              >
                {language === 'hi' ? 'बंद करें' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FORM (Visible when no result or when checking again) */}
      {!result && (
        <div className="space-y-5">
          {/* STEP 1: Select Crop */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="mb-3">
              <label className="text-base font-bold text-stone-900 block">
                1. {t.cropSelectTitle}
              </label>
              <span className="text-xs text-stone-500">{t.cropSelectHint}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {CROP_OPTIONS.map((c) => {
                const isSelected = selectedCrop === c.id;
                const label = language === 'hi' ? c.labelHi : c.labelEn;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCrop(c.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-stone-50/50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl select-none">{c.icon}</span>
                    <span className="text-xs sm:text-sm leading-tight mt-0.5">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Photo Guidance & Upload */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div>
              <label className="text-base font-bold text-stone-900 block">
                2. {t.photoUploadTitle}
              </label>
              <p className="text-xs text-stone-500 mt-0.5">{t.maxPhotosNotice}</p>
            </div>

            {/* Photo Guidance Tips */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t.photoGuidanceHeading}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-stone-700">
                <span>✓ {t.photoGuidance1}</span>
                <span>✓ {t.photoGuidance2}</span>
                <span>✓ {t.photoGuidance3}</span>
                <span>✓ {t.photoGuidance4}</span>
              </div>
            </div>

            {/* Camera & Gallery Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoFiles}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                className="hidden"
                onChange={handlePhotoFiles}
              />

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={photos.length >= 3}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 transition disabled:opacity-50 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  {t.btnCamera}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= 3}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 transition disabled:opacity-50 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  {t.btnChoosePhoto}
                </span>
              </button>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-stone-700 mb-2">
                  {language === 'hi' ? 'चुनी गई फोटो:' : 'Selected Photos:'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.dataUrl}
                        alt={`Crop preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition"
                        title={t.removePhoto}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removePhoto(idx);
                          fileInputRef.current?.click();
                        }}
                        className="absolute bottom-1 left-1 right-1 bg-black/70 hover:bg-emerald-700 text-white text-[10px] font-medium py-1 px-1 rounded-md text-center transition"
                        title={t.btnReplacePhoto}
                      >
                        {t.btnReplacePhoto}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Optional Problem Description */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <label className="text-sm font-bold text-stone-900 block mb-1.5">
              3. {t.problemDescriptionTitle}
            </label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={t.problemDescriptionPlaceholder}
              className="w-full p-3 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* STEP 4: Optional Soil & Regenerative Farming Section */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => setShowSoilSection(!showSoilSection)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <span className="text-sm font-bold text-stone-900 block">
                  {t.soilSectionTitle}
                </span>
                <span className="text-xs text-stone-500">
                  {t.soilSectionSubtitle}
                </span>
              </div>
              <div className="p-1 rounded-lg bg-stone-100 text-stone-600">
                {showSoilSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {showSoilSection && (
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t.soilPh}
                  </label>
                  <input
                    type="text"
                    value={soilPh}
                    onChange={(e) => setSoilPh(e.target.value)}
                    placeholder="e.g. 6.5"
                    className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t.soilNitrogen}
                  </label>
                  <input
                    type="text"
                    value={soilNitrogen}
                    onChange={(e) => setSoilNitrogen(e.target.value)}
                    placeholder="kg/ha"
                    className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t.soilPhosphorus}
                  </label>
                  <input
                    type="text"
                    value={soilPhosphorus}
                    onChange={(e) => setSoilPhosphorus(e.target.value)}
                    placeholder="kg/ha"
                    className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t.soilPotassium}
                  </label>
                  <input
                    type="text"
                    value={soilPotassium}
                    onChange={(e) => setSoilPotassium(e.target.value)}
                    placeholder="kg/ha"
                    className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t.soilOrganicCarbon}
                  </label>
                  <input
                    type="text"
                    value={soilCarbon}
                    onChange={(e) => setSoilCarbon(e.target.value)}
                    placeholder="%"
                    className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSoilPh('');
                      setSoilNitrogen('');
                      setSoilPhosphorus('');
                      setSoilPotassium('');
                      setSoilCarbon('');
                      setShowSoilSection(false);
                    }}
                    className="w-full py-2 px-3 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition text-center"
                  >
                    {t.soilDontKnow}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PRIMARY ACTION: Start Analysis */}
          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || photos.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{t.analyzingInProgress}</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>{t.btnStartAnalysis}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* RESULT VIEW */}
      {result && (
        <div className="space-y-5 animate-in fade-in">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 py-1 px-2.5 rounded-md">
                  {t.resultTitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-950 mt-1">
                  {t.cropLabel}: {selectedCrop}
                </h2>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-center ${
                  result.severity === 'high'
                    ? 'bg-red-100 text-red-900 border border-red-200'
                    : result.severity === 'low'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider font-normal text-stone-600">
                  {t.statusLabel}
                </span>
                {result.status}
              </div>
            </div>

            {/* Thumbnail preview if available */}
            {photos[0]?.dataUrl && (
              <div className="mt-4 flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[0].dataUrl}
                  alt="Checked crop"
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="text-xs text-stone-600">
                  <p className="font-semibold text-stone-800">
                    {language === 'hi' ? 'जांची गई फसल की फोटो' : 'Analyzed Crop Photo'}
                  </p>
                  <p>{location?.name || 'खेत'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section: AI ने क्या देखा? */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700">🔍</span>
              <span>{t.aiSawHeading}</span>
            </h3>
            <ul className="space-y-2 text-stone-700 text-sm">
              {result.observations?.map((obs: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: संभावित समस्या */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="text-amber-700">⚠️</span>
              <span>{t.possibleCausesHeading}</span>
            </h3>
            <ul className="space-y-2 text-stone-700 text-sm">
              {result.possibleIssues?.map((issue: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: मौसम का असर (if present) */}
          {result.weatherImpact && (
            <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 shadow-xs">
              <h3 className="text-base font-bold text-sky-950 mb-2 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-sky-700" />
                <span>{t.weatherImpactHeading}</span>
              </h3>
              <p className="text-sm text-sky-900 leading-relaxed">
                {result.weatherImpact}
              </p>
            </div>
          )}

          {/* Section: मिट्टी का असर (ONLY when user provided soil data) */}
          {result.soilImpact && (
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 shadow-xs">
              <h3 className="text-base font-bold text-amber-950 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <span>{t.soilImpactHeading}</span>
              </h3>
              <p className="text-sm text-amber-950 leading-relaxed">
                {result.soilImpact}
              </p>
            </div>
          )}

          {/* Section: अभी क्या करें? (Numbered Steps) */}
          <div className="bg-emerald-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs">
            <h3 className="text-lg font-bold text-emerald-950 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>{t.whatToDoNowHeading}</span>
            </h3>
            <div className="space-y-3">
              {result.recommendedActions?.map((act: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs text-stone-800 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{act.replace(/^[0-9]+[.\s]+/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: आगे क्या देखें? */}
          {result.whatToWatchNext && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
                <span className="text-emerald-700">👀</span>
                <span>{t.whatToWatchHeading}</span>
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {result.whatToWatchNext}
              </p>
            </div>
          )}

          {/* Section: मिट्टी व प्राकृतिक देखभाल */}
          {result.regenerativeTip && (
            <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-200/60 shadow-xs">
              <h3 className="text-base font-bold text-emerald-950 mb-2 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <span>{t.regenerativeAdviceHeading}</span>
              </h3>
              <p className="text-sm text-emerald-950 leading-relaxed">
                {result.regenerativeTip}
              </p>
            </div>
          )}

          {/* Section: AI Confidence & Safety Disclaimer */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800">{t.confidenceLabel}:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md ${
                  result.confidence === 'high'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.confidence === 'low'
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {result.confidence === 'high'
                  ? t.confidenceHigh
                  : result.confidence === 'low'
                  ? t.confidenceLow
                  : t.confidenceMedium}
              </span>
            </div>
            <p>{result.confidenceReason || t.confidenceNote}</p>
            <p className="font-medium text-stone-700 border-t border-stone-200 pt-2">
              {t.safetyDisclaimer}
            </p>
          </div>

          {/* Action Buttons: Save Advice & Check Again */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAdvice}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{t.btnSaveAdvice}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold text-sm border border-stone-300 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.btnCheckAgain}</span>
            </button>
          </div>

          {savedSuccessMsg && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>{t.adviceSavedSuccess}</span>
            </div>
          )}

          {/* Section: Farmer Follow-up Question */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <span>{t.askMoreHeading}</span>
            </h3>

            {/* Quick Question Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAskQuestion(t.askQuick1)}
                className="text-xs py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
              >
                ❓ {t.askQuick1}
              </button>
              <button
                type="button"
                onClick={() => handleAskQuestion(t.askQuick2)}
                className="text-xs py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
              >
                ❓ {t.askQuick2}
              </button>
            </div>

            {/* Follow-up answers list */}
            {followUpAnswers.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {followUpAnswers.map((item, idx) => (
                  <div key={idx} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1">
                    <p className="font-bold text-stone-900">किसान का सवाल: &quot;{item.q}&quot;</p>
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Custom question input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                placeholder={t.askMorePlaceholder}
                className="flex-1 py-2 px-3 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion();
                }}
              />
              <button
                type="button"
                onClick={() => handleAskQuestion()}
                disabled={isAskingFollowUp || !followUpQuestion.trim()}
                className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isAskingFollowUp ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{t.btnAsk}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
