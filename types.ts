export interface LanguageOption {
  name: string;
  bcp47: string; // BCP 47 language tag for speech APIs
}

export interface DictionaryEntry {
  word: string;
  language: string;
  partOfSpeech: string;
  pronunciation: string;
  meaning: string;
  explanation: string;
}

export interface QuizQuestion {
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResultHistory {
  date: string; // ISO string format
  language: string;
  totalQuestions: number;
  score: number;
  percentage: number;
}