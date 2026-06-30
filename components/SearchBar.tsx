import React, { useState } from 'react';
import { LanguageOption } from '../types';
import SearchIcon from './icons/SearchIcon';
import SpeechToTextButton from './SpeechToTextButton';
import LanguageSelector from './LanguageSelector';
import { LANGUAGES } from '../utils/languages';

interface SearchBarProps {
  onSearch: (word: string, language: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState<LanguageOption>(LANGUAGES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      onSearch(word.trim(), language.name);
    }
  };

  const handleTranscript = (transcript: string) => {
    setWord(transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl">
      <div className="relative flex-grow w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="h-6 w-6 text-slate-500" />
        </div>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word or use microphone..."
          className="w-full pl-12 pr-14 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-300 placeholder-slate-500"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <SpeechToTextButton
            onTranscript={handleTranscript}
            language={language}
            isDisabled={isLoading}
          />
        </div>
      </div>
      <LanguageSelector
        selectedLanguage={language}
        onSelectLanguage={setLanguage}
        isDisabled={isLoading}
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
