import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import DictionaryView from './DictionaryView';
import Quiz from './quiz/Quiz';
import History from './history/History';
import DailyWordModal from './DailyWordModal';

const MainLayout: React.FC = () => {
  const activeTabClass = "bg-slate-700 text-cyan-300";
  const inactiveTabClass = "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200";
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-900 text-white relative overflow-hidden"
    >

      {/* Animated Background Glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_60%)]"
      />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">

        {/* Header */}
        <header className="relative mb-12 flex justify-between items-center">

          {/* Learn Word Button */}
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWordModalOpen(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 
              hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold py-2 px-4 rounded-full 
              shadow-lg shadow-cyan-500/30 transition-all duration-300"
          >
            📖 <span className="hidden sm:inline">Learn New Word</span>
          </motion.button>

          {/* Center Title */}
          <motion.div 
            initial={{ y: -25, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center flex-1"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                MULTILINGO
              </span>
            </h1>
            <p className="text-slate-400 mt-1 text-lg">AI-Powered Multilingual Dictionary & Quiz</p>
          </motion.div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-slate-400 text-sm hidden sm:inline">
                {currentUser.email}
              </span>
            )}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-md"
            >
              Logout
            </motion.button>
          </div>

        </header>

        {/* Nav Tabs */}
        <motion.nav 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10 bg-slate-800/50 backdrop-blur-md p-1 rounded-lg max-w-md mx-auto"
        >
          <NavLink 
            to="/"
            end
            className={({ isActive }) => `w-1/3 py-2 px-4 rounded-md font-semibold transition-colors duration-300 text-center ${isActive ? activeTabClass : inactiveTabClass}`}>
            Dictionary
          </NavLink>
          <NavLink 
            to="/quiz"
            className={({ isActive }) => `w-1/3 py-2 px-4 rounded-md font-semibold transition-colors duration-300 text-center ${isActive ? activeTabClass : inactiveTabClass}`}>
            Quiz
          </NavLink>
          <NavLink 
            to="/history"
            className={({ isActive }) => `w-1/3 py-2 px-4 rounded-md font-semibold transition-colors duration-300 text-center ${isActive ? activeTabClass : inactiveTabClass}`}>
            History
          </NavLink>
        </motion.nav>

        {/* Page Route Fade Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<DictionaryView />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm relative z-10">
        <p>Powered by MultiLingo</p>
      </footer>

      <DailyWordModal 
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
      />

    </motion.div>
  );
};

export default MainLayout;
