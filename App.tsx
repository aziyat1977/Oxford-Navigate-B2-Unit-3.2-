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
             <h1 className="text-6xl md:text-9xl font-display font-black text-slate-900 dark:text-white mb-6">TEMPORA</h1>
             <p className="font-mono text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
               AGENCY ACCESS TERMINAL <br/>
               PLEASE SELECT A MODULE FROM THE MENU
             </p>
             <div className="w-16 h-1 bg-emerald-500 dark:bg-neon-green animate-pulse"></div>
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
    <main className={`min-h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-dark-bg text-white selection:bg-neon-pink selection:text-white' : 'bg-gray-100 text-slate-900 selection:bg-emerald-400'}`}>
      
      {/* Global Background Pattern */}
      <div className={`fixed inset-0 pointer-events-none z-0 bg-[size:50px_50px] opacity-20 dark:opacity-100
        ${darkMode 
          ? 'bg-[linear-gradient(rgba(0,255,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.03)_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'
        }`} 
      />
      
      {/* CRT Overlay (Dark Mode Only) */}
      <div className="crt fixed inset-0 pointer-events-none z-50 opacity-0 dark:opacity-100 transition-opacity" />

      {/* Navigation & HUD */}
      <Menu currentView={currentView} setView={setCurrentView} darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* View Container */}
      <div className="relative z-10 w-full h-screen">
         <AnimatePresence mode="wait">
            {renderView()}
         </AnimatePresence>
      </div>

      {/* HUD: Life Expectancy */}
      {currentView !== 'home' && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
             <div className="text-[10px] font-mono text-slate-500 uppercase bg-white/80 dark:bg-black/80 px-2">Life Expectancy</div>
             <motion.div 
               key={lifeExpectancy}
               initial={{ scale: 1.5 }}
               animate={{ 
                 scale: 1, 
                 color: lifeExpectancy < 20 
                   ? '#ef4444' // red-500
                   : darkMode ? '#00ff99' : '#059669' // neon-green vs emerald-600
               }}
               className="text-3xl font-display font-black tracking-tighter drop-shadow-lg"
             >
                {lifeExpectancy} YRS
             </motion.div>
        </div>
      )}
    </main>
  );
};

export default App;