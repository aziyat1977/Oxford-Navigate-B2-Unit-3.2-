import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import AssetSorter from './components/AssetSorter';
import TimelineGrammar from './components/TimelineGrammar';
import NeuralCalibration from './components/NeuralCalibration';
import TimeCapsule from './components/TimeCapsule';

const App = () => {
  const [level, setLevel] = useState(0);

  const nextLevel = () => setLevel(prev => prev + 1);

  return (
    <main className="text-white selection:bg-neon-pink selection:text-white bg-dark-bg min-h-screen">
      <AnimatePresence mode="wait">
        {level === 0 && (
          <motion.div key="lvl0" exit={{ opacity: 0 }} className="absolute inset-0">
             <Landing onComplete={nextLevel} />
          </motion.div>
        )}
        
        {level === 1 && (
          <motion.div key="lvl1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
             <AssetSorter onComplete={nextLevel} />
          </motion.div>
        )}
        
        {level === 2 && (
          <motion.div key="lvl2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
             <TimelineGrammar onComplete={nextLevel} />
          </motion.div>
        )}
        
        {level === 3 && (
          <motion.div key="lvl3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
             <NeuralCalibration onComplete={nextLevel} />
          </motion.div>
        )}
        
        {level === 4 && (
          <motion.div key="lvl4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
             <TimeCapsule />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent HUD */}
      {level > 0 && (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end pointer-events-none mix-blend-exclusion">
          <div className="text-[10px] font-mono text-gray-400">TEMPORA OS v3.0</div>
          <div className="text-xl font-display font-bold tracking-tighter">LEVEL 0{level} / 04</div>
        </div>
      )}
    </main>
  );
};

export default App;