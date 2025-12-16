import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import AssetSorter from './components/AssetSorter';
import TimelineGrammar from './components/TimelineGrammar';
import NeuralCalibration from './components/NeuralCalibration';
import TimeCapsule from './components/TimeCapsule';
import Menu from './components/Menu';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [lifeExpectancy, setLifeExpectancy] = useState(40); 
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const updateLife = (years: number) => {
    setLifeExpectancy(prev => Math.max(0, Math.min(100, prev + years)));
  };

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center p-4"
          >
             <h1 className="text-5xl md:text-8xl font-display font-bold text-ink dark:text-parchment mb-6 drop-shadow-lg">
                The Chronomancer's<br/>Codex
             </h1>
             <p className="font-body text-2xl italic text-ink/80 dark:text-parchment/80 max-w-md mx-auto mb-10">
               "Time is the currency of the soul.<br/>Spend it wisely, Apprentice."
             </p>
             <div className="w-24 h-24 border-4 border-magic-gold rounded-full flex items-center justify-center animate-pulse">
                <span className="text-4xl">⏳</span>
             </div>
             <p className="mt-8 text-sm font-rune opacity-50 text-ink dark:text-parchment">Open the Grimoire (Top Left) to begin.</p>
          </motion.div>
        );
      case 'diagnostic':
        return <Landing key="landing" onComplete={() => setCurrentView('sorter')} updateLife={updateLife} />;
      case 'sorter':
        return <AssetSorter key="sorter" onComplete={() => setCurrentView('timeline')} updateLife={updateLife} />;
      case 'timeline':
        return <TimelineGrammar key="timeline" onComplete={() => setCurrentView('neural')} />;
      case 'neural':
        return <NeuralCalibration key="neural" onComplete={() => setCurrentView('capsule')} updateLife={updateLife} />;
      case 'capsule':
        return <TimeCapsule key="capsule" lifeExpectancy={lifeExpectancy} />;
      default:
        return null;
    }
  };

  return (
    <main className={`min-h-screen overflow-hidden transition-colors duration-500 font-body
      ${darkMode ? 'bg-obsidian text-parchment' : 'bg-parchment text-ink'}
      bg-paper-texture dark:bg-leather-texture`}>
      
      {/* Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Navigation & HUD */}
      <Menu currentView={currentView} setView={setCurrentView} darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* View Container */}
      <div className="relative z-10 w-full h-screen">
         <AnimatePresence mode="wait">
            {renderView()}
         </AnimatePresence>
      </div>

      {/* HUD: Sands of Time */}
      {currentView !== 'home' && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
             <div className="text-xs font-rune text-ink/60 dark:text-parchment/60 uppercase mb-1">Sands of Time</div>
             <motion.div 
               key={lifeExpectancy}
               initial={{ scale: 1.2 }}
               animate={{ 
                 scale: 1, 
                 color: lifeExpectancy < 20 
                   ? '#8a0303' // crimson
                   : '#d4af37' // gold
               }}
               className="text-4xl font-display font-bold drop-shadow-md bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
             >
                {lifeExpectancy} Yrs
             </motion.div>
        </div>
      )}
    </main>
  );
};

export default App;