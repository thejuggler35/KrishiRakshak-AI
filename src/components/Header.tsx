'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { FarmerLocation, storage } from '@/lib/storage/localStorage';
import LocationModal from './LocationModal';
import { Sprout, MapPin, Globe, Camera } from 'lucide-react';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [location, setLocation] = useState<FarmerLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    setLocation(storage.getLocation());
  }, []);

  const navLinks = [
    { href: '/', label: t.navHome },
    { href: '/check-crop', label: t.navCheckCrop, highlight: true },
    { href: '/weather', label: t.navWeather },
    { href: '/advice', label: t.navAdvice },
    { href: '/history', label: t.navHistory },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-none">
                  {language === 'hi' ? 'कृषिरक्षक AI' : 'KrishiRakshak AI'}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-normal line-clamp-1 mt-0.5">
                  {language === 'hi' ? 'अपने खेत की बेहतर समझ' : 'Smart Field Advisory'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.highlight) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="ml-2 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50 font-semibold'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Tools: Location Badge & Language Switcher */}
            <div className="flex items-center gap-2">
              {/* Location Badge */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium py-1.5 px-2.5 sm:px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 transition max-w-[140px] sm:max-w-[180px]"
                title={location ? location.name : t.locationNotSet}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">
                  {location ? location.name.split(',')[0] : (language === 'hi' ? 'स्थान चुनें' : 'Location')}
                </span>
              </button>

              {/* Language Switch */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-stone-300 hover:border-emerald-600 bg-white text-stone-800 transition"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'hi' ? 'EN' : 'हिन्दी'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={(newLoc) => setLocation(newLoc)}
      />
    </>
  );
}
