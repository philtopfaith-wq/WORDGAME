import React, { useState, useEffect } from 'react';
import { Story, ComprehensionQuestion, VocabularyWord } from '../types';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';
import { VocabularyModal } from './VocabularyModal';
import { VariantBanner } from './VariantBanner';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Square, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Award
} from 'lucide-react';

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onBack }) => {
  const { 
    languageVariant, 
    recordStoryCompleted, 
    startStorySpellingChallenge,
    progress 
  } = useApp();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [readingPhase, setReadingPhase] = useState<'reading' | 'quiz' | 'completed'>('reading');

  // TTS state
  const [ttsState, setTtsState] = useState<{ speaking: boolean; paused: boolean }>({
    speaking: false,
    paused: false,
  });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isUK = languageVariant === 'british';
  const currentChapter = story.sections[currentChapterIndex];
  const totalChapters = story.sections.length;
  const isAlreadyCompleted = progress.storiesCompleted.includes(story.id);

  // Subscribe to speech updates
  useEffect(() => {
    const unsubscribe = speech.subscribe((status) => {
      setTtsState({ speaking: status.speaking, paused: status.paused });
    });
    return () => {
      speech.stop();
      unsubscribe();
    };
  }, []);

  const handleStartReadAloud = () => {
    sound.playTap();
    if (ttsState.speaking && !ttsState.paused) {
      speech.pause();
    } else if (ttsState.paused) {
      speech.resume();
    } else {
      speech.speak(currentChapter.content, languageVariant);
    }
  };

  const handleStopReadAloud = () => {
    sound.playTap();
    speech.stop();
  };

  const handleNextChapter = () => {
    speech.stop();
    sound.playTap();
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setReadingPhase('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    speech.stop();
    sound.playTap();
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    sound.playTap();
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    sound.playTap();
    setQuizSubmitted(true);
    
    // Check score
    let correctCount = 0;
    story.comprehensionQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    if (correctCount === story.comprehensionQuestions.length) {
      sound.playFanfare();
    } else {
      sound.playCorrect();
    }

    recordStoryCompleted(story.id);
  };

  const handleRetakeQuiz = () => {
    sound.playTap();
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  // Helper to render text with clickable vocabulary
  const renderInteractiveStoryText = (text: string) => {
    const vocabMap: Record<string, VocabularyWord> = {};
    VOCABULARY_LIST.forEach(v => {
      vocabMap[v.british.toLowerCase()] = v;
      vocabMap[v.american.toLowerCase()] = v;
      vocabMap[v.concept.toLowerCase()] = v;
    });

    const paragraphs = text.split('\n\n');

    return (
      <div className="space-y-6 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
        {paragraphs.map((p, pIdx) => {
          // Tokenize into words and punctuation
          const words = p.split(/(\s+|[.,!?;:"])/);

          return (
            <p key={pIdx}>
              {words.map((chunk, cIdx) => {
                const clean = chunk.toLowerCase().replace(/[^a-z]/g, '');
                const vocabMatch = vocabMap[clean];

                if (vocabMatch && chunk.trim().length > 0) {
                  return (
                    <button
                      key={cIdx}
                      onClick={() => {
                        sound.playTap();
                        setSelectedWord(vocabMatch);
                      }}
                      className="text-amber-300 font-semibold underline decoration-amber-500/60 hover:text-amber-200 hover:bg-amber-500/20 px-1 py-0.5 rounded cursor-pointer transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      title="Click to view vocabulary definition"
                      aria-label={`Vocabulary word: ${chunk}. Click for definition.`}
                    >
                      {chunk}
                    </button>
                  );
                }

                return <span key={cIdx}>{chunk}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stories</span>
        </button>

        {/* Explicit Language Variant Label */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2">
          <span>{isUK ? '🇬🇧' : '🇺🇸'}</span>
          <span>{isUK ? 'British English' : 'American English'}</span>
        </div>
      </div>

      <VariantBanner activityTitle="Story Reader & Comprehension" />

      {/* Main Story Container */}
      <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Cover Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-800">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Title & Metadata Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
              <span>{story.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{story.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{story.estimatedMinutes} min read</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {story.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 line-clamp-2">
              {story.subtitle}
            </p>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="p-4 sm:p-6 bg-slate-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {readingPhase === 'quiz' ? 'Comprehension Quiz' : `Chapter ${currentChapterIndex + 1} of ${totalChapters}`}
            </span>
            {isAlreadyCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                <Check className="w-3 h-3" /> Completed
              </span>
            )}
          </div>

          {/* Audio Controls */}
          {readingPhase === 'reading' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartReadAloud}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  ttsState.speaking && !ttsState.paused
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Read aloud with browser speech synthesis"
                aria-label={ttsState.speaking && !ttsState.paused ? 'Pause reading' : 'Read aloud'}
              >
                {ttsState.speaking && !ttsState.paused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Read Aloud ({isUK ? 'UK' : 'US'})</span>
                  </>
                )}
              </button>

              {ttsState.speaking && (
                <button
                  onClick={handleStopReadAloud}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Stop audio"
                  aria-label="Stop audio"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Phase 1: Reading Chapters */}
        {readingPhase === 'reading' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-amber-400 font-mono text-sm sm:text-base">0{currentChapterIndex + 1}.</span>
              <span>{currentChapter.chapterTitle}</span>
            </h2>

            {/* Interactive text with clickable vocab */}
            {renderInteractiveStoryText(currentChapter.content)}

            {/* Hint to click words */}
            <div className="mt-8 p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Tip: Highlighted words in <strong className="text-amber-300">gold</strong> are special vocabulary. Tap any of them to view definitions and spelling patterns!
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  currentChapterIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-800/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <button
                onClick={handleNextChapter}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>{currentChapterIndex < totalChapters - 1 ? 'Next Chapter' : 'Start Comprehension Quiz'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Comprehension Quiz */}
        {readingPhase === 'quiz' && (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                Reading Check
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Reading Comprehension Challenge
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Answer these questions based on the story you just read. Answers follow {isUK ? '🇬🇧 British English' : '🇺🇸 American English'}.
              </p>
            </div>

            {/* Question Cards */}
            <div className="space-y-6">
              {story.comprehensionQuestions.map((q, idx) => {
                const selectedOption = quizAnswers[q.id];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = isAnswered && selectedOption === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border transition-all ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/60'
                          : 'bg-red-950/20 border-red-800/60'
                        : 'bg-slate-850 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {q.question}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        let optionStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80';

                        if (isChosen) {
                          optionStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold';
                        }

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-900/40 border-emerald-500 text-emerald-100 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-red-900/40 border-red-500 text-red-100 line-through';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-colors cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {quizSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {quizSubmitted && (
                      <div className={`mt-4 p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50' : 'bg-red-950/40 text-red-300 border border-red-800/50'
                      }`}>
                        <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Actions */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => {
                  sound.playTap();
                  setReadingPhase('reading');
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Review Story
              </button>

              <div className="flex items-center gap-3">
                {quizSubmitted ? (
                  <>
                    <button
                      onClick={handleRetakeQuiz}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={() => startStorySpellingChallenge(story.id)}
                      className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Spelling Challenge for this Story</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < story.comprehensionQuestions.length}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      Object.keys(quizAnswers).length === story.comprehensionQuestions.length
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <span>Check Answers</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Vocabulary Detail Modal */}
      {selectedWord && (
        <VocabularyModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onStartSpelling={(w) => {
            setSelectedWord(null);
            startStorySpellingChallenge(story.id);
          }}
        />
      )}
    </div>
  );
};
