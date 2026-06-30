import React from 'react';
import { QuizQuestion } from '../../types';
import AudioButton from '../AudioButton';

interface QuizQuestionDisplayProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  userAnswer: string | null;
  language: string;
}

const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isAnswered,
  userAnswer,
  language,
}) => {
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-600';
    }
    if (option === userAnswer) {
      return 'bg-red-600';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl shadow-slate-900/50 animate-fade-in-up w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-300">Question {questionNumber} of {totalQuestions}</h2>
      </div>
      <div className="text-lg md:text-xl text-slate-200 mb-6 min-h-[6rem] flex items-center gap-2">
        <span>{question.definition}</span>
        <AudioButton text={question.definition} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg transition duration-200 text-white font-semibold disabled:cursor-not-allowed flex items-center justify-between ${getButtonClass(option)}`}
          >
            <span>{option}</span>
            <AudioButton text={option} stopPropagation={true} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionDisplay;