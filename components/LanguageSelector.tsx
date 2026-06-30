import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LanguageOption } from '../types';
import { LANGUAGES } from '../utils/languages';
import ChevronDownIcon from './icons/ChevronDownIcon';
import SearchIcon from './icons/SearchIcon';

interface LanguageSelectorProps {
  selectedLanguage: LanguageOption;
  onSelectLanguage: (language: LanguageOption) => void;
  isDisabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredLanguages = useMemo(() =>
    LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  const handleSelect = (language: LanguageOption) => {
    onSelectLanguage(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full sm:w-auto" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        className="w-full sm:w-48 flex items-center justify-between px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-300 disabled:opacity-50"
      >
        <span className="truncate">{selectedLanguage.name}</span>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full sm:w-64 bg-slate-800 border-2 border-slate-700 rounded-lg shadow-2xl animate-fade-in-up-fast overflow-hidden">
          <div className="p-2">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Search language..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    autoFocus
                />
             </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
                filteredLanguages.map(lang => (
                <li key={lang.bcp47}>
                    <button
                    onClick={() => handleSelect(lang)}
                    className={`w-full text-left px-4 py-2 transition-colors duration-150 ${selectedLanguage.bcp47 === lang.bcp47 ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700'}`}
                    >
                    {lang.name}
                    </button>
                </li>
                ))
            ) : (
                <li className="px-4 py-2 text-slate-500">No languages found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;