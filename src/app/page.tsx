'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { CropScanRecord, FarmerLocation, storage } from '@/lib/storage/localStorage';
import LocationModal from '@/components/LocationModal';
import {
  Camera,
  CloudSun,
  Lightbulb,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Sprout,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [recentScans, setRecentScans] = useState<CropScanRecord[]>([]);
  const [location, setLocation] = useState<FarmerLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    setRecentScans(storage.getScans().slice(0, 3));
    setLocation(storage.getLocation());
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 5) return language === 'hi' ? 'अभी-अभी' : 'Just now';
      if (diffMins < 60) return language === 'hi' ? `${diffMins} मिनट पहले` : `${diffMins}m ago`;
      if (diffHours < 24) return language === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
      return language === 'hi' ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Farmer Greeting & Location Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span>{t.greeting}</span>
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">{t.homeHeroQuestion}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm font-medium transition cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="truncate max-w-[200px]">
            {location ? location.name : t.locationNotSet}
          </span>
          <span className="text-xs text-emerald-700 underline font-normal ml-1">
            {location ? t.changeLocation : t.locationUseGps}
          </span>
        </button>
      </div>

      {/* Hero Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Primary CTA: Check Crop */}
        <Link
          href="/check-crop"
          className="group sm:col-span-1 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15 pointer-events-none">
            <Camera className="w-32 h-32 text-white" />
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {language === 'hi' ? 'फसल की जांच' : 'Check Crop'}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
              {language === 'hi'
                ? 'पौधे की फोटो खींचें और तुरंत AI रोग पहचान व समाधान पाएं।'
                : 'Take a photo of your crop to get instant diagnosis and steps.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
            <span>{language === 'hi' ? 'जांच शुरू करें' : 'Start Inspection'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Secondary CTA: Weather */}
        <Link
          href="/weather"
          className="group bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {language === 'hi' ? 'आज का मौसम' : 'Today’s Weather'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              {language === 'hi'
                ? 'तापमान, बारिश की संभावना और फसल पर मौसम का असर देखें।'
                : 'Check rain probability, temperature, and farming precautions.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-800">
            <span>{language === 'hi' ? 'मौसम देखें' : 'View Weather'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Tertiary CTA: Advice */}
        <Link
          href="/advice"
          className="group bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {language === 'hi' ? 'मेरी कृषि सलाह' : 'My Field Advice'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              {language === 'hi'
                ? 'सेव की गई सलाह और प्राकृतिक खेती के सरल उपाय।'
                : 'Saved action checklists and regenerative soil care practices.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-800">
            <span>{language === 'hi' ? 'सलाह देखें' : 'View Advice'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Three Simple Steps: "आप कैसे शुरू कर सकते हैं?" */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-700" />
          <span>{t.howToStartHeading}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex sm:flex-col items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">{t.step1Title}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{t.step1Desc}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">{t.step2Title}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{t.step2Desc}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">{t.step3Title}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Crop Checks (LocalStorage, no login) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <span>{t.recentChecksHeading}</span>
          </h2>
          {recentScans.length > 0 && (
            <Link
              href="/history"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
            >
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-6 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <p className="text-sm text-stone-600 mb-3">{t.noRecentChecks}</p>
            <Link
              href="/check-crop"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xs transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.heroCheckCropBtn}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentScans.map((scan) => (
              <Link
                key={scan.id}
                href="/history"
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    🌱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{scan.crop}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          scan.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : scan.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {scan.status}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      {formatTimeAgo(scan.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>{t.viewDetails}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={(newLoc) => setLocation(newLoc)}
      />
    </div>
  );
}
