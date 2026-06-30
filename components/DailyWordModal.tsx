import React, { useState, useEffect } from 'react';
import DailyWord from './DailyWord';

interface DailyWordType {
  word: string;
  meaning: string;
  example: string;
}

interface DailyWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyWordModal: React.FC<DailyWordModalProps> = ({ isOpen, onClose }) => {

  // 50 In-Built Words List (Add/Change here anytime)
    const dailyWords: DailyWordType[] = [
    { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing.", example: "Her speech was eloquent and moved the audience." },
    { word: "Serenity", meaning: "A state of calm and peacefulness.", example: "The early morning lake was full of serenity." },
    { word: "Diligent", meaning: "Showing care in doing one's work.", example: "He is diligent with his studies." },
    { word: "Harmony", meaning: "Agreement or peaceful coexistence.", example: "They lived together in perfect harmony." },
    { word: "Resilient", meaning: "Able to recover from difficult conditions.", example: "Humans are resilient beings." },
    { word: "Gratitude", meaning: "The quality of being thankful.", example: "She expressed her gratitude with a smile." },
    { word: "Empathy", meaning: "Understanding others' feelings.", example: "Show empathy when someone is upset." },
    { word: "Optimistic", meaning: "Hopeful about the future.", example: "He remained optimistic during challenges." },
    { word: "Candid", meaning: "Truthful and straightforward.", example: "She gave a candid answer." },
    { word: "Pragmatic", meaning: "Focused on practical solutions.", example: "His approach to problems is pragmatic." },
    { word: "Vigorous", meaning: "Strong, healthy, and full of energy.", example: "She made a vigorous effort to finish." },
    { word: "Tranquil", meaning: "Calm and peaceful.", example: "The garden felt tranquil in the evening." },
    { word: "Audacious", meaning: "Bold and fearless.", example: "He made an audacious move in the game." },
    { word: "Meticulous", meaning: "Showing great attention to detail.", example: "She is meticulous in her work." },
    { word: "Adaptable", meaning: "Able to adjust to new conditions.", example: "Humans are highly adaptable." },
    { word: "Benevolent", meaning: "Kind and well-meaning.", example: "The king was known as a benevolent ruler." },
    { word: "Ingenious", meaning: "Clever and inventive.", example: "He came up with an ingenious solution." },
    { word: "Vivid", meaning: "Clear and detailed.", example: "The artist used vivid colors." },
    { word: "Sincere", meaning: "Genuine; not fake.", example: "His apology was sincere." },
    { word: "Zealous", meaning: "Full of passion or enthusiasm.", example: "She is zealous about her goals." },
    { word: "Luminous", meaning: "Bright or glowing.", example: "The moon looked luminous tonight." },
    { word: "Tactful", meaning: "Sensitive in dealing with others.", example: "She handled the situation tactfully." },
    { word: "Agile", meaning: "Able to move quickly and easily.", example: "The cat was agile and quick." },
    { word: "Composed", meaning: "Calm and in control.", example: "He remained composed during the exam." },
    { word: "Spectacular", meaning: "Very impressive.", example: "The view from the top was spectacular." },
    { word: "Immaculate", meaning: "Perfectly clean or neat.", example: "The room was immaculate." },
    { word: "Radiant", meaning: "Shining or glowing.", example: "Her face was radiant with joy." },
    { word: "Vulnerable", meaning: "Open to harm or criticism.", example: "He felt vulnerable after sharing his feelings." },
    { word: "Jovial", meaning: "Cheerful and friendly.", example: "He was in a jovial mood." },
    { word: "Ambitious", meaning: "Having strong desire to succeed.", example: "She is ambitious and hardworking." },
    { word: "Sustainable", meaning: "Able to be maintained long-term.", example: "We should adopt sustainable practices." },
    { word: "Profound", meaning: "Deep or meaningful.", example: "The quote had a profound impact on him." },
    { word: "Innovative", meaning: "Featuring new methods or ideas.", example: "The invention was highly innovative." },
    { word: "Lucid", meaning: "Clear and easy to understand.", example: "His explanation was lucid." },
    { word: "Majestic", meaning: "Grand or impressive.", example: "The mountains looked majestic." },
    { word: "Tolerant", meaning: "Accepting of others' differences.", example: "We must be tolerant in society." },
    { word: "Wholesome", meaning: "Healthy and positive.", example: "The show was wholesome and enjoyable." },
    { word: "Courageous", meaning: "Brave; not scared to face danger.", example: "She was courageous during the crisis." },
    { word: "Versatile", meaning: "Able to do many things.", example: "He is a versatile actor." },
    { word: "Persistent", meaning: "Continuing despite obstacles.", example: "Be persistent to reach your goals." },
    { word: "Vibrant", meaning: "Full of energy and life.", example: "The festival atmosphere was vibrant." },
    { word: "Humble", meaning: "Not proud; modest.", example: "He remained humble despite success." },
    { word: "Sensible", meaning: "Logical and practical.", example: "That was a sensible decision." },
    { word: "Compassionate", meaning: "Showing care for others.", example: "She is a compassionate nurse." },
    { word: "Intricate", meaning: "Very detailed and complex.", example: "The design was intricate and beautiful." },
    { word: "Reliable", meaning: "Able to be trusted.", example: "He is reliable in tough situations." },
    { word: "Flourish", meaning: "To grow successfully.", example: "Plants flourish in sunlight." },
    { word: "Nostalgia", meaning: "A sentimental longing for the past.", example: "Old songs bring nostalgia." },
    { word: "Majesty", meaning: "Impressive beauty or dignity.", example: "The waterfall had majestic energy." },
    { word: "Serendipity", meaning: "Finding something good without looking for it.", example: "Meeting her was pure serendipity." }
  ];


  const [word, setWord] = useState<DailyWordType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Local storage helpers
  const getDailyWord = () => {
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem("dailyWordDate");

    if (storedDate === today) {
      const index = Number(localStorage.getItem("dailyWordIndex")) || 0;
      return dailyWords[index];
    }

    const randomIndex = Math.floor(Math.random() * dailyWords.length);
    localStorage.setItem("dailyWordIndex", randomIndex.toString());
    localStorage.setItem("dailyWordDate", today);

    return dailyWords[randomIndex];
  };

  const markWordAsLearned = (word: DailyWordType) => {
    const stored = JSON.parse(localStorage.getItem("learnedWords") || "[]");
    stored.push(word);
    localStorage.setItem("learnedWords", JSON.stringify(stored));
  };

  const saveWordToHistory = (word: DailyWordType) => {
    const stored = JSON.parse(localStorage.getItem("wordHistory") || "[]");
    stored.push({ ...word, savedAt: new Date() });
    localStorage.setItem("wordHistory", JSON.stringify(stored));
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const w = getDailyWord();
      setTimeout(() => {
        setWord(w);
        setLoading(false);
      }, 600); // small fade loading animation
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 rounded-xl shadow-xl max-w-lg w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Word of the Day</h2>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-300"></div>
            </div>
          ) : word ? (
            <DailyWord
              word={word}
              onMarkLearned={markWordAsLearned}
              onSaveToHistory={saveWordToHistory}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DailyWordModal;
