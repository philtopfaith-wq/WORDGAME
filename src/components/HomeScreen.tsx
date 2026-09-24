import React from 'react';
import { useApp } from '../context/AppContext';
import { STORIES } from '../data/stories';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { VariantBanner } from './VariantBanner';
import { 
  BookOpen, 
  Pencil, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Award, 
  Compass, 
  Volume2, 
  CheckCircle2, 
  Play,
  ArrowRightLeft
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveTab, 
    languageVariant, 
    setLanguageVariant, 
    progress,
    setSelectedStoryId,
    setActiveSpellingMode 
  } = useApp();

  const isUK = languageVariant === 'british';
  const featuredStory = STORIES[0];

  const handleStartContinue = () => {
    // If has uncompleted story, pick first uncompleted
    const nextStory = STORIES.find(s => !progress.storiesCompleted.includes(s.id)) || STORIES[0];
    setSelectedStoryId(nextStory.id);
    setActiveTab('stories');
  };

  const handleLaunchSpelling = () => {
    setActiveSpellingMode('direct');
    setActiveTab('spelling');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Explicit Top Variant Banner */}
      <VariantBanner activityTitle="Welcome Explorer" />

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-8">
        {/* Background artwork with gradient scrim */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-800">
          <img
            src="/src/assets/images/hero_lexiquest_adventure_1790256643530.jpg"
            alt="LexiQuest Adventure"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Interactive Story &amp; Spelling Adventure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Embark on the Grand Quest of Words.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              Read captivating mysteries, listen to speech-synthesized narration, master challenging middle-grade vocabulary, and ace dual-variant British &amp; American spelling challenges.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartContinue}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLaunchSpelling}
                className="px-5 py-3 rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-amber-400" />
                <span>Spelling Challenge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Stat Pill Cluster (Prompt Section 5 sample format) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400 shrink-0">
            ⭐
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {progress.points} Points
            </div>
            <div className="text-xs text-slate-400">Total score earned</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400 shrink-0">
            🔥
          </div>
          <div>
            <div className="text-2xl font-extrabold text-orange-400 tabular-nums">
              {progress.currentStreak}-Day Streak
            </div>
            <div className="text-xs text-slate-400">Best streak: {progress.bestStreak}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400 shrink-0">
            📚
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {progress.storiesCompleted.length} Completed
            </div>
            <div className="text-xs text-slate-400">of {STORIES.length} adventures</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400 shrink-0">
            👑
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {progress.wordsMastered.length} Mastered
            </div>
            <div className="text-xs text-slate-400">{VOCABULARY_LIST.length} total words</div>
          </div>
        </div>
      </div>

      {/* Main Exploration Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Featured Adventure Story */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
              <span className="text-amber-400 uppercase tracking-wider font-bold">Featured Story Adventure</span>
              <span className="capitalize">{featuredStory.difficulty}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              {featuredStory.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {featuredStory.summary}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 font-medium">Vocabulary Highlights:</span>
              {featuredStory.vocabularyIds.slice(0, 4).map(vId => {
                const word = VOCABULARY_LIST.find(v => v.id === vId);
                if (!word) return null;
                const sp = isUK ? word.british : word.american;
                return (
                  <span
                    key={vId}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 font-mono"
                  >
                    {sp}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isUK ? '🇬🇧 Testing British English' : '🇺🇸 Testing American English'}
            </span>
            <button
              onClick={() => {
                setSelectedStoryId(featuredStory.id);
                setActiveTab('stories');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Read Chapter 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Quick Learning Modules */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-base font-extrabold text-white mb-4">
              Quick Learning Modules
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setActiveSpellingMode('direct');
                  setActiveTab('spelling');
                }}
                className="w-full text-left p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 transition-colors cursor-pointer flex items-center gap-3"
              >
                <span className="text-xl">✏️</span>
                <div>
                  <div className="text-sm font-bold text-white">Spelling Challenge</div>
                  <div className="text-xs text-slate-400">Type words &amp; receive instant validation</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveSpellingMode('listen_spell');
                  setActiveTab('spelling');
                }}
                className="w-full text-left p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 transition-colors cursor-pointer flex items-center gap-3"
              >
                <span className="text-xl">🎧</span>
                <div>
                  <div className="text-sm font-bold text-white">Listen &amp; Spell</div>
                  <div className="text-xs text-slate-400">Audio pronunciations in UK/US accents</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('vocabulary')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 transition-colors cursor-pointer flex items-center gap-3"
              >
                <span className="text-xl">🧠</span>
                <div>
                  <div className="text-sm font-bold text-white">Vocabulary Vault</div>
                  <div className="text-xs text-slate-400">Dictionary definitions &amp; spelling rules</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 transition-colors cursor-pointer flex items-center gap-3"
              >
                <span className="text-xl">🔄</span>
                <div>
                  <div className="text-sm font-bold text-white">Compare UK vs US</div>
                  <div className="text-xs text-slate-400">Side-by-side rules &amp; sorting game</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Progress Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
