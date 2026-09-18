'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Home, Camera, CloudSun, Lightbulb, History } from 'lucide-react';

export default function MobileNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: '/', label: t.navHome, icon: Home },
    { href: '/weather', label: t.navWeather, icon: CloudSun },
    { href: '/check-crop', label: t.navCheckCrop, icon: Camera, prominent: true },
    { href: '/advice', label: t.navAdvice, icon: Lightbulb },
    { href: '/history', label: t.navHistory, icon: History },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center justify-around h-16 px-1">
        {links.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.prominent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white ring-3 ring-white'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-w-0 transition-colors ${
                isActive
                  ? 'text-emerald-800 font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] truncate max-w-[60px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
