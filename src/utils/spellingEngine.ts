/**
 * Dedicated, reliable Spelling Validation Engine for LexiQuest.
 * Strict British vs American English verification with zero fuzzy replacement.
 */

import { LanguageVariant, ValidationFeedback } from '../types';

/**
 * Normalizes input: trims leading/trailing whitespace and converts to lowercase.
 * Does NOT alter internal letters or fuzzy-fix mistakes.
 */
export function normalizeSpelling(input: string): string {
  if (!input) return '';
  return input.trim().toLowerCase();
}

/**
 * Validates a user's spelling against the active English variant and target word.
 */
export function validateSpelling(
  rawInput: string,
  britishWord: string,
  americanWord: string,
  activeVariant: LanguageVariant
): ValidationFeedback {
  const normalizedInput = normalizeSpelling(rawInput);
  const normalizedBritish = normalizeSpelling(britishWord);
  const normalizedAmerican = normalizeSpelling(americanWord);

  const hasVariantDifference = normalizedBritish !== normalizedAmerican;
  const expectedWord = activeVariant === 'british' ? normalizedBritish : normalizedAmerican;
  const otherVariantWord = activeVariant === 'british' ? normalizedAmerican : normalizedBritish;

  // Handle empty answer
  if (!normalizedInput) {
    return {
      isCorrect: false,
      isOtherVariant: false,
      inputNormalized: '',
      expectedWord: activeVariant === 'british' ? britishWord : americanWord,
      otherVariantWord: activeVariant === 'british' ? americanWord : britishWord,
      hasVariantDifference,
      activeVariant,
      title: 'Empty Answer',
      message: 'Please type your answer before checking.',
      comparisonNote: undefined,
    };
  }

  // Exact match for the active variant
  if (normalizedInput === expectedWord) {
    const variantLabel = activeVariant === 'british' ? '🇬🇧 British English' : '🇺🇸 American English';
    return {
      isCorrect: true,
      isOtherVariant: false,
      inputNormalized: normalizedInput,
      expectedWord: activeVariant === 'british' ? britishWord : americanWord,
      otherVariantWord: activeVariant === 'british' ? americanWord : britishWord,
      hasVariantDifference,
      activeVariant,
      title: '🎉 CORRECT!',
      message: `Excellent! You spelled the word correctly in ${variantLabel}.`,
      comparisonNote: hasVariantDifference
        ? `Notice: ${activeVariant === 'british' ? `🇬🇧 British: ${britishWord} · 🇺🇸 American: ${americanWord}` : `🇺🇸 American: ${americanWord} · 🇬🇧 British: ${britishWord}`}`
        : undefined,
    };
  }

  // Check if they typed the valid spelling of the OTHER variant
  if (hasVariantDifference && normalizedInput === otherVariantWord) {
    const currentLabel = activeVariant === 'british' ? '🇬🇧 British English' : '🇺🇸 American English';
    const otherLabel = activeVariant === 'british' ? '🇺🇸 American English' : '🇬🇧 British English';

    return {
      isCorrect: false,
      isOtherVariant: true,
      inputNormalized: normalizedInput,
      expectedWord: activeVariant === 'british' ? britishWord : americanWord,
      otherVariantWord: activeVariant === 'british' ? americanWord : britishWord,
      hasVariantDifference,
      activeVariant,
      title: '❌ NOT CORRECT FOR THIS QUESTION',
      message: `This question is testing ${currentLabel}.\n${activeVariant === 'british' ? `🇬🇧 British English: ${britishWord}\n🇺🇸 American English: ${americanWord}` : `🇺🇸 American English: ${americanWord}\n🇬🇧 British English: ${britishWord}`}`,
      comparisonNote: `"${rawInput.trim()}" is the legitimate ${otherLabel} spelling, but this challenge requires ${currentLabel}.`,
    };
  }

  // Standard incorrect spelling
  const currentLabel = activeVariant === 'british' ? '🇬🇧 British English' : '🇺🇸 American English';
  return {
    isCorrect: false,
    isOtherVariant: false,
    inputNormalized: normalizedInput,
    expectedWord: activeVariant === 'british' ? britishWord : americanWord,
    otherVariantWord: activeVariant === 'british' ? americanWord : britishWord,
    hasVariantDifference,
    activeVariant,
    title: '❌ NOT QUITE RIGHT',
    message: `Not correct for ${currentLabel}. Look closely at the letter patterns and try again!`,
    comparisonNote: undefined,
  };
}

