import React, { useEffect } from 'react';
import { QuizResultHistory } from '../../types';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  language: string;
  onRestart: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, language, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const newEntry: QuizResultHistory = {
      date: new Date().toISOString(),
      language,
      totalQuestions,
      score,
      percentage,
    };

    try {
      const existingHistoryRaw = localStorage.getItem('quizHistory');
      const existingHistory: QuizResultHistory[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      
      const updatedHistory = [newEntry, ...existingHistory]; // Add new entry to the top
      
      localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save quiz history:", error);
    }
  }, [score, totalQuestions, language, percentage]);

  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! You're a vocabulary master!";
    if (percentage >= 80) return "Excellent work! You know your words.";
    if (percentage >= 50) return "Good job! A little more practice and you'll be an expert.";
    return "Keep practicing! Every attempt helps you learn.";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl shadow-slate-900/50 animate-fade-in-up text-center max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-cyan-300 mb-4">Quiz Complete!</h2>
      <p className="text-xl text-slate-200 mb-2">Your Score:</p>
      <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-6">
        {score} / {totalQuestions}
      </p>
      <p className="text-lg text-slate-300 italic mb-8">{getFeedback()}</p>
      <button
        onClick={onRestart}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
      >
        Try Another Quiz
      </button>
    </div>
  );
};

export default QuizResult;