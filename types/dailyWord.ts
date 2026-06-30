export interface DailyWord {
  word: string;
  language: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  date: string;
  dayCount: number;
  isLearned?: boolean;
}

export interface SavedWord extends DailyWord {
  savedAt: string;
}