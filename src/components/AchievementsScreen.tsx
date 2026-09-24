import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { VariantBanner } from './VariantBanner';
import { Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { progress, languageVariant } = useApp();

  const unlockedCount = progress.unlockedAchievements.length;
  const isUK = languageVariant === 'british';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explorer Badges &amp; Achievements
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Unlock prestigious medals as you conquer spelling challenges and reading adventures.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-300 font-bold self-start">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{unlockedCount} of {ACHIEVEMENTS.length} Badges Unlocked</span>
          </div>
        </div>
      </div>

      <VariantBanner activityTitle="Achievements & Badges" />

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = progress.unlockedAchievements.includes(ach.id);
          const currentCount = ach.getProgress(progress);
          const percent = Math.min(100, Math.round((currentCount / ach.targetCount) * 100));

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isUnlocked
                  ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none ${
                    isUnlocked ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}>
                    {isUnlocked ? ach.icon : '🔒'}
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar towards Unlock */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>Progress</span>
                  <span className="tabular-nums font-semibold text-slate-200">{currentCount} / {ach.targetCount}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-amber-400' : 'bg-slate-600'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
