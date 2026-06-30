import React, { useState, useEffect } from 'react';
import { DailyWord as DailyWordType } from '../types/dailyWord';
import AudioButton from './AudioButton';
import { useAuth } from '../contexts/AuthContext';

interface DailyWordProps {
  word: DailyWordType;
  onMarkLearned: (word: DailyWordType) => Promise<void>;
  onSaveToHistory: (word: DailyWordType) => Promise<void>;
}

const DailyWord: React.FC<DailyWordProps> = ({ word, onMarkLearned, onSaveToHistory }) => {
  const [isLearned, setIsLearned] = useState(word.isLearned || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsLearned(word.isLearned || false);
  }, [word.isLearned]);

  const handleMarkLearned = async () => {
    if (!user) {
      setError('Please log in to mark words as learned');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onMarkLearned(word);
      setIsLearned(true);
    } catch (err) {
      setError('Failed to mark word as learned. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError('Please log in to save words');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onSaveToHistory(word);
    } catch (err) {
      setError('Failed to save word. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-lg animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">{word.word}</h2>
          <p className="text-sm text-slate-400">
            {word.language} • {word.partOfSpeech}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AudioButton text={word.word} />
          <button
            onClick={handleMarkLearned}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLearned
                ? 'bg-green-500/20 text-green-400'
                : isLoading
                ? 'bg-slate-700/50 text-slate-500'
                : 'text-slate-400 hover:bg-slate-700 hover:text-cyan-300'
            }`}
            title={isLearned ? 'Learned!' : 'Mark as learned'}
          >
            <span className="text-xl">✓</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLoading
                ? 'bg-slate-700/50 text-slate-500'
                : 'text-slate-400 hover:bg-slate-700 hover:text-cyan-300'
            }`}
            title="Save to history"
          >
            <span className="text-xl">🔖</span>
          </button>
        </div>
      </div>

      <p className="text-slate-300 mb-2">{word.definition}</p>
      <p className="text-slate-400 text-sm italic">"{word.example}"</p>

      {error && (
        <p className="text-sm text-red-400 mt-2 mb-1">{error}</p>
      )}

      <div className="mt-3 text-xs text-slate-500 flex justify-between items-center">
        <span>Day {word.dayCount}</span>
        <span>{new Date(word.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default DailyWord;