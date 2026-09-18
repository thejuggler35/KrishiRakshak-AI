'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { SavedAdviceItem, storage } from '@/lib/storage/localStorage';
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Trash2,
  Camera,
  ChevronDown,
  ChevronUp,
  Droplets,
  Layers,
  Recycle,
  Check,
} from 'lucide-react';

export default function AdvicePage() {
  const { t, language } = useLanguage();
  const [adviceList, setAdviceList] = useState<SavedAdviceItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'regenerative'>('saved');

  useEffect(() => {
    setAdviceList(storage.getAdvice());
  }, []);

  const handleToggleComplete = (id: string) => {
    storage.toggleAdviceCompleted(id);
    setAdviceList(storage.getAdvice());
  };

  const handleDelete = (id: string) => {
    storage.deleteAdvice(id);
    setAdviceList(storage.getAdvice());
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Regenerative agricultural practices curated for Indian smallholders
  const regenerativePractices = [
    {
      titleHi: 'फसल चक्र (Crop Rotation)',
      titleEn: 'Crop Rotation',
      icon: Recycle,
      descHi: 'एक ही खेत में लगातार एक जैसी फसल न लगाएं। अनाज के बाद दलहनी फसलें (चना, मूंग, मसूर) लगाने से मिट्टी में प्राकृतिक नाइट्रोजन बढ़ती है और कीटों का चक्र टूटता है।',
      descEn: 'Avoid growing the same crop repeatedly. Alternating cereals with legume crops (chickpea, moong) naturally fixes nitrogen and disrupts pest life cycles.',
    },
    {
      titleHi: 'मिट्टी में जैविक पदार्थ (Organic Matter & Compost)',
      titleEn: 'Soil Organic Matter & Compost',
      icon: Layers,
      descHi: 'गोबर की पक्की खाद, वर्मीकम्पोस्ट या जीवामृत का नियमित प्रयोग करें। इससे मिट्टी की जल धारण क्षमता बढ़ती है और लाभकारी सूक्ष्मजीव सक्रिय रहते हैं।',
      descEn: 'Apply well-rotted farmyard manure, vermicompost, or Jeevamrit regularly to boost microbial activity and moisture retention in the soil.',
    },
    {
      titleHi: 'पानी की बचत व मल्चिंग (Mulching & Water Saving)',
      titleEn: 'Mulching & Water Conservation',
      icon: Droplets,
      descHi: 'फसल के अवशेष या भूसे से जमीन को ढकने (मल्चिंग) से नमी लंबे समय तक बनी रहती है, खरपतवार कम होते हैं और गर्मियों में जमीन का तापमान सामान्य रहता है।',
      descEn: 'Covering soil with crop residues or straw conserves root-zone moisture, curtails weed proliferation, and buffers soil temperature.',
    },
    {
      titleHi: 'फसल अवशेष प्रबंधन (Residue Management)',
      titleEn: 'Crop Residue Management',
      icon: Sprout,
      descHi: 'फसल कटाई के बाद पराली या डंठल को कभी न जलाएं। वेस्ट डीकंपोजर का छिड़काव करके या रोटावेटर से मिट्टी में मिलाने पर यह उत्तम जैविक खाद बन जाती है।',
      descEn: 'Never burn stubble or harvest residues. Incorporating them back into the soil with a rotavator or bio-decomposer turns waste into rich organic humus.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <span>{t.advicePageTitle}</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {language === 'hi'
            ? 'आपकी फसलों के लिए कार्य योजना और प्राकृतिक खेती के सरल नियम।'
            : 'Actionable steps for your crops and regenerative soil care guidelines.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {t.todaysAdvice} ({adviceList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('regenerative')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'regenerative'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {t.regenerativeTabTitle}
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED ADVICE */}
      {activeTab === 'saved' && (
        <div className="space-y-3.5">
          {adviceList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-600 max-w-sm mx-auto">
                {t.noAdviceYet}
              </p>
              <Link
                href="/check-crop"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 px-5 rounded-xl shadow-xs transition"
              >
                <Camera className="w-4 h-4" />
                <span>{t.heroCheckCropBtn}</span>
              </Link>
            </div>
          ) : (
            adviceList.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                    item.completed
                      ? 'border-stone-200 opacity-80 bg-stone-50/60'
                      : 'border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-stone-900 text-base sm:text-lg">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            item.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : item.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.priority === 'high'
                            ? t.priorityHigh
                            : item.priority === 'medium'
                            ? t.priorityMedium
                            : t.priorityNormal}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-1">
                        <span className="font-semibold text-stone-700">{t.whyThisGiven}: </span>
                        {item.why}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg transition"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded Steps */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                      <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        {t.actionSteps}:
                      </p>
                      <div className="space-y-1.5">
                        {item.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2.5 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100"
                          >
                            <span className="font-bold text-emerald-700 shrink-0">
                              {sIdx + 1}.
                            </span>
                            <span>{step.replace(/^[0-9]+[.\s]+/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? (language === 'hi' ? 'कम देखें' : 'Show Less') : (language === 'hi' ? 'पूरा देखें' : 'View Full Steps')}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleComplete(item.id)}
                      className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.completed ? t.completed : t.markCompleted}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: REGENERATIVE PRACTICES */}
      {activeTab === 'regenerative' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950">
            <p className="font-bold text-emerald-900 text-sm mb-0.5">
              {language === 'hi' ? 'प्राकृतिक व पुनर्योजी खेती' : 'Regenerative Agriculture'}
            </p>
            <p className="leading-relaxed">
              {language === 'hi'
                ? 'ये सरल उपाय खेत की लागत कम करते हैं, जमीन की उर्वरा शक्ति को जीवित रखते हैं और कम पानी में भी अच्छी पैदावार सुनिश्चित करते हैं।'
                : 'These practical practices reduce input costs, nourish soil microbiology, and sustain yields with lower water needs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {regenerativePractices.map((prac, idx) => {
              const Icon = prac.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">
                      {language === 'hi' ? prac.titleHi : prac.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                      {language === 'hi' ? prac.descHi : prac.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
