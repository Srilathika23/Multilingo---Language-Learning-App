import React from 'react';
import { DictionaryEntry } from '../types';
import AudioButton from './AudioButton';

interface ResultDisplayProps {
  data: DictionaryEntry;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl shadow-slate-900/50 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-300">{data.word}</h2>
          <AudioButton text={data.word} />
        </div>
        <span className="text-sm font-medium bg-indigo-500 text-white px-3 py-1 rounded-full mt-2 sm:mt-0">{data.language}</span>
      </div>
      <div className="mb-6">
        {data.pronunciation && (
          <p className="text-lg text-slate-400 font-mono mb-1">/{data.pronunciation}/</p>
        )}
        <p className="text-lg text-slate-300 italic">{data.partOfSpeech}</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-800 pb-1 mb-2">Meaning</h3>
          <div className="flex items-start gap-3">
            <p className="flex-1 text-slate-200 text-base md:text-lg">{data.meaning}</p>
            <AudioButton text={data.meaning} />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-800 pb-1 mb-2">Explanation</h3>
          <div className="flex items-start gap-3">
            <p className="flex-1 text-slate-200 text-base md:text-lg leading-relaxed">{data.explanation}</p>
            <AudioButton text={data.explanation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;