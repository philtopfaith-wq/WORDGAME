import React, { useState, useEffect, useRef } from 'react';
import { 
  SpellingMode, 
  VocabularyWord, 
  LanguageVariant, 
  ValidationFeedback 
} from '../types';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { STORIES } from '../data/stories';
import { validateSpelling } from '../utils/spellingEngine';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { VariantBanner } from './VariantBanner';
import { 
  Volume2, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Award,
  AlertTriangle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface SpellingExerciseProps {
  initialMode?: SpellingMode;
  storyId?: string | null;
  onExit?: () => void;
}

export const SpellingExercise: React.FC<SpellingExerciseProps> = ({
  initialMode = 'direct',
  storyId = null,
  onExit,
}) => {
  const { 
    languageVariant, 
    recordSpellingAttempt, 
    progress 
  } = useApp();

  const [mode, setMode] = useState<SpellingMode>(initialMode);
  const [questionList, setQuestionList] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0); // 0, 1, 2, 3
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [sessionResults, setSessionResults] = useState<Array<{
    word: VocabularyWord;
    input: string;
    isCorrect: boolean;
    isOtherVariant: boolean;
  }>>([]);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isUK = languageVariant === 'british';

  // Build the list of target words according to mode and story filter
  useEffect(() => {
    let pool = [...VOCABULARY_LIST];

    if (storyId) {
      const story = STORIES.find(s => s.id === storyId);
      if (story) {
        pool = VOCABULARY_LIST.filter(v => story.vocabularyIds.includes(v.id));
      }
    } else if (mode === 'challenge') {
      pool = VOCABULARY_LIST.filter(v => v.difficulty === 'advanced' || v.hasVariantDifference);
    } else if (mode === 'missing_letters') {
      pool = VOCABULARY_LIST.filter(v => v.hints[2] && v.hints[2].includes('_'));
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestionList(shuffled.length > 0 ? shuffled : VOCABULARY_LIST.slice(0, 5));
    setCurrentIndex(0);
    setUserInput('');
    setHintsRevealed(0);
    setFeedback(null);
    setSessionResults([]);
    setIsFinished(false);
  }, [mode, storyId, languageVariant]);

  const currentWord = questionList[currentIndex];

  useEffect(() => {
    if (inputRef.current && !feedback && !isFinished) {
      inputRef.current.focus();
    }
  }, [currentIndex, feedback, isFinished]);

  // If in Listen & Spell mode, pronounce automatically on new word
  useEffect(() => {
    if (mode === 'listen_spell' && currentWord && !feedback) {
      const targetSpelling = isUK ? currentWord.british : currentWord.american;
      speech.speak(targetSpelling, languageVariant);
    }
  }, [currentIndex, mode, currentWord, isUK, languageVariant, feedback]);

  if (!currentWord && !isFinished) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center text-slate-300">
        <p>Loading questions...</p>
      </div>
    );
  }

  const handlePronounce = () => {
    if (!currentWord) return;
    sound.playTap();
    const targetSpelling = isUK ? currentWord.british : currentWord.american;
    speech.speak(targetSpelling, languageVariant);
  };

  const handleRevealHint = () => {
    if (hintsRevealed < 3) {
      sound.playTap();
      setHintsRevealed(prev => prev + 1);
    }
  };

  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWord || feedback) return;

    const result = validateSpelling(
      userInput,
      currentWord.british,
      currentWord.american,
      languageVariant
    );

    setFeedback(result);

    if (result.isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    recordSpellingAttempt(currentWord.id, result.isCorrect, languageVariant);

    setSessionResults(prev => [
      ...prev,
      {
        word: currentWord,
        input: userInput,
        isCorrect: result.isCorrect,
        isOtherVariant: result.isOtherVariant,
      },
    ]);
  };

  const handleNextWord = () => {
    sound.playTap();
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setHintsRevealed(0);
      setFeedback(null);
    } else {
      setIsFinished(true);
      sound.playFanfare();
    }
  };

  const handleRestartSession = () => {
    sound.playTap();
    const shuffled = [...VOCABULARY_LIST].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestionList(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setHintsRevealed(0);
    setFeedback(null);
    setSessionResults([]);
    setIsFinished(false);
  };

  const modeDescriptions: Record<SpellingMode, { title: string; subtitle: string; icon: string }> = {
    direct: { title: 'Direct Spelling', subtitle: 'Type the accurate spelling for this vocabulary concept.', icon: '✏️' },
    story_vocab: { title: 'Story Vocabulary Challenge', subtitle: 'Master the words discovered in your recent story adventures.', icon: '📚' },
    contextual: { title: 'Contextual Sentence Spelling', subtitle: 'Fill in the blank using the story sentence clue.', icon: '📖' },
    picture_clue: { title: 'Thematic Clue Challenge', subtitle: 'Examine the concept icon, definition, and clues to spell the word.', icon: '🎨' },
    missing_letters: { title: 'Missing Letters Puzzle', subtitle: 'Fill in the missing vowels and consonants.', icon: '🧩' },
    listen_spell: { title: 'Listen & Spell Audio Mode', subtitle: 'Listen to the native pronunciation carefully and type the word.', icon: '🎧' },
    challenge: { title: 'Challenge Round', subtitle: 'Master tricky words with silent letters, double consonants, and variant shifts.', icon: '⚡' },
  };

  // ----------------------------------------------------
  // ROUND SUMMARY VIEW
  // ----------------------------------------------------
  if (isFinished) {
    const correctCount = sessionResults.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / sessionResults.length) * 100);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <VariantBanner activityTitle="Session Complete" />

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl flex items-center justify-center mx-auto mb-4">
            🏆
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            {isUK ? '🇬🇧 British English Session' : '🇺🇸 American English Session'}
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Spelling Results
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Great job! Review your performance and vocabulary distinctions below.
          </p>

          {/* Stats Cluster */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums mt-0.5">
                {correctCount * 15}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Accuracy</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums mt-0.5">
                {accuracy}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Streak</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 tabular-nums mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400" />
                <span>{progress.currentStreak}</span>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Words Reviewed ({isUK ? '🇬🇧 British English' : '🇺🇸 American English'})
            </h3>
            <div className="space-y-2">
              {sessionResults.map((r, idx) => {
                const targetSpelling = isUK ? r.word.british : r.word.american;
                const otherSpelling = isUK ? r.word.american : r.word.british;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-sm ${
                      r.isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                        : 'bg-red-950/20 border-red-800/60 text-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {r.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{targetSpelling}</span>
                          <span className="text-xs font-normal text-slate-400">
                            (Your answer: <span className={r.isCorrect ? 'text-emerald-300' : 'text-red-300'}>{r.input || '(blank)'}</span>)
                          </span>
                        </div>
                        {r.word.hasVariantDifference && (
                          <div className="text-xs text-amber-300/90 mt-0.5">
                            🇬🇧 British: <strong>{r.word.british}</strong> · 🇺🇸 American: <strong>{r.word.american}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => speech.speak(targetSpelling, languageVariant)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleRestartSession}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Round</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
              >
                Back to Spelling Hub
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ACTIVE QUESTION VIEW
  // ----------------------------------------------------
  const targetSpelling = isUK ? currentWord.british : currentWord.american;
  const currentModeInfo = modeDescriptions[mode];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Explicit Variant Banner */}
      <VariantBanner activityTitle={currentModeInfo.title} />

      {/* Main Exercise Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Question Header & Progress Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-base">{currentModeInfo.icon}</span>
            <span className="font-bold text-slate-300 uppercase tracking-wider">{currentModeInfo.title}</span>
          </div>
          <div className="tabular-nums font-semibold">
            Word {currentIndex + 1} of {questionList.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questionList.length) * 100}%` }}
          />
        </div>

        {/* Challenge Prompt Area */}
        <div className="text-center py-4">
          <div className="text-4xl mb-3 select-none" aria-hidden="true">
            {currentWord.icon}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            {isUK ? '🇬🇧 British English Challenge' : '🇺🇸 American English Challenge'}
          </div>

          {/* Mode 1 & 6: Direct / Audio prompt */}
          {mode === 'direct' && (
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Spell this word: <span className="text-amber-300">"{currentWord.concept}"</span>
            </h2>
          )}

          {mode === 'listen_spell' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                🎧 Listen carefully and type the word
              </h2>
              <button
                onClick={handlePronounce}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-sm font-bold transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat Pronunciation ({isUK ? 'British' : 'American'})</span>
              </button>
            </div>
          )}

          {/* Mode 3: Contextual Sentence */}
          {mode === 'contextual' && (
            <div className="max-w-lg mx-auto">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">
                Complete the missing word:
              </div>
              <p className="text-base sm:text-lg text-slate-100 italic bg-slate-850 p-4 rounded-xl border border-slate-800">
                "{currentWord.exampleSentence.replace(new RegExp(targetSpelling, 'gi'), '______')}"
              </p>
            </div>
          )}

          {/* Mode 4: Picture / Thematic Clue */}
          {mode === 'picture_clue' && (
            <div className="max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                What word matches this clue?
              </h2>
              <p className="text-sm text-slate-300 bg-slate-850 p-3 rounded-xl border border-slate-800">
                "{currentWord.definition}"
              </p>
            </div>
          )}

          {/* Mode 5: Missing Letters */}
          {mode === 'missing_letters' && (
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">
                Fill in the letters:
              </div>
              <div className="text-2xl sm:text-3xl font-mono tracking-widest font-extrabold text-amber-300 bg-slate-850 py-3 px-6 rounded-xl border border-slate-800 inline-block">
                {currentWord.hints[2]}
              </div>
            </div>
          )}

          {/* Mode 7: Challenge round */}
          {mode === 'challenge' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Tricky Word Challenge
              </h2>
              <p className="text-sm text-slate-300">
                Definition: {currentWord.definition}
              </p>
            </div>
          )}

          {/* Audio Pronunciation Button (available across all modes) */}
          {mode !== 'listen_spell' && (
            <div className="mt-3">
              <button
                onClick={handlePronounce}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-slate-800"
                title={`Hear pronunciation in ${isUK ? 'British English' : 'American English'}`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Hear Pronunciation ({isUK ? 'UK' : 'US'})</span>
              </button>
            </div>
          )}
        </div>

        {/* Spelling Input Form */}
        <form onSubmit={handleSubmitAnswer} className="mt-6">
          <div className="relative max-w-md mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={feedback !== null}
              placeholder="Type your spelling here..."
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full px-4 py-3.5 bg-slate-850 border-2 border-slate-700 rounded-xl text-center text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Hint Reveal System */}
          <div className="mt-4 flex flex-col items-center">
            {hintsRevealed < 3 && !feedback && (
              <button
                type="button"
                onClick={handleRevealHint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Need a hint? ({hintsRevealed}/3 used)</span>
              </button>
            )}

            {/* Revealed hints list */}
            {hintsRevealed > 0 && (
              <div className="mt-3 w-full max-w-md space-y-1.5 text-xs">
                {hintsRevealed >= 1 && (
                  <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-slate-300">
                    <strong className="text-amber-400">Hint 1:</strong> {currentWord.hints[0]}
                  </div>
                )}
                {hintsRevealed >= 2 && (
                  <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-slate-300">
                    <strong className="text-amber-400">Hint 2:</strong> {currentWord.hints[1]}
                  </div>
                )}
                {hintsRevealed >= 3 && (
                  <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-amber-300 font-mono tracking-wider">
                    <strong className="text-amber-400 font-sans">Hint 3:</strong> {currentWord.hints[2]}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {!feedback ? (
            <div className="mt-6 flex items-center justify-center">
              <button
                type="submit"
                disabled={!userInput.trim()}
                className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  userInput.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Check Spelling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </form>

        {/* FEEDBACK DISPLAY (Strict Section 13, 14 requirements) */}
        {feedback && (
          <div className="mt-6 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`p-5 rounded-xl border ${
                feedback.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-700 text-emerald-100'
                  : feedback.isOtherVariant
                  ? 'bg-amber-950/30 border-amber-700 text-amber-100'
                  : 'bg-red-950/30 border-red-700 text-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : feedback.isOtherVariant ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      {feedback.title}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700">
                      {isUK ? '🇬🇧 British English' : '🇺🇸 American English'}
                    </span>
                  </div>

                  <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">
                    {feedback.message}
                  </p>

                  {/* If user typed the valid spelling from the other variant, explain clearly */}
                  {feedback.isOtherVariant && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-900/70 border border-amber-800/60 text-xs text-amber-200 space-y-1">
                      <div>Your input: <strong className="text-white">"{userInput}"</strong></div>
                      <div>Expected: <strong className="text-white">"{targetSpelling}"</strong></div>
                      <div className="pt-1 border-t border-slate-800">
                        🇬🇧 British English: <strong>{currentWord.british}</strong><br />
                        🇺🇸 American English: <strong>{currentWord.american}</strong>
                      </div>
                      <div className="italic text-slate-300 mt-1">
                        "This question is testing {isUK ? 'British English' : 'American English'}."
                      </div>
                    </div>
                  )}

                  {/* If regular incorrect, show expected after failure */}
                  {!feedback.isCorrect && !feedback.isOtherVariant && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-900/70 border border-red-800/60 text-xs text-red-200">
                      Expected spelling ({isUK ? '🇬🇧 British' : '🇺🇸 American'}): <strong className="text-white text-sm">{targetSpelling}</strong>
                    </div>
                  )}

                  {/* Points & Streak notice on correct */}
                  {feedback.isCorrect && (
                    <div className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-3">
                      <span>+15 Points earned!</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                        Streak: {progress.currentStreak}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleNextWord}
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>{currentIndex < questionList.length - 1 ? 'Next Word' : 'See Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
