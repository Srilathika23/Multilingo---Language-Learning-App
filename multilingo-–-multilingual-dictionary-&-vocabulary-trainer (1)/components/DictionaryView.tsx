import React, { useState, useCallback } from 'react';
import { DictionaryEntry } from '../types';
import { fetchWordDefinition } from '../services/geminiService';
import SearchBar from './SearchBar';
import ResultDisplay from './ResultDisplay';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';

const DictionaryView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DictionaryEntry | null>(null);

  const handleSearch = useCallback(async (word: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const definition = await fetchWordDefinition(word, language);
      setResult(definition);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-slate-800/30 rounded-lg mt-8 animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-300">Welcome to Multilingo</h2>
      <p className="text-slate-400 mt-2">Your AI-powered dictionary for a world of languages.</p>
      <p className="text-slate-500 mt-1">Start by typing a word and selecting a language above.</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        {result && <ResultDisplay data={result} />}
        {!isLoading && !error && !result && <WelcomeMessage />}
      </div>
    </div>
  );
};

export default DictionaryView;