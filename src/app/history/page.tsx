'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { CropScanRecord, storage } from '@/lib/storage/localStorage';
import {
  History as HistoryIcon,
  Camera,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  Sprout,
  RotateCcw,
} from 'lucide-react';

export default function HistoryPage() {
  const { t, language } = useLanguage();
  const [scans, setScans] = useState<CropScanRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setScans(storage.getScans());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteScan(id);
    setScans(storage.getScans());
  };

  const handleClearAll = () => {
    if (confirm(language === 'hi' ? 'क्या आप पूरा इतिहास हटाना चाहते हैं?' : 'Clear all scan history?')) {
      storage.clearScans();
      setScans([]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-emerald-700" />
            <span>{t.historyPageTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        {scans.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-stone-500 hover:text-red-700 py-1.5 px-3 rounded-lg border border-stone-200 hover:border-red-200 transition"
          >
            {t.clearHistory}
          </button>
        )}
      </div>

      {/* List */}
      {scans.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-600">{t.noHistoryYet}</p>
          <Link
            href="/check-crop"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 px-5 rounded-xl shadow-xs transition"
          >
            <Camera className="w-4 h-4" />
            <span>{t.heroCheckCropBtn}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => {
            const isExpanded = expandedId === scan.id;

            return (
              <div
                key={scan.id}
                onClick={() => toggleExpand(scan.id)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {scan.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={scan.photoUrl}
                        alt={scan.crop}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                        🌱
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900 text-base">
                          {scan.crop}
                        </span>
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

                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(scan.date)}
                        </span>
                        {scan.locationName && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {scan.locationName.split(',')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(scan.id, e)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg transition"
                      title={t.deleteItem}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-stone-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-3.5 text-xs text-stone-700">
                    {scan.observations && scan.observations.length > 0 && (
                      <div>
                        <p className="font-bold text-stone-900 mb-1">
                          {t.aiSawHeading}:
                        </p>
                        <ul className="space-y-1 list-disc list-inside text-stone-600">
                          {scan.observations.map((obs, i) => (
                            <li key={i}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {scan.possibleIssues && scan.possibleIssues.length > 0 && (
                      <div>
                        <p className="font-bold text-amber-900 mb-1">
                          {t.possibleCausesHeading}:
                        </p>
                        <ul className="space-y-1 list-disc list-inside text-stone-600">
                          {scan.possibleIssues.map((iss, i) => (
                            <li key={i}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {scan.recommendedActions && scan.recommendedActions.length > 0 && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                        <p className="font-bold text-emerald-950 mb-1.5">
                          {t.whatToDoNowHeading}:
                        </p>
                        <div className="space-y-1">
                          {scan.recommendedActions.map((act, i) => (
                            <p key={i} className="text-stone-800">
                              {act}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {scan.weatherImpact && (
                      <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100">
                        <p className="font-bold text-sky-950 mb-0.5">{t.weatherImpactHeading}:</p>
                        <p className="text-sky-900">{scan.weatherImpact}</p>
                      </div>
                    )}

                    {scan.soilImpact && (
                      <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                        <p className="font-bold text-amber-950 mb-0.5">{t.soilImpactHeading}:</p>
                        <p className="text-amber-900">{scan.soilImpact}</p>
                      </div>
                    )}

                    {scan.whatToWatchNext && (
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <p className="font-bold text-stone-900 mb-0.5">{t.whatToWatchHeading}:</p>
                        <p className="text-stone-700">{scan.whatToWatchNext}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Link
                        href="/check-crop"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'नई जांच करें' : 'New Check'}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
