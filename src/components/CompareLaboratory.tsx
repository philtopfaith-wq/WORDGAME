import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPELLING_PATTERNS, EVERYDAY_VOCAB_PAIRS } from '../data/compareData';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { 
  ArrowRightLeft, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface MiniGameQuestion {
  id: string;
  word: string;
  correctVariant: 'british' | 'american';
  oppositeWord: string;
  ruleExplanation: string;
}

const SORT_QUESTIONS: MiniGameQuestion[] = [
  {
    id: 's1',
    word: 'colour',
    correctVariant: 'british',
    oppositeWord: 'color',
    ruleExplanation: 'British English keeps the "-our" spelling, while American English simplifies to "-or".',
  },
  {
    id: 's2',
    word: 'center',
    correctVariant: 'american',
    oppositeWord: 'centre',
    ruleExplanation: 'American English uses "-er" at the end, while British English preserves the French "-re" (centre).',
  },
  {
    id: 's3',
    word: 'organise',
    correctVariant: 'british',
    oppositeWord: 'organize',
    ruleExplanation: 'British English typically uses "-ise", while American standardises on "-ize".',
  },
  {
    id: 's4',
    word: 'traveling',
    correctVariant: 'american',
    oppositeWord: 'travelling',
    ruleExplanation: 'American English uses a single "l", whereas British English doubles the "ll" before -ing.',
  },
  {
    id: 's5',
    word: 'favorite',
    correctVariant: 'american',
    oppositeWord: 'favourite',
    ruleExplanation: 'American English drops the silent "u" to make "-or" instead of "-our".',
  },
  {
    id: 's6',
    word: 'theatre',
    correctVariant: 'british',
    oppositeWord: 'theater',
    ruleExplanation: 'British English keeps the classical "-re" ending.',
  },
  {
    id: 's7',
    word: 'defense',
    correctVariant: 'american',
    oppositeWord: 'defence',
    ruleExplanation: 'American English uses "s" for defense, whereas British English uses "c" (defence).',
  },
  {
    id: 's8',
    word: 'flashlight',
    correctVariant: 'american',
    oppositeWord: 'torch',
    ruleExplanation: 'In the US it is a "flashlight", while in the UK it is traditionally called a "torch".',
  },
];

export const CompareLaboratory: React.FC = () => {
  const { languageVariant, setLanguageVariant } = useApp();
  const [activeTab, setActiveTab] = useState<'patterns' | 'everyday' | 'game'>('patterns');

  // Mini-game state
  const [gameIndex, setGameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswered, setGameAnswered] = useState<boolean | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'british' | 'american' | null>(null);

  const currentGameQuestion = SORT_QUESTIONS[gameIndex];

  const handleGameGuess = (variant: 'british' | 'american') => {
    if (gameAnswered !== null) return;

    setSelectedVariant(variant);
    const isCorrect = variant === currentGameQuestion.correctVariant;
    setGameAnswered(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      setGameScore(prev => prev + 1);
    } else {
      sound.playIncorrect();
    }
  };

  const handleNextGameQuestion = () => {
    sound.playTap();
    if (gameIndex < SORT_QUESTIONS.length - 1) {
      setGameIndex(prev => prev + 1);
      setGameAnswered(null);
      setSelectedVariant(null);
    } else {
      // Finished
      setGameIndex(0);
      setGameScore(0);
      setGameAnswered(null);
      setSelectedVariant(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header Banner */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>🇬🇧 British vs 🇺🇸 American English</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore the fascinating history, spelling rules, and word pairs that connect and distinguish both varieties.
        </p>
      </div>

      {/* Equality Note */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 flex items-start gap-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Educational Note: </strong>
          Both British English and American English are legitimate, rich, and historically grounded varieties of the English language. Neither is superior or "more correct" — rather, each follows its own standardised conventions.
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 self-start">
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'patterns'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Spelling Patterns & Rules
        </button>
        <button
          onClick={() => setActiveTab('everyday')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'everyday'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Everyday Vocabulary Pairs
        </button>
        <button
          onClick={() => setActiveTab('game')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'game'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Transatlantic Sorting Game
        </button>
      </div>

      {/* TAB 1: SPELLING PATTERNS */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {SPELLING_PATTERNS.map(pat => (
            <div
              key={pat.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">Rule:</span>
                  <span>{pat.patternName}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    🇬🇧 {pat.britishEnding}
                  </span>
                  <span className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800">
                    🇺🇸 {pat.americanEnding}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {pat.explanation}
              </p>

              {/* Side by side comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5 px-3">Meaning / Concept</th>
                      <th className="py-2.5 px-3 text-blue-300">🇬🇧 British English</th>
                      <th className="py-2.5 px-3 text-red-300">🇺🇸 American English</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pat.examples.map((ex, exIdx) => (
                      <tr key={exIdx} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-300 font-medium">{ex.meaning}</td>
                        <td className="py-2.5 px-3 font-bold text-white font-mono">{ex.british}</td>
                        <td className="py-2.5 px-3 font-bold text-white font-mono">{ex.american}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EVERYDAY VOCABULARY PAIRS */}
      {activeTab === 'everyday' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EVERYDAY_VOCAB_PAIRS.map(pair => (
            <div
              key={pair.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  {pair.category}
                </div>
                <h3 className="text-base font-bold text-white mb-3">
                  {pair.concept}
                </h3>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-850 rounded-xl border border-slate-800 mb-3">
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>🇬🇧</span> UK
                    </div>
                    <div className="text-base font-extrabold text-blue-300 font-mono mt-0.5">
                      {pair.british}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>🇺🇸</span> US
                    </div>
                    <div className="text-base font-extrabold text-red-300 font-mono mt-0.5">
                      {pair.american}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  💡 {pair.funFact}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SORTING MINI-GAME */}
      {activeTab === 'game' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-4">
            <span>Transatlantic Sorting Game</span>
            <span>Question {gameIndex + 1} of {SORT_QUESTIONS.length} · Score: {gameScore}</span>
          </div>

          <div className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-1">
            Which English variant uses this spelling?
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-wide py-6 px-4 bg-slate-850 rounded-xl border border-slate-800 my-4 inline-block w-full">
            {currentGameQuestion.word}
          </div>

          {/* Action Buttons: 🇬🇧 British or 🇺🇸 American */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleGameGuess('british')}
              disabled={gameAnswered !== null}
              className={`p-4 rounded-xl border font-bold text-sm flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                gameAnswered !== null && currentGameQuestion.correctVariant === 'british'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                  : gameAnswered !== null && selectedVariant === 'british' && !gameAnswered
                  ? 'bg-red-950/60 border-red-500 text-red-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl">🇬🇧</span>
              <span>British English</span>
            </button>

            <button
              onClick={() => handleGameGuess('american')}
              disabled={gameAnswered !== null}
              className={`p-4 rounded-xl border font-bold text-sm flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                gameAnswered !== null && currentGameQuestion.correctVariant === 'american'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                  : gameAnswered !== null && selectedVariant === 'american' && !gameAnswered
                  ? 'bg-red-950/60 border-red-500 text-red-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl">🇺🇸</span>
              <span>American English</span>
            </button>
          </div>

          {/* Answer Feedback */}
          {gameAnswered !== null && (
            <div className="mt-6 p-4 rounded-xl bg-slate-850 border border-slate-800 text-left animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {gameAnswered ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">Spot on! That is correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">Not quite!</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {currentGameQuestion.ruleExplanation} (Opposite form: <strong className="text-white">{currentGameQuestion.oppositeWord}</strong>).
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNextGameQuestion}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  {gameIndex < SORT_QUESTIONS.length - 1 ? 'Next Question →' : 'Restart Game 🔄'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
