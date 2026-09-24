/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { StoriesScreen } from './components/StoriesScreen';
import { SpellingHub } from './components/SpellingHub';
import { VocabularyVault } from './components/VocabularyVault';
import { CompareLaboratory } from './components/CompareLaboratory';
import { AchievementsScreen } from './components/AchievementsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Award, X, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    newUnlockedAchievement, 
    clearUnlockedAchievement, 
    languageVariant 
  } = useApp();

  const isUK = languageVariant === 'british';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Global Navigation Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'stories' && <StoriesScreen />}
        {activeTab === 'spelling' && <SpellingHub />}
        {activeTab === 'vocabulary' && <VocabularyVault />}
        {activeTab === 'compare' && <CompareLaboratory />}
        {activeTab === 'achievements' && <AchievementsScreen />}
        {activeTab === 'progress' && <ProgressScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Achievement Unlocked Toast Banner */}
      {newUnlockedAchievement && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 flex items-center gap-3 max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xl flex items-center justify-center shrink-0">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Achievement Unlocked!</span>
              </div>
              <div className="text-sm font-extrabold text-white truncate">
                {newUnlockedAchievement}
              </div>
            </div>
            <button
              onClick={clearUnlockedAchievement}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Dismiss achievement notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">LexiQuest</span>
            <span>·</span>
            <span>Educational Storytelling &amp; Spelling for Young Explorers</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Active Mode: <strong className="text-slate-200">{isUK ? '🇬🇧 British English' : '🇺🇸 American English'}</strong>
            </span>
            <span>·</span>
            <span>Ages 10–12</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-slate-400">
          <span className="text-slate-300 font-medium">created by TEMITOPE ABOLUWARIN, PHONE NUMBER: 08166102920</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
