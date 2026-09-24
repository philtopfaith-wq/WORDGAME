import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpellingMode } from '../types';
import { STORIES } from '../data/stories';
import { SpellingExercise } from './SpellingExercise';
import { VariantBanner } from './VariantBanner';
import { 
  Pencil, 
  BookOpen, 
  AlignLeft, 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  Zap, 
  ArrowRight,
  Flame
} from 'lucide-react';

export const SpellingHub: React.FC = () => {
  const { 
    languageVariant, 
    activeSpellingMode, 
    setActiveSpellingMode,
    spellingFilterStoryId,
    setSpellingFilterStoryId,
    progress 
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(spellingFilterStoryId !== null);
  const isUK = languageVariant === 'british';

  const modes: Array<{
    id: SpellingMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'direct',
      title: 'Direct Spelling',
      description: 'Standard spelling test with pronunciation and definition cues.',
      icon: <Pencil className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'story_vocab',
      title: 'Story Vocabulary',
      description: 'Test words discovered across your adventure story journeys.',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      badge: spellingFilterStoryId ? 'Story Selected' : undefined,
    },
    {
      id: 'contextual',
      title: 'Contextual Fill-in',
      description: 'Read an intriguing story sentence and type the missing word.',
      icon: <AlignLeft className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'picture_clue',
      title: 'Thematic Clue Challenge',
      description: 'Examine concept illustrations, definitions, and synonyms.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'missing_letters',
      title: 'Missing Letters Puzzle',
      description: 'Fill in the blanks (e.g. RESPONS _ BLE or C _ L O U R).',
      icon: <HelpCircle className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'listen_spell',
      title: 'Listen & Spell',
      description: 'Speech synthesis pronounces the word in native UK or US accent.',
      icon: <Volume2 className="w-5 h-5 text-pink-400" />,
    },
    {
      id: 'challenge',
      title: 'Challenge Round',
      description: 'Multi-syllable, silent-letter, and double-consonant words.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: 'Hard',
    },
  ];

  const handleStartMode = (modeId: SpellingMode) => {
    setActiveSpellingMode(modeId);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <SpellingExercise
        initialMode={activeSpellingMode}
        storyId={spellingFilterStoryId}
        onExit={() => {
          setIsPlaying(false);
          setSpellingFilterStoryId(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spelling Practice Lab
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select a learning mode to practice spelling in {isUK ? '🇬🇧 British English' : '🇺🇸 American English'}.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 self-start">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Current Streak: <strong>{progress.currentStreak}</strong></span>
          </div>
        </div>
      </div>

      <VariantBanner activityTitle="Spelling Mode Selection" />

      {/* Story Filter Banner if applicable */}
      {spellingFilterStoryId && (
        <div className="mb-6 p-4 rounded-xl bg-blue-950/40 border border-blue-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Story Mode Active
            </div>
            <div className="text-sm font-semibold text-white">
              Practicing vocabulary from: {STORIES.find(s => s.id === spellingFilterStoryId)?.title}
            </div>
          </div>
          <button
            onClick={() => setSpellingFilterStoryId(null)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Clear Story Filter
          </button>
        </div>
      )}

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modes.map(m => (
          <div
            key={m.id}
            onClick={() => handleStartMode(m.id)}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:shadow-amber-500/5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 group-hover:bg-slate-750 transition-colors">
                  {m.icon}
                </div>
                {m.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {m.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {m.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <span>Start Practice (5 words)</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
