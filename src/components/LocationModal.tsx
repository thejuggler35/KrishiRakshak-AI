'use client';

import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { FarmerLocation, storage } from '@/lib/storage/localStorage';
import { MapPin, Navigation, Map, X, Check, Search } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSaved?: (loc: FarmerLocation) => void;
}

const COMMON_REGIONS = [
  { name: 'करनाल, हरियाणा', lat: 29.6857, lon: 76.9905 },
  { name: 'लुधियाना, पंजाब', lat: 30.9010, lon: 75.8573 },
  { name: 'इंदौर, मध्य प्रदेश', lat: 22.7196, lon: 75.8577 },
  { name: 'नासिक, महाराष्ट्र', lat: 19.9975, lon: 73.7898 },
  { name: 'वाराणसी, उत्तर प्रदेश', lat: 25.3176, lon: 82.9739 },
  { name: 'जयपुर, राजस्थान', lat: 26.9124, lon: 75.7873 },
  { name: 'पटना, बिहार', lat: 25.5941, lon: 85.1376 },
];

export default function LocationModal({ isOpen, onClose, onLocationSaved }: LocationModalProps) {
  const { t, language } = useLanguage();
  const [manualText, setManualText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lon: number } | null>(null);

  if (!isOpen) return null;

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg(t.locationDeniedMsg);
      return;
    }

    setIsLoadingGps(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        let placeName = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;

        try {
          // Fast reverse geocoding using standard open Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
            { headers: { 'Accept-Language': language === 'hi' ? 'hi,en' : 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            const district = addr?.state_district || addr?.county || addr?.city || addr?.town || addr?.village;
            const state = addr?.state;
            if (district && state) {
              placeName = `${district}, ${state}`;
            } else if (data.display_name) {
              placeName = data.display_name.split(',').slice(0, 2).join(',');
            }
          }
        } catch {
          // fallback to coordinate string
        }

        const loc: FarmerLocation = { name: placeName, lat, lon };
        storage.setLocation(loc);
        setIsLoadingGps(false);
        if (onLocationSaved) onLocationSaved(loc);
        onClose();
      },
      (err) => {
        setIsLoadingGps(false);
        console.warn('Geolocation denied or failed', err);
        setErrorMsg(t.locationDeniedMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveManual = (nameToSave?: string, coords?: { lat: number; lon: number }) => {
    const name = (nameToSave || manualText).trim();
    if (!name) return;

    const loc: FarmerLocation = {
      name,
      lat: coords?.lat ?? (selectedCoord?.lat || 23.2599),
      lon: coords?.lon ?? (selectedCoord?.lon || 77.4126),
    };

    storage.setLocation(loc);
    if (onLocationSaved) onLocationSaved(loc);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 leading-tight">{t.locationTitle}</h3>
            <p className="text-sm text-stone-600">सटीक मौसम और फसल सलाह के लिए</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Option 1: Browser GPS */}
        <button
          onClick={handleUseGps}
          disabled={isLoadingGps}
          className="w-full flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium py-3.5 px-4 rounded-xl shadow-sm transition mb-3 disabled:opacity-70 text-base"
        >
          <Navigation className={`w-5 h-5 ${isLoadingGps ? 'animate-spin' : ''}`} />
          <span>{isLoadingGps ? 'लोकेशन खोजी जा रही है...' : t.locationUseGps}</span>
        </button>

        {/* Option 2: Map Selection toggle */}
        <button
          type="button"
          onClick={() => setShowMapPicker(!showMapPicker)}
          className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 px-4 rounded-xl transition mb-4 text-sm border border-stone-300"
        >
          <Map className="w-4 h-4 text-emerald-700" />
          <span>{showMapPicker ? 'मानचित्र छुपाएं' : t.locationPickMap}</span>
        </button>

        {showMapPicker && (
          <div className="mb-4 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <div className="mb-3">
                <iframe
                  title="Google Maps Location Picker"
                  className="w-full h-44 rounded-xl border border-stone-200 shadow-2xs"
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(manualText || 'India')}`}
                />
              </div>
            ) : (
              <p className="text-xs text-stone-600 mb-2 font-medium">
                मानचित्र सेवा उपलब्ध न होने पर आप नीचे दिए गए प्रमुख कृषि क्षेत्रों में से चुन सकते हैं या नाम लिख सकते हैं:
              </p>
            )}
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
              {COMMON_REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => {
                    setSelectedCoord({ lat: region.lat, lon: region.lon });
                    setManualText(region.name);
                    handleSaveManual(region.name, { lat: region.lat, lon: region.lon });
                  }}
                  className="text-left px-2.5 py-2 text-xs bg-white hover:bg-emerald-100 rounded-lg border border-emerald-100 text-stone-800 truncate transition cursor-pointer"
                >
                  📍 {region.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Option 3: Manual Text Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t.locationManualInput}
          </label>
          <div className="relative">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t.locationPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveManual();
              }}
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
          {manualText.trim() && (
            <button
              onClick={() => handleSaveManual()}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveLocation}</span>
            </button>
          )}
        </div>

        {/* Option 4: Do it later */}
        <div className="border-t border-stone-200 pt-3 text-center">
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-sm font-medium py-1 px-3 rounded-lg transition"
          >
            {t.locationDoLater}
          </button>
        </div>
      </div>
    </div>
  );
}
