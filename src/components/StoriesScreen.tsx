import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STORIES } from '../data/stories';
import { Story, DifficultyLevel } from '../types';
import { VariantBanner } from './VariantBanner';
import { StoryReader } from './StoryReader';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const StoriesScreen: React.FC = () => {
  const { 
    languageVariant, 
    selectedStoryId, 
    setSelectedStoryId,
    startStorySpellingChallenge,
    progress 
  } = useApp();

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');

  const isUK = languageVariant === 'british';

  // If a story is selected, show the reader
  if (selectedStoryId) {
    const story = STORIES.find(s => s.id === selectedStoryId);
    if (story) {
      return (
        <StoryReader
          story={story}
          onBack={() => setSelectedStoryId(null)}
        />
      );
    }
  }

  const filteredStories = STORIES.filter(s => {
    if (difficultyFilter === 'all') return true;
    return s.difficulty === difficultyFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Adventure Stories Library
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Immerse yourself in rich narratives, discover advanced vocabulary, and practice {isUK ? '🇬🇧 British English' : '🇺🇸 American English'}.
            </p>
          </div>

          {/* Difficulty Segmented Filter (Allowed interactive control) */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/90 border border-slate-700 rounded-xl self-start">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  difficultyFilter === d
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <VariantBanner activityTitle="Story Library" />

      {/* Story Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => {
          const isCompleted = progress.storiesCompleted.includes(story.id);

          return (
            <div
              key={story.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-slate-700 transition-all group"
            >
              {/* Cover visual with fallback */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {/* Status and Difficulty Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/80 backdrop-blur-sm text-slate-200 border border-slate-700 capitalize">
                    {story.difficulty}
                  </span>
                  {isCompleted && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/80 backdrop-blur-sm text-emerald-300 border border-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Story Content & Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-400 mb-1">
                    {story.genre}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{story.estimatedMinutes} mins</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{story.vocabularyIds.length} Target Words</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedStoryId(story.id)}
                    className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Read Again' : 'Read Story'}</span>
                  </button>

                  <button
                    onClick={() => startStorySpellingChallenge(story.id)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Practice spelling vocabulary from this story"
                  >
                    <span>Spell Words</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
