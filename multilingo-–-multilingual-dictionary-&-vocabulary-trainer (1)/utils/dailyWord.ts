import { DailyWord } from '../types/dailyWord';
import { firestore, auth } from '../services/firebase';
import { generateDailyWord } from '../services/geminiService';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

const COLLECTIONS = {
  DAILY_WORDS: 'daily_words',
  USER_WORDS: 'user_words',
};

export async function getDailyWord(date: Date = new Date()): Promise<DailyWord> {
  const dateStr = date.toISOString().split('T')[0];
  const docRef = doc(firestore, COLLECTIONS.DAILY_WORDS, dateStr);
  const wordSnap = await getDoc(docRef);

  if (wordSnap.exists()) {
    const word = wordSnap.data() as DailyWord;
    return {
      ...word,
      isLearned: await isWordLearned(word.word),
    };
  }

  // If no word exists for today, generate one using Gemini
  const newWord = await generateDailyWord('English'); // make language configurable if needed
  await setDoc(docRef, newWord as any);

  return {
    ...newWord,
    isLearned: false,
  };
}

export async function markWordAsLearned(word: DailyWord): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to mark words as learned');
    }

    const learnedDocRef = doc(
      firestore,
      COLLECTIONS.USER_WORDS,
      user.uid,
      'learned',
      word.word,
    );

    await setDoc(learnedDocRef, {
      ...word,
      learnedAt: new Date().toISOString(),
    } as any);
  } catch (error) {
    console.error('Failed to mark word as learned:', error);
    throw error;
  }
}

export async function isWordLearned(word: string): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const docRef = doc(firestore, COLLECTIONS.USER_WORDS, user.uid, 'learned', word);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch (error) {
    console.error('Failed to check if word is learned:', error);
    return false;
  }
}

export async function saveWordToHistory(word: DailyWord): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to save words');
    }

    const savedColRef = collection(firestore, COLLECTIONS.USER_WORDS, user.uid, 'saved');
    await addDoc(savedColRef, {
      ...word,
      savedAt: new Date().toISOString(),
    } as any);
  } catch (error) {
    console.error('Failed to save word to history:', error);
    throw error;
  }
}

export async function getSavedWords() {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const savedColRef = collection(firestore, COLLECTIONS.USER_WORDS, user.uid, 'saved');
    const q = query(savedColRef, orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    console.error('Failed to get saved words:', error);
    return [];
  }
}