/**
 * Prompt §35 required test runner:
 * Verifies every mandatory edge case and invariant.
 */
export interface TestCaseResult {
  testId: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export function runSpellingEngineSelfTest(): { total: number; passed: number; allPassed: boolean; results: TestCaseResult[] } {
  const tests: Array<{
    id: string;
    description: string;
    input: string;
    british: string;
    american: string;
    variant: LanguageVariant;
    expectCorrect: boolean;
    expectOtherVariant: boolean;
  }> = [
    { id: 't1', description: 'apple lowercase in British', input: 'apple', british: 'apple', american: 'apple', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't2', description: 'Apple capitalized in British', input: 'Apple', british: 'apple', american: 'apple', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't3', description: 'appl misspelling in British', input: 'appl', british: 'apple', american: 'apple', variant: 'british', expectCorrect: false, expectOtherVariant: false },
    { id: 't4', description: 'elephant lowercase in American', input: 'elephant', british: 'elephant', american: 'elephant', variant: 'american', expectCorrect: true, expectOtherVariant: false },
    { id: 't5', description: 'elefant misspelling in American', input: 'elefant', british: 'elephant', american: 'elephant', variant: 'american', expectCorrect: false, expectOtherVariant: false },
    { id: 't6', description: 'colour in British', input: 'colour', british: 'colour', american: 'color', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't7', description: 'color in British (other variant)', input: 'color', british: 'colour', american: 'color', variant: 'british', expectCorrect: false, expectOtherVariant: true },
    { id: 't8', description: 'color in American', input: 'color', british: 'colour', american: 'color', variant: 'american', expectCorrect: true, expectOtherVariant: false },
    { id: 't9', description: 'colour in American (other variant)', input: 'colour', british: 'colour', american: 'color', variant: 'american', expectCorrect: false, expectOtherVariant: true },
    { id: 't10', description: 'favourite in British', input: 'favourite', british: 'favourite', american: 'favorite', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't11', description: 'favorite in British (other variant)', input: 'favorite', british: 'favourite', american: 'favorite', variant: 'british', expectCorrect: false, expectOtherVariant: true },
    { id: 't12', description: 'favorite in American', input: 'favorite', british: 'favourite', american: 'favorite', variant: 'american', expectCorrect: true, expectOtherVariant: false },
    { id: 't13', description: 'favourite in American (other variant)', input: 'favourite', british: 'favourite', american: 'favorite', variant: 'american', expectCorrect: false, expectOtherVariant: true },
    { id: 't14', description: 'Leading and trailing spaces: "  colour  "', input: '  colour  ', british: 'colour', american: 'color', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't15', description: 'Uppercase: "COLOUR" in British', input: 'COLOUR', british: 'colour', american: 'color', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't16', description: 'Empty input in British', input: '', british: 'colour', american: 'color', variant: 'british', expectCorrect: false, expectOtherVariant: false },
    { id: 't17', description: 'centre in British', input: 'centre', british: 'centre', american: 'center', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't18', description: 'center in British (other variant)', input: 'center', british: 'centre', american: 'center', variant: 'british', expectCorrect: false, expectOtherVariant: true },
    { id: 't19', description: 'organise in British', input: 'organise', british: 'organise', american: 'organize', variant: 'british', expectCorrect: true, expectOtherVariant: false },
    { id: 't20', description: 'organize in British (other variant)', input: 'organize', british: 'organise', american: 'organize', variant: 'british', expectCorrect: false, expectOtherVariant: true },
  ];

  const results: TestCaseResult[] = tests.map(t => {
    const res = validateSpelling(t.input, t.british, t.american, t.variant);
    const passed = res.isCorrect === t.expectCorrect && res.isOtherVariant === t.expectOtherVariant;
    return {
      testId: t.id,
      description: t.description,
      passed,
      expected: `correct=${t.expectCorrect}, otherVariant=${t.expectOtherVariant}`,
      actual: `correct=${res.isCorrect}, otherVariant=${res.isOtherVariant}`,
    };
  });

  const passedCount = results.filter(r => r.passed).length;
  return {
    total: tests.length,
    passed: passedCount,
    allPassed: passedCount === tests.length,
    results,
  };
}
