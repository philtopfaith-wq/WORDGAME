export type LanguageVariant = 'british' | 'american';

export type NavigationTab = 
  | 'home' 
  | 'stories' 
  | 'spelling' 
  | 'vocabulary' 
  | 'compare' 
  | 'achievements' 
  | 'progress' 
  | 'settings';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface VocabularyWord {
  id: string;
  concept: string;
  british: string;
  american: string;
  hasVariantDifference: boolean;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms?: string[];
  phoneticsBritish?: string;
  phoneticsAmerican?: string;
  spellingRuleExplanation?: string;
  difficulty: DifficultyLevel;
  hints: [string, string, string]; // [Pattern/Etymology, Letter count/structure, Mask e.g. C _ L O U R]
  storyId?: string;
  category: string;
  icon: string;
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StorySection {
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  highlightVocabularyIds: string[];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  coverImage: string;
  summary: string;
  sections: StorySection[];
  vocabularyIds: string[];
  comprehensionQuestions: ComprehensionQuestion[];
}

export type SpellingMode = 
  | 'direct' 
  | 'story_vocab' 
  | 'contextual' 
  | 'picture_clue' 
  | 'missing_letters' 
  | 'listen_spell' 
  | 'challenge';

export interface SpellingQuestion {
  id: string;
  mode: SpellingMode;
  wordId: string;
  concept: string;
  british: string;
  american: string;
  prompt: string;
  contextSentence?: string;
  missingLettersMask?: string;
  difficulty: DifficultyLevel;
  storyTitle?: string;
  icon: string;
}

export interface ValidationFeedback {
  isCorrect: boolean;
  isOtherVariant: boolean;
  inputNormalized: string;
  expectedWord: string;
  otherVariantWord: string;
  hasVariantDifference: boolean;
  activeVariant: LanguageVariant;
  title: string;
  message: string;
  comparisonNote?: string;
}

export interface UserProgress {
  points: number;
  stars: number;
  currentStreak: number;
  bestStreak: number;
  storiesCompleted: string[];
  wordsMastered: string[];
  wordsPracticed: Record<string, { attempts: number; correct: number; lastPracticed: number }>;
  britishStats: { attempted: number; correct: number };
  americanStats: { attempted: number; correct: number };
  unlockedAchievements: string[];
  recentSessions: Array<{
    id: string;
    timestamp: number;
    mode: string;
    variant: LanguageVariant;
    score: number;
    total: number;
  }>;
}

export interface AppSettings {
  languageVariant: LanguageVariant;
  soundEnabled: boolean;
  ttsRate: number;
  reducedMotion: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'spelling' | 'reading' | 'streak' | 'variants' | 'mastery';
  targetCount: number;
  getProgress: (progress: UserProgress) => number;
}
