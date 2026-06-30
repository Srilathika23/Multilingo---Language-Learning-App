import React, { useState, useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import QuizSetup from './QuizSetup';
import QuizQuestionDisplay from './QuizQuestionDisplay';
import QuizResult from './QuizResult';
import Loader from '../Loader';
import ErrorDisplay from '../ErrorDisplay';

const Quiz: React.FC = () => {
  type QuizState = 'setup' | 'loading' | 'active' | 'answered' | 'finished';

  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [quizLanguage, setQuizLanguage] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (language: string, count: number) => {
    setQuizState('loading');
    setError(null);
    setQuizLanguage(language);
    try {
      const quizQuestions = await generateQuiz(language, count);
      if (quizQuestions.length === 0) {
        throw new Error("The API returned an empty quiz. Please try again.");
      }
      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setScore(0);
      setQuizState('active');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while generating the quiz.");
      }
      setQuizState('setup');
    }
  }, []);

  const handleAnswer = (answer: string) => {
    if (quizState !== 'active') return;

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    setQuizState('answered');
  };
  
  const handleNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setQuizState('active');
      } else {
          setQuizState('finished');
      }
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuestions([]);
    setQuizLanguage(null);
  };

  const renderContent = () => {
    // FIX: Combined 'setup' and 'loading' states to correctly show the loading state on the setup screen.
    // This fixes the TypeScript error and improves the user experience by avoiding a layout shift.
    if (quizState === 'setup' || quizState === 'loading') {
      return <QuizSetup onStartQuiz={handleStartQuiz} isLoading={quizState === 'loading'} />;
    }
    
    if (quizState === 'finished') {
      return <QuizResult score={score} totalQuestions={questions.length} language={quizLanguage!} onRestart={handleRestart} />;
    }

    if ((quizState === 'active' || quizState === 'answered') && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      return (
        <div>
          <QuizQuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            isAnswered={quizState === 'answered'}
            userAnswer={userAnswers[currentQuestionIndex] || null}
            language={quizLanguage!}
          />
          {quizState === 'answered' && (
            <div className="text-center mt-6">
                 <button 
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Results'}
                </button>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
        {error && <ErrorDisplay message={error} />}
        {renderContent()}
    </div>
  )
};

export default Quiz;