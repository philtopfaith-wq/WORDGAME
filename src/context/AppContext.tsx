import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageVariant, 
  NavigationTab, 
  SpellingMode, 
  UserProgress, 
  AppSettings 
} from '../types';
import { sound } from '../utils/audio';
import { ACHIEVEMENTS } from '../data/achievements';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  languageVariant: LanguageVariant;
  setLanguageVariant: (variant: LanguageVariant) => void;
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
  activeSpellingMode: SpellingMode;
  setActiveSpellingMode: (mode: SpellingMode) => void;
  spellingFilterStoryId: string | null;
  setSpellingFilterStoryId: (id: string | null) => void;
  progress: UserProgress;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  recordSpellingAttempt: (wordId: string, isCorrect: boolean, variant: LanguageVariant) => void;
  recordStoryCompleted: (storyId: string) => void;
  resetAllProgress: () => void;
  newUnlockedAchievement: string | null;
  clearUnlockedAchievement: () => void;
  startStorySpellingChallenge: (storyId: string) => void;
}

const STORAGE_PROGRESS_KEY = 'lexiquest_progress_v1';
const STORAGE_SETTINGS_KEY = 'lexiquest_settings_v1';

const defaultProgress: UserProgress = {
  points: 40,
  stars: 4,
  currentStreak: 2,
  bestStreak: 3,
  storiesCompleted: [],
  wordsMastered: [],
  wordsPracticed: {},
  britishStats: { attempted: 4, correct: 3 },
  americanStats: { attempted: 2, correct: 2 },
  unlockedAchievements: ['first-spelling'],
  recentSessions: [
    {
      id: 'session-demo',
      timestamp: Date.now() - 3600000 * 2,
      mode: 'direct',
      variant: 'british',
      score: 30,
      total: 3,
    },
  ],
};

const defaultSettings: AppSettings = {
  languageVariant: 'british',
  soundEnabled: true,
  ttsRate: 0.95,
  reducedMotion: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [activeSpellingMode, setActiveSpellingMode] = useState<SpellingMode>('direct');
  const [spellingFilterStoryId, setSpellingFilterStoryId] = useState<string | null>(null);
  const [newUnlockedAchievement, setNewUnlockedAchievement] = useState<string | null>(null);

  // Load Settings from LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
        if (saved) {
          return { ...defaultSettings, ...JSON.parse(saved) };
        }
      }
    } catch {
      // Local storage unavailable
    }
    return defaultSettings;
  });

  // Load Progress from LocalStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
        if (saved) {
          return { ...defaultProgress, ...JSON.parse(saved) };
        }
      }
    } catch {
      // Local storage unavailable
    }
    return defaultProgress;
  });

  // Keep sound effects synced with settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist settings
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      }
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Persist progress
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
      }
    } catch {
      // Ignore storage errors
    }
  }, [progress]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setLanguageVariant = (variant: LanguageVariant) => {
    updateSettings({ languageVariant: variant });
  };

  const checkNewAchievements = (updatedProgress: UserProgress) => {
    for (const achievement of ACHIEVEMENTS) {
      if (!updatedProgress.unlockedAchievements.includes(achievement.id)) {
        const progressCount = achievement.getProgress(updatedProgress);
        if (progressCount >= achievement.targetCount) {
          updatedProgress.unlockedAchievements.push(achievement.id);
          setNewUnlockedAchievement(achievement.title);
          sound.playFanfare();
        }
      }
    }
  };

  const recordSpellingAttempt = (wordId: string, isCorrect: boolean, variant: LanguageVariant) => {
    setProgress(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const pointsDelta = isCorrect ? 15 + Math.min(newStreak * 2, 20) : 0;
      const starsDelta = isCorrect && newStreak % 3 === 0 ? 1 : 0;

      // Update wordsPracticed
      const existingPractice = prev.wordsPracticed[wordId] || { attempts: 0, correct: 0, lastPracticed: 0 };
      const updatedPractice = {
        attempts: existingPractice.attempts + 1,
        correct: existingPractice.correct + (isCorrect ? 1 : 0),
        lastPracticed: Date.now(),
      };

      // Check mastery (at least 2 correct and accuracy >= 66%)
      const wordsMastered = [...prev.wordsMastered];
      if (updatedPractice.correct >= 2 && !wordsMastered.includes(wordId)) {
        wordsMastered.push(wordId);
      }

      // Update variant accuracy
      const britishStats = { ...prev.britishStats };
      const americanStats = { ...prev.americanStats };

      if (variant === 'british') {
        britishStats.attempted += 1;
        if (isCorrect) britishStats.correct += 1;
      } else {
        americanStats.attempted += 1;
        if (isCorrect) americanStats.correct += 1;
      }

      const nextProgress: UserProgress = {
        ...prev,
        points: prev.points + pointsDelta,
        stars: prev.stars + starsDelta,
        currentStreak: newStreak,
        bestStreak,
        wordsPracticed: {
          ...prev.wordsPracticed,
          [wordId]: updatedPractice,
        },
        wordsMastered,
        britishStats,
        americanStats,
      };

      checkNewAchievements(nextProgress);
      return nextProgress;
    });
  };

  const recordStoryCompleted = (storyId: string) => {
    setProgress(prev => {
      if (prev.storiesCompleted.includes(storyId)) {
        return prev;
      }
      const nextStories = [...prev.storiesCompleted, storyId];
      const nextProgress: UserProgress = {
        ...prev,
        points: prev.points + 50,
        stars: prev.stars + 2,
        storiesCompleted: nextStories,
      };
      checkNewAchievements(nextProgress);
      sound.playFanfare();
      return nextProgress;
    });
  };

  const resetAllProgress = () => {
    const cleanProgress: UserProgress = {
      points: 0,
      stars: 0,
      currentStreak: 0,
      bestStreak: 0,
      storiesCompleted: [],
      wordsMastered: [],
      wordsPracticed: {},
      britishStats: { attempted: 0, correct: 0 },
      americanStats: { attempted: 0, correct: 0 },
      unlockedAchievements: [],
      recentSessions: [],
    };
    setProgress(cleanProgress);
    try {
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
    } catch {
      // Ignore
    }
  };

  const startStorySpellingChallenge = (storyId: string) => {
    setSpellingFilterStoryId(storyId);
    setActiveSpellingMode('story_vocab');
    setActiveTab('spelling');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        languageVariant: settings.languageVariant,
        setLanguageVariant,
        selectedStoryId,
        setSelectedStoryId,
        activeSpellingMode,
        setActiveSpellingMode,
        spellingFilterStoryId,
        setSpellingFilterStoryId,
        progress,
        settings,
        updateSettings,
        recordSpellingAttempt,
        recordStoryCompleted,
        resetAllProgress,
        newUnlockedAchievement,
        clearUnlockedAchievement: () => setNewUnlockedAchievement(null),
        startStorySpellingChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
