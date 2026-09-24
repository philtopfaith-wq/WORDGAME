import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { 
  Sparkles, 
  Flame, 
  Menu, 
  X, 
  ArrowRightLeft,
  Settings as SettingsIcon,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    languageVariant, 
    setLanguageVariant, 
    progress,
    setSelectedStoryId 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUK = languageVariant === 'british';

  const navItems: Array<{ id: NavigationTab; label: string; iconEmoji: string }> = [
    { id: 'home', label: 'Home', iconEmoji: '🏠' },
    { id: 'stories', label: 'Stories', iconEmoji: '📚' },
    { id: 'spelling', label: 'Spelling', iconEmoji: '✏️' },
    { id: 'vocabulary', label: 'Vocabulary', iconEmoji: '🧠' },
    { id: 'compare', label: 'Compare UK/US', iconEmoji: '🔄' },
    { id: 'achievements', label: 'Badges', iconEmoji: '🏆' },
    { id: 'progress', label: 'Progress', iconEmoji: '📊' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab !== 'stories') {
      setSelectedStoryId(null);
    }
    setMobileMenuOpen(false);
  };

  const toggleVariant = () => {
    setLanguageVariant(isUK ? 'american' : 'british');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md py-1"
        >
          <span className="text-amber-400">LexiQuest</span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  isActive
                    ? 'bg-slate-800 text-amber-300 font-semibold shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span aria-hidden="true">{item.iconEmoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Variant Switch Button */}
          <button
            onClick={toggleVariant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            title={`Currently in ${isUK ? 'British' : 'American'} English. Click to switch.`}
            aria-label={`Language variant is ${isUK ? 'British English' : 'American English'}. Click to toggle.`}
          >
            <span className="text-base leading-none" aria-hidden="true">{isUK ? '🇬🇧' : '🇺🇸'}</span>
            <span className="hidden sm:inline">{isUK ? 'British' : 'American'}</span>
            <ArrowRightLeft className="w-3 h-3 text-amber-400" />
          </button>

          {/* Points indicator */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tabular-nums"
            title={`${progress.points} Points Earned`}
            aria-label={`${progress.points} points`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>{progress.points}</span>
          </div>

          {/* Streak indicator */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tabular-nums"
            title={`${progress.currentStreak} Current Streak`}
            aria-label={`${progress.currentStreak} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{progress.currentStreak}</span>
          </div>

          {/* Settings icon */}
          <button
            onClick={() => handleNavClick('settings')}
            className={`p-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              activeTab === 'settings' 
                ? 'bg-slate-800 text-amber-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Settings & Test Suite"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <div className="p-3 bg-slate-800/80 rounded-xl mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{isUK ? '🇬🇧' : '🇺🇸'}</span>
              <div>
                <div className="text-xs text-slate-400">Active English Variant</div>
                <div className="text-sm font-bold text-white">{isUK ? 'British English' : 'American English'}</div>
              </div>
            </div>
            <button
              onClick={toggleVariant}
              className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
            >
              Switch to {isUK ? 'American' : 'British'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg">{item.iconEmoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
