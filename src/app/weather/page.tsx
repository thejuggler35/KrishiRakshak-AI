'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { FarmerLocation, storage } from '@/lib/storage/localStorage';
import { WeatherData } from '@/lib/weather/client';
import LocationModal from '@/components/LocationModal';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Thermometer,
  MapPin,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Calendar,
  Sprout,
  ShieldAlert,
} from 'lucide-react';

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<FarmerLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('गेहूं');

  const loadWeather = async (loc?: FarmerLocation | null) => {
    setIsLoading(true);
    setErrorMessage('');
    const targetLoc = loc !== undefined ? loc : location;
    const lat = targetLoc?.lat || 23.2599;
    const lon = targetLoc?.lon || 77.4126;
    const name = targetLoc?.name || 'आपका क्षेत्र';

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setWeather(data.data);
      } else {
        setErrorMessage(data.error || t.weatherNotAvailable);
      }
    } catch {
      setErrorMessage(t.errorNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLoc = storage.getLocation();
    setLocation(savedLoc);
    setSelectedCrop(storage.getSelectedCrop());
    loadWeather(savedLoc);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate practical agricultural commentary based on verified weather numbers
  const getWeatherAdvisory = (w: WeatherData) => {
    const crop = selectedCrop || (language === 'hi' ? 'फसल' : 'crop');

    if (w.rainProbability >= 60 || w.rainfallMm > 2) {
      return language === 'hi'
        ? `आज ${crop} में रासायनिक छिड़काव या यूरिया डालने से बचें, क्योंकि बारिश से दवा बह सकती है। खेत की नालियों की सफाई रखें ताकि जलभराव न हो।`
        : `Avoid chemical spray or urea application today as rain may wash it away. Ensure field drainage channels are clear to prevent waterlogging.`;
    }

    if (w.temperature >= 36) {
      return language === 'hi'
        ? `उच्च तापमान के कारण ${crop} में नमी की कमी हो सकती है। यदि आवश्यक हो तो हल्की सिंचाई शाम के समय करें। सीधी तेज धूप से पौधों के तनाव पर नजर रखें।`
        : `High temperature may cause moisture stress in ${crop}. If needed, apply light irrigation during evening hours.`;
    }

    if (w.windSpeedKmH >= 25) {
      return language === 'hi'
        ? `तेज हवा चल रही है (${w.windSpeedKmH} km/h)। इस समय कीटनाशक या खरपतवारनाशी का स्प्रे न करें ताकि दवा हवा में न उड़े।`
        : `Strong winds observed (${w.windSpeedKmH} km/h). Avoid any spraying operations to prevent spray drift.`;
    }

    if (w.humidity >= 80 && w.temperature >= 22) {
      return language === 'hi'
        ? `हवा में अधिक नमी (${w.humidity}%) और मध्यम तापमान के कारण फफूंद जनित रोगों की संभावना बढ़ जाती है। ${crop} के पत्तों के निचले हिस्से को नियमित रूप से देखें।`
        : `High humidity (${w.humidity}%) creates favorable conditions for fungal growth. Regularly inspect the lower leaves of ${crop}.`;
    }

    return language === 'hi'
      ? `वर्तमान मौसम ${crop} के लिए अनुकूल है। नियमित रूप से खेत का निरीक्षण करें और सामान्य कृषि कार्य जारी रखें।`
      : `Current weather conditions are favorable for ${crop}. Continue regular field scouting and farm practices.`;
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
      {/* Title & Location Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <CloudSun className="w-6 h-6 text-sky-600" />
            <span>{t.weatherHeading}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {language === 'hi'
              ? 'वास्तविक मौसम डेटा और आपकी फसल पर इसका प्रभाव।'
              : 'Real meteorological data and practical crop impact.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="truncate max-w-[150px]">
              {location ? location.name : t.locationNotSet}
            </span>
          </button>

          <button
            type="button"
            onClick={() => loadWeather()}
            disabled={isLoading}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-300 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-700">
            {language === 'hi' ? 'मौसम की लाइव जानकारी प्राप्त की जा रही है...' : 'Fetching live weather data...'}
          </p>
        </div>
      )}

      {/* Error / Unavailable Message */}
      {!isLoading && (errorMessage || !weather || !weather.isConfigured) && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-bold">{t.infoNotAvailable}</p>
            <p className="text-xs text-stone-600 mt-1">{t.weatherNotAvailable}</p>
            <button
              type="button"
              onClick={() => loadWeather()}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.errorRetryBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Weather Content */}
      {!isLoading && weather && weather.isConfigured && (
        <div className="space-y-5">
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-sky-700 to-sky-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
                  {weather.locationName}
                </span>
                <div className="text-5xl sm:text-6xl font-black mt-2 tracking-tight flex items-start">
                  <span>{weather.temperature}</span>
                  <span className="text-2xl sm:text-3xl font-normal mt-1">°C</span>
                </div>
                <p className="text-base sm:text-lg font-medium text-sky-100 mt-1">
                  {weather.condition}
                </p>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 flex items-center justify-center">
                {weather.rainProbability > 40 ? (
                  <CloudRain className="w-10 h-10 text-white" />
                ) : (
                  <CloudSun className="w-10 h-10 text-white" />
                )}
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/20">
              <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <CloudRain className="w-5 h-5 text-sky-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-200 block">{t.rainProbLabel}</span>
                  <span className="text-sm font-bold">{weather.rainProbability}%</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-sky-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-200 block">{t.humidityLabel}</span>
                  <span className="text-sm font-bold">{weather.humidity}%</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <Wind className="w-5 h-5 text-sky-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-200 block">{t.windLabel}</span>
                  <span className="text-sm font-bold">{weather.windSpeedKmH} km/h</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <Thermometer className="w-5 h-5 text-sky-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-200 block">{t.rainfallLabel}</span>
                  <span className="text-sm font-bold">{weather.rainfallMm} mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: आपकी फसल पर संभावित असर (Real meteorological numbers explained for farmer) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  {t.weatherImpactCropHeading} ({selectedCrop})
                </h2>
                <span className="text-[11px] text-stone-500">
                  {language === 'hi'
                    ? 'मौसम विभाग के लाइव आंकड़ों पर आधारित कृषि सलाह'
                    : 'Agricultural advisory based on live meteorological data'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <p className="text-stone-800 text-sm leading-relaxed font-medium">
                {getWeatherAdvisory(weather)}
              </p>
            </div>

            {/* Quick Farming Checklist based on Weather */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>
                  {weather.rainProbability > 50
                    ? (language === 'hi' ? 'खेत में पानी निकासी का प्रबंध रखें।' : 'Ensure field water drainage is ready.')
                    : (language === 'hi' ? 'सिंचाई की आवश्यकता की जांच करें।' : 'Check if soil requires irrigation.')}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>
                  {weather.windSpeedKmH > 20
                    ? (language === 'hi' ? 'तेज हवा में छिड़काव कार्य टालें।' : 'Postpone sprays in windy condition.')
                    : (language === 'hi' ? 'शांत मौसम में आवश्यक छिड़काव संभव है।' : 'Spraying can be carried out in calm weather.')}
                </span>
              </div>
            </div>
          </div>

          {/* Section: आगामी दिनों का मौसम (3-day forecast) */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>{t.forecastTitle}</span>
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                {weather.forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center flex flex-col items-center justify-between"
                  >
                    <span className="text-xs font-bold text-stone-800">{day.dayName}</span>
                    <div className="my-2 text-xl font-bold text-stone-900">
                      {day.tempMax}°C
                    </div>
                    <span className="text-[11px] text-stone-600 block line-clamp-1">
                      {day.condition}
                    </span>
                    <span className="text-[10px] text-sky-700 font-semibold mt-1">
                      💧 {day.rainProbability}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meteorological Data Source Notice */}
          <div className="text-center text-xs text-stone-500 py-1">
            <span>मौसम स्रोत: {weather.source}</span>
          </div>
        </div>
      )}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={(newLoc) => {
          setLocation(newLoc);
          loadWeather(newLoc);
        }}
      />
    </div>
  );
}
