import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ArrowRightLeft } from 'lucide-react';

interface VariantBannerProps {
  activityTitle?: string;
  compact?: boolean;
}

export const VariantBanner: React.FC<VariantBannerProps> = ({ 
  activityTitle = 'Learning Mode', 
  compact = false 
}) => {
  const { languageVariant, setLanguageVariant } = useApp();

  const isUK = languageVariant === 'british';

  const toggleVariant = () => {
    setLanguageVariant(isUK ? 'american' : 'british');
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
        <span className="text-base" aria-hidden="true">{isUK ? '🇬🇧' : '🇺🇸'}</span>
        <span className="font-semibold">{isUK ? 'British English' : 'American English'}</span>
        <button
          onClick={toggleVariant}
          className="ml-1 text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
          title={`Switch to ${isUK ? 'American' : 'British'} English`}
          aria-label={`Switch language variant to ${isUK ? 'American' : 'British'} English`}
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Switch</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-xl border p-3 md:p-4 mb-6 transition-all ${
      isUK 
        ? 'bg-blue-950/40 border-blue-800/60 text-blue-100 shadow-sm' 
        : 'bg-red-950/40 border-red-800/60 text-red-100 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl select-none" aria-hidden="true">
            {isUK ? '🇬🇧' : '🇺🇸'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider uppercase font-bold text-slate-400">
                Active Language System
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-amber-400">{activityTitle}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isUK ? 'British English' : 'American English'}</span>
              <span className="text-xs font-normal text-slate-300">
                ({isUK ? 'e.g. colour, centre, organise' : 'e.g. color, center, organize'})
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={toggleVariant}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 flex items-center justify-center gap-2 transition-colors cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none"
            aria-label={`Switch to ${isUK ? 'American English' : 'British English'}`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch to {isUK ? '🇺🇸 American' : '🇬🇧 British'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
