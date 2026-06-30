import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuizResultHistory } from '../../types';

const History: React.FC = () => {
  const [history, setHistory] = useState<QuizResultHistory[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('quizHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load quiz history:", error);
      // Optionally, clear corrupted data
      // localStorage.removeItem('quizHistory');
    }
  }, []);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (history.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800/30 rounded-lg mt-8 animate-fade-in max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-slate-300">No Quiz History Found</h2>
        <p className="text-slate-400 mt-2">
          You haven't completed any quizzes yet.
        </p>
        <Link 
          to="/quiz"
          className="mt-6 inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
        >
          Take a Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8">Quiz History</h2>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-bold text-lg text-cyan-400">{item.language} Quiz</span>
                <p className="text-sm text-slate-400">
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="font-semibold text-slate-200">
                  Score: <span className={getScoreColor(item.percentage)}>{item.score} / {item.totalQuestions}</span>
                </p>
                <p className={`text-xl font-bold ${getScoreColor(item.percentage)}`}>
                  {item.percentage}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
