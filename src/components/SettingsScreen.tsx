import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageVariant } from '../types';
import { runSpellingEngineSelfTest, TestCaseResult } from '../utils/spellingEngine';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';
import { VariantBanner } from './VariantBanner';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  User,
  Phone
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    languageVariant, 
    setLanguageVariant, 
    resetAllProgress 
  } = useApp();

  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    allPassed: boolean;
    results: TestCaseResult[];
  } | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isUK = languageVariant === 'british';

  const handleTestTTS = () => {
    sound.playTap();
    const phrase = isUK
      ? "Welcome to LexiQuest. You are practicing in British English, observing words like colour and centre."
      : "Welcome to LexiQuest. You are practicing in American English, observing words like color and center.";
    speech.speak(phrase, languageVariant, settings.ttsRate);
  };

  const handleRunSelfTest = () => {
    sound.playTap();
    const res = runSpellingEngineSelfTest();
    setTestResults(res);
    if (res.allPassed) {
      sound.playFanfare();
    } else {
      sound.playIncorrect();
    }
  };

  const handleConfirmReset = () => {
    sound.playTap();
    resetAllProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings &amp; Verification
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure learning preferences, audio options, and execute the automated spelling verification suite.
        </p>
      </div>

      <VariantBanner activityTitle="Settings" />

      <div className="space-y-6">
        {/* 1. ENGLISH VARIANT CONFIGURATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-2">
            Primary English Language Variant
          </h2>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Select which standardized spelling conventions all stories, hints, and spelling challenges will enforce.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                sound.playTap();
                setLanguageVariant('british');
              }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                isUK
                  ? 'bg-blue-950/60 border-blue-500 text-white ring-2 ring-blue-500/20'
                  : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-3xl">🇬🇧</span>
              <div>
                <div className="font-bold text-sm">British English</div>
                <div className="text-xs text-slate-400 mt-1">
                  Enforces -our (colour), -re (centre), -ise (organise), and double -ll- (travelling).
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setLanguageVariant('american');
              }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                !isUK
                  ? 'bg-red-950/60 border-red-500 text-white ring-2 ring-red-500/20'
                  : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-3xl">🇺🇸</span>
              <div>
                <div className="font-bold text-sm">American English</div>
                <div className="text-xs text-slate-400 mt-1">
                  Enforces -or (color), -er (center), -ize (organize), and single -l- (traveling).
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. AUDIO & TEXT-TO-SPEECH */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4">
            Audio &amp; Speech Synthesis
          </h2>

          <div className="space-y-4">
            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 border border-slate-850">
              <div>
                <div className="text-sm font-semibold text-white">Sound Effects (Web Audio API)</div>
                <div className="text-xs text-slate-400">Play chimes, tap sounds, and celebration fanfares</div>
              </div>
              <button
                onClick={() => {
                  const next = !settings.soundEnabled;
                  updateSettings({ soundEnabled: next });
                  if (next) sound.playCorrect();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {/* TTS Speed & Test */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-850 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Text-to-Speech Speed</div>
                  <div className="text-xs text-slate-400">Adjust pronunciation pacing ({settings.ttsRate}x)</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[0.8, 0.95, 1.1].map(r => (
                    <button
                      key={r}
                      onClick={() => updateSettings({ ttsRate: r })}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        settings.ttsRate === r
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Pronounces words in {isUK ? '🇬🇧 UK English' : '🇺🇸 US English'}
                </span>
                <button
                  onClick={handleTestTTS}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Voice Sample</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPELLING ENGINE AUTOMATED TEST SUITE (Prompt Section 35) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Suite (Prompt §35)</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Spelling Engine Self-Test Suite
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Executes all mandatory test cases: case-insensitivity, leading/trailing spaces, empty strings, and variant enforcement (colour/color, favourite/favorite, etc.).
              </p>
            </div>

            <button
              onClick={handleRunSelfTest}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md self-start"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Automated Test Suite</span>
            </button>
          </div>

          {/* Test Results Table */}
          {testResults && (
            <div className="mt-4 p-4 rounded-xl bg-slate-850 border border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {testResults.allPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm font-bold text-white">
                    {testResults.passed} of {testResults.total} Tests Passed
                  </span>
                </div>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  testResults.allPassed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {testResults.allPassed ? 'ALL INVARIANTS VERIFIED ✅' : 'FAILURES DETECTED ❌'}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs font-mono">
                {testResults.results.map((r, idx) => (
                  <div
                    key={r.testId}
                    className={`p-2 rounded flex items-center justify-between ${
                      r.passed ? 'bg-slate-900/60 text-slate-300' : 'bg-red-950/40 text-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{r.passed ? '✓' : '✗'}</span>
                      <span>{idx + 1}. {r.description}</span>
                    </div>
                    <span className={r.passed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {r.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. CREATOR & APPLICATION INFO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>Application Credits</span>
          </h2>
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">
                created by TEMITOPE ABOLUWARIN
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>PHONE NUMBER: <strong className="text-slate-200">08166102920</strong></span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              LexiQuest Educational Platform
            </div>
          </div>
        </div>

        {/* 5. RESET PROGRESS */}
        <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Reset Learning Progress</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Clear all locally stored scores, accuracy logs, unlocked badges, and completed stories.
              </p>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset All Progress?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This will reset your points, stars, streaks, and badge unlocks back to zero. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
