import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import AssetSorter from './components/AssetSorter';
import TimelineGrammar from './components/TimelineGrammar';
import NeuralCalibration from './components/NeuralCalibration';
import TimeCapsule from './components/TimeCapsule';

const App = () => {
  const [level, setLevel] = useState(0);
  // Psychological Trigger: "Years Saved". Starting at 40 years left.
  // Mistakes reduce this. Good answers increase it.
  const [lifeExpectancy, setLifeExpectancy] = useState(40); 

  const nextLevel = () => setLevel(prev => prev + 1);
  
  const updateLife = (years: number) => {
    setLifeExpectancy(prev => Math.max(0, Math.min(100, prev + years)));
  };

  return (
    <main className="text-white selection:bg-neon-pink selection:text-white bg-dark-bg min-h-screen overflow-hidden">
      
      {/* Global Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {level === 0 && (
          <motion.div key="lvl0" exit={{ opacity: 0, filter: "blur(20px)" }} className="absolute inset-0 z-10">
             <Landing onComplete={nextLevel} updateLife={updateLife} />
          </motion.div>
        )}
        
        {level === 1 && (
          <motion.div key="lvl1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -1000 }} className="absolute inset-0 z-10">
             <AssetSorter onComplete={nextLevel} updateLife={updateLife} />
          </motion.div>
        )}
        
        {level === 2 && (
          <motion.div key="lvl2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="absolute inset-0 z-10">
             <TimelineGrammar onComplete={nextLevel} />
          </motion.div>
        )}
        
        {level === 3 && (
          <motion.div key="lvl3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10">
             <NeuralCalibration onComplete={nextLevel} updateLife={updateLife} />
          </motion.div>
        )}
        
        {level === 4 && (
          <motion.div key="lvl4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10">
             <TimeCapsule lifeExpectancy={lifeExpectancy} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent HUD (Heads Up Display) */}
      {level > 0 && (
        <div className="fixed top-0 w-full z-50 flex justify-between items-center p-6 pointer-events-none mix-blend-exclusion">
          <div className="flex flex-col">
            <div className="text-[10px] font-mono text-gray-400">TEMPORA OS v4.0</div>
            <div className="text-xs text-neon-cyan font-bold tracking-widest">
                SEQUENCE: {['INIT', 'SORT', 'SYNC', 'TEST', 'SAVE'][level]}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="text-[10px] font-mono text-gray-400 uppercase">Life Expectancy</div>
             <motion.div 
               key={lifeExpectancy}
               initial={{ scale: 1.5, color: "#fff" }}
               animate={{ scale: 1, color: lifeExpectancy < 20 ? "#ff0055" : "#00ff99" }}
               className="text-2xl font-display font-black tracking-tighter"
             >
                {lifeExpectancy} YEARS
             </motion.div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;