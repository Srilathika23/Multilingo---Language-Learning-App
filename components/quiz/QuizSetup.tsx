import React, { useState, useEffect } from 'react';
import { LanguageOption } from '../../types';
import LanguageSelector from '../LanguageSelector';
import { LANGUAGES } from '../../utils/languages';

interface QuizSetupProps {
  onStartQuiz: (language: string, count: number) => void;
  isLoading: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, isLoading }) => {
  const [language, setLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [count, setCount] = useState<number>(5);

  // Automatically detect and set the user's preferred language on mount
  useEffect(() => {
    const detectAndSetLanguage = () => {
      // navigator.languages returns an array of user's preferred languages
      const userLangs = navigator.languages || [navigator.language];

      // First pass: look for an exact match (e.g., 'en-US' matches 'en-US')
      for (const userLang of userLangs) {
        const exactMatch = LANGUAGES.find(
          (appLang) => appLang.bcp47.toLowerCase() === userLang.toLowerCase()
        );
        if (exactMatch) {
          setLanguage(exactMatch);
          return; // Found the best possible match
        }
      }
      
      // Second pass (fallback): look for a primary language match (e.g., 'en' from 'en-GB' matches 'en-US')
       for (const userLang of userLangs) {
        const userLangPrefix = userLang.split('-')[0].toLowerCase();
        const partialMatch = LANGUAGES.find(
          (appLang) => appLang.bcp47.split('-')[0].toLowerCase() === userLangPrefix
        );
        if (partialMatch) {
          setLanguage(partialMatch);
          return; // Found a suitable fallback
        }
      }
    };

    detectAndSetLanguage();
  }, []); // Empty dependency array ensures this runs only once

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(language.name, count);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl shadow-slate-900/50 animate-fade-in-up max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">Vocabulary Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="language-select" className="block mb-2 text-sm font-medium text-slate-300">
            Select Language
          </label>
           <LanguageSelector
            selectedLanguage={language}
            onSelectLanguage={setLanguage}
            isDisabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="count-select" className="block mb-2 text-sm font-medium text-slate-300">
            Number of Questions
          </label>
          <select
            id="count-select"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-300 appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            disabled={isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;