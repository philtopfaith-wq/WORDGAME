import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-spelling',
    title: 'First Word Spelled',
    description: 'Spell your very first word correctly in any mode.',
    icon: '✏️',
    category: 'spelling',
    targetCount: 1,
    getProgress: (p) => {
      const correctCount = Object.values(p.wordsPracticed).reduce((acc, curr) => acc + (curr.correct > 0 ? 1 : 0), 0);
      return Math.min(1, correctCount);
    },
  },
  {
    id: 'spelling-apprentice',
    title: 'Spelling Apprentice',
    description: 'Correctly spell 5 different vocabulary words.',
    icon: '🌟',
    category: 'spelling',
    targetCount: 5,
    getProgress: (p) => {
      const count = Object.values(p.wordsPracticed).reduce((acc, curr) => acc + (curr.correct > 0 ? 1 : 0), 0);
      return Math.min(5, count);
    },
  },
  {
    id: 'spelling-champion',
    title: 'Lexicon Champion',
    description: 'Correctly spell 10 different vocabulary words.',
    icon: '🏆',
    category: 'spelling',
    targetCount: 10,
    getProgress: (p) => {
      const count = Object.values(p.wordsPracticed).reduce((acc, curr) => acc + (curr.correct > 0 ? 1 : 0), 0);
      return Math.min(10, count);
    },
  },
  {
    id: 'first-story',
    title: 'Adventure Reader',
    description: 'Complete reading your first adventure story.',
    icon: '📚',
    category: 'reading',
    targetCount: 1,
    getProgress: (p) => Math.min(1, p.storiesCompleted.length),
  },
  {
    id: 'all-stories',
    title: 'Grand Archivist',
    description: 'Read and complete all stories in the library.',
    icon: '🏛️',
    category: 'reading',
    targetCount: 3,
    getProgress: (p) => Math.min(3, p.storiesCompleted.length),
  },
  {
    id: 'streak-five',
    title: 'Hot Streak',
    description: 'Achieve a winning streak of 5 consecutive correct spellings.',
    icon: '🔥',
    category: 'streak',
    targetCount: 5,
    getProgress: (p) => Math.min(5, p.bestStreak),
  },
  {
    id: 'streak-ten',
    title: 'Unstoppable Momentum',
    description: 'Achieve a winning streak of 10 consecutive correct spellings.',
    icon: '⚡',
    category: 'streak',
    targetCount: 10,
    getProgress: (p) => Math.min(10, p.bestStreak),
  },
  {
    id: 'variant-diplomat',
    title: 'Transatlantic Diplomat',
    description: 'Successfully complete questions in both British AND American English.',
    icon: '🌐',
    category: 'variants',
    targetCount: 2,
    getProgress: (p) => {
      const ukDone = p.britishStats.correct > 0 ? 1 : 0;
      const usDone = p.americanStats.correct > 0 ? 1 : 0;
      return ukDone + usDone;
    },
  },
  {
    id: 'words-mastered',
    title: 'Word Mastery',
    description: 'Achieve mastery on 3 different vocabulary words.',
    icon: '👑',
    category: 'mastery',
    targetCount: 3,
    getProgress: (p) => Math.min(3, p.wordsMastered.length),
  },
  {
    id: 'point-collector',
    title: 'Century Explorer',
    description: 'Accumulate 100 points through spelling and story reading.',
    icon: '⭐',
    category: 'spelling',
    targetCount: 100,
    getProgress: (p) => Math.min(100, p.points),
  },
];
