import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { VocabularyWord } from '../types';
import { VariantBanner } from './VariantBanner';
import { VocabularyModal } from './VocabularyModal';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';
import { 
  Search, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Pencil,
  CheckCircle2
} from 'lucide-react';

export const VocabularyVault: React.FC = () => {
  const { 
    languageVariant, 
    progress,
    setActiveTab,
    setActiveSpellingMode 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeWord, setActiveWord] = useState<VocabularyWord | null>(null);

  const isUK = languageVariant === 'british';

  // Categories
  const categories = ['all', 'Perception & Art', 'Preferences', 'Geometry & Space', 'Action & Process', 'Exploration', 'Science & Nature', 'Character & Leadership'];

  const filteredWords = VOCABULARY_LIST.filter(word => {
    const targetSpelling = isUK ? word.british : word.american;
    const matchesSearch = 
      targetSpelling.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePronounce = (word: VocabularyWord, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    const targetSpelling = isUK ? word.british : word.american;
    speech.speak(targetSpelling, languageVariant);
  };

  const handlePracticeWord = (word: VocabularyWord) => {
    setActiveSpellingMode('direct');
    setActiveTab('spelling');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Vocabulary Explorer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore definitions, word origins, and spelling distinctions in {isUK ? '🇬🇧 British English' : '🇺🇸 American English'}.
        </p>
      </div>

      <VariantBanner activityTitle="Vocabulary Vault" />

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, definitions, or patterns..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="all">All Categories ({VOCABULARY_LIST.length} words)</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map(word => {
          const targetSpelling = isUK ? word.british : word.american;
          const otherSpelling = isUK ? word.american : word.british;
          const isMastered = progress.wordsMastered.includes(word.id);
          const practiceData = progress.wordsPracticed[word.id];

          return (
            <div
              key={word.id}
              onClick={() => setActiveWord(word)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none" aria-hidden="true">{word.icon}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {word.category}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>{targetSpelling}</span>
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePronounce(word, e)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                    title={`Pronounce in ${isUK ? 'British' : 'American'} accent`}
                    aria-label={`Listen to ${targetSpelling}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {word.definition}
                </p>

                {/* Variant Note if different */}
                {word.hasVariantDifference && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-center justify-between">
                    <span>🇬🇧 <strong>{word.british}</strong></span>
                    <span>🇺🇸 <strong>{word.american}</strong></span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  {isMastered ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </span>
                  ) : practiceData ? (
                    <span>Practiced: {practiceData.correct}/{practiceData.attempts}</span>
                  ) : (
                    <span className="text-slate-500">Not practiced yet</span>
                  )}
                </div>

                <span className="text-amber-400 font-semibold group-hover:underline text-[11px]">
                  View Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No vocabulary words found matching "{searchQuery}".</p>
        </div>
      )}

      {/* Word Detail Modal */}
      {activeWord && (
        <VocabularyModal
          word={activeWord}
          onClose={() => setActiveWord(null)}
          onStartSpelling={handlePracticeWord}
        />
      )}
    </div>
  );
};
