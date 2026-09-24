import React from 'react';
import { VocabularyWord, LanguageVariant } from '../types';
import { useApp } from '../context/AppContext';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';
import { Volume2, X, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface VocabularyModalProps {
  word: VocabularyWord | null;
  onClose: () => void;
  onStartSpelling?: (word: VocabularyWord) => void;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({ 
  word, 
  onClose,
  onStartSpelling 
}) => {
  const { languageVariant, setActiveTab, setActiveSpellingMode } = useApp();

  if (!word) return null;

  const isUK = languageVariant === 'british';
  const targetSpelling = isUK ? word.british : word.american;
  const otherSpelling = isUK ? word.american : word.british;
  const otherVariantName = isUK ? 'American English' : 'British English';
  const currentVariantName = isUK ? 'British English' : 'American English';

  const handlePronounce = () => {
    sound.playTap();
    speech.speak(targetSpelling, languageVariant);
  };

  const handlePracticeThisWord = () => {
    onClose();
    if (onStartSpelling) {
      onStartSpelling(word);
    } else {
      setActiveSpellingMode('direct');
      setActiveTab('spelling');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vocab-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-850 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl" aria-hidden="true">{word.icon}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {word.partOfSpeech}
              </span>
              <span className="text-xs text-amber-400 font-semibold">
                {word.category}
              </span>
            </div>
            <h2 id="vocab-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{targetSpelling}</span>
              <button
                onClick={handlePronounce}
                className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                title={`Listen in ${currentVariantName}`}
                aria-label={`Pronounce ${targetSpelling} in ${currentVariantName}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{isUK ? '🇬🇧 British' : '🇺🇸 American'}: <strong className="text-slate-200">{targetSpelling}</strong></span>
              {word.phoneticsBritish && (
                <span className="text-slate-500 font-mono text-[11px]">
                  {isUK ? word.phoneticsBritish : word.phoneticsAmerican}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close word details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Variant Comparison Callout if applicable */}
          {word.hasVariantDifference && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200">
              <div className="text-xs font-bold uppercase tracking-wider mb-1 text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>British vs American Difference</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold mb-2">
                <span>🇬🇧 British: <span className="underline decoration-amber-400/60">{word.british}</span></span>
                <span>🇺🇸 American: <span className="underline decoration-amber-400/60">{word.american}</span></span>
              </div>
              {word.spellingRuleExplanation && (
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {word.spellingRuleExplanation}
                </p>
              )}
            </div>
          )}

          {/* Definition */}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
              Definition
            </div>
            <p className="text-base text-slate-100 leading-relaxed font-medium">
              {word.definition}
            </p>
          </div>

          {/* Example in context */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Story Example</span>
            </div>
            <p className="italic text-slate-300">
              "{word.exampleSentence}"
            </p>
          </div>

          {/* Synonyms */}
          {word.synonyms.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                Synonyms
              </div>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map(syn => (
                  <span
                    key={syn}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePracticeThisWord}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <span>Practice Spelling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
