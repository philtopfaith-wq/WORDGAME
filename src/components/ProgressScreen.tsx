import React from 'react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { STORIES } from '../data/stories';
import { VariantBanner } from './VariantBanner';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';

export const ProgressScreen: React.FC = () => {
  const { progress, languageVariant } = useApp();

  const ukAttempted = progress.britishStats.attempted;
  const ukCorrect = progress.britishStats.correct;
  const ukAccuracy = ukAttempted > 0 ? Math.round((ukCorrect / ukAttempted) * 100) : 0;

  const usAttempted = progress.americanStats.attempted;
  const usCorrect = progress.americanStats.correct;
  const usAccuracy = usAttempted > 0 ? Math.round((usCorrect / usAttempted) * 100) : 0;

  const totalWordsPracticedCount = Object.keys(progress.wordsPracticed).length;
  const masteredWordsList = VOCABULARY_LIST.filter(v => progress.wordsMastered.includes(v.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Learning Progress &amp; Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed metrics tracking your vocabulary mastery, stories read, and dual-variant spelling accuracy.
        </p>
      </div>

      <VariantBanner activityTitle="Progress Dashboard" />

      {/* Global Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Points</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-2">
            {progress.points}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across stories & quizzes
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Winning Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-orange-400 tabular-nums mt-2 flex items-center gap-1">
            <span>{progress.currentStreak}</span>
            <span className="text-xs text-slate-400 font-normal">/ best {progress.bestStreak}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Consecutive correct
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Stories Read</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-2">
            {progress.storiesCompleted.length} <span className="text-xs text-slate-500 font-normal">/ {STORIES.length}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Adventure chapters
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Words Mastered</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums mt-2">
            {progress.wordsMastered.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalWordsPracticedCount} practiced
          </div>
        </div>
      </div>

      {/* CRITICAL: SEPARATED BRITISH VS AMERICAN ENGLISH STATS (Section 27) */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>Dual-Variant Spelling Performance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* British English Stats Card */}
          <div className="bg-slate-900 border border-blue-900/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <h3 className="text-base font-bold text-white">British English</h3>
                  <div className="text-xs text-blue-300">Targeting -our, -re, -ise, and -ll- spellings</div>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-blue-400 tabular-nums">
                {ukAccuracy}%
              </div>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${ukAccuracy}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-slate-400">Questions Attempted</div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">{ukAttempted}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-slate-400">Correct Answers</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">{ukCorrect}</div>
              </div>
            </div>
          </div>

          {/* American English Stats Card */}
          <div className="bg-slate-900 border border-red-900/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <h3 className="text-base font-bold text-white">American English</h3>
                  <div className="text-xs text-red-300">Targeting -or, -er, -ize, and -l- spellings</div>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-red-400 tabular-nums">
                {usAccuracy}%
              </div>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${usAccuracy}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-slate-400">Questions Attempted</div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">{usAttempted}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-slate-400">Correct Answers</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">{usCorrect}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Words Mastered Collection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Mastered Vocabulary ({masteredWordsList.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Earned by answering correctly $\ge 2$ times
          </span>
        </div>

        {masteredWordsList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {masteredWordsList.map(w => (
              <div
                key={w.id}
                className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2.5"
              >
                <span className="text-xl select-none" aria-hidden="true">{w.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {languageVariant === 'british' ? w.british : w.american}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mastered
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-sm bg-slate-850 rounded-xl">
            No words mastered yet. Practice spelling in the Spelling Lab to achieve mastery!
          </div>
        )}
      </div>

      {/* Completed Stories List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Completed Adventures ({progress.storiesCompleted.length}/{STORIES.length})</span>
        </h2>

        <div className="space-y-3">
          {STORIES.map(s => {
            const isCompleted = progress.storiesCompleted.includes(s.id);
            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-850 border-emerald-800/50'
                    : 'bg-slate-850/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.genre} · {s.difficulty}</div>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {isCompleted ? (
                    <span className="text-emerald-400">Completed (+50 pts)</span>
                  ) : (
                    <span className="text-slate-500">Not read yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
