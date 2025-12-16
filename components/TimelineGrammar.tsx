import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineProps {
  onComplete: () => void;
}

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'scene1' | 'check1' | 'scene2' | 'check2' | 'finish'>('intro');
  const [error, setError] = useState(false);

  // CCQ Verification Logic
  const verify = (correct: boolean, nextStage: any) => {
    if (correct) {
      setError(false);
      setStage(nextStage);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800); // Shake effect reset
    }
  };

  return (
    <div className="h-screen w-full bg-black relative font-mono text-white overflow-hidden flex items-center justify-center">
      
      {/* Background Parallax Stars/Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-50" />

      <AnimatePresence mode="wait">
        
        {/* 1. INTRO: The Mission Brief */}
        {stage === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }}
            className="max-w-xl p-8 border-l-2 border-neon-green bg-slate-900/50 backdrop-blur-sm"
          >
            <h1 className="text-4xl font-display font-bold text-white mb-4">TIMELINE DECRYPTION</h1>
            <p className="text-slate-400 mb-6">
              To proceed, you must analyze future temporal data. <br/>
              <span className="text-neon-green">Identify the patterns correctly to unlock the firewall.</span>
            </p>
            <button 
              onClick={() => setStage('scene1')}
              className="px-6 py-3 bg-white text-black font-bold hover:bg-neon-green transition-colors clip-path-polygon"
            >
              START DECRYPTION
            </button>
          </motion.div>
        )}

        {/* 2. SCENE 1: Future Continuous (The Video Metaphor) */}
        {stage === 'scene1' && (
           <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
               <div className="mb-6 relative w-64 h-40 mx-auto border-2 border-neon-cyan bg-black flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-neon-cyan/10 animate-pulse" />
                   <span className="text-4xl">🤖 ⌨️</span>
                   <div className="absolute bottom-2 right-2 text-[10px] text-neon-cyan">LIVE FEED: 2030</div>
               </div>
               
               <p className="text-xl mb-8">
                 "Don't call me at 8 PM. I <span className="bg-neon-cyan/20 text-neon-cyan px-2">will be coding</span> the mainframe."
               </p>

               <div className="flex gap-4 justify-center">
                  <button onClick={() => setStage('check1')} className="px-6 py-2 border border-slate-700 hover:border-white transition-all">
                    ANALYZE GRAMMAR
                  </button>
               </div>
           </motion.div>
        )}

        {/* 3. CCQ 1: Concept Checking (Inductive) */}
        {stage === 'check1' && (
          <motion.div 
            key="c1" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: error ? [0, -10, 10, 0] : 0 }} 
            className="max-w-md w-full p-6 border border-slate-800 bg-black"
          >
             <h3 className="text-neon-cyan text-sm tracking-widest mb-4">DECRYPTION CHALLENGE 01</h3>
             <p className="mb-6 text-lg">At 8 PM, is the action finished?</p>
             
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => verify(false, '')}
                 className="p-4 border border-slate-700 hover:bg-red-500/20 hover:border-red-500 transition-all text-slate-400 hover:text-white"
               >
                 YES (Finished)
               </button>
               <button 
                 onClick={() => verify(true, 'scene2')}
                 className="p-4 border border-slate-700 hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all text-white"
               >
                 NO (In Progress)
               </button>
             </div>
             {error && <div className="mt-4 text-red-500 text-xs text-center font-bold">ACCESS DENIED. TRY AGAIN.</div>}
          </motion.div>
        )}

        {/* 4. SCENE 2: Future Perfect (The Checklist Metaphor) */}
        {stage === 'scene2' && (
           <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
               <div className="mb-6 relative w-64 h-40 mx-auto border-2 border-neon-pink bg-black flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-neon-pink/5" />
                   <span className="text-4xl">✅ 🏆</span>
                   <div className="absolute bottom-2 right-2 text-[10px] text-neon-pink">STATUS: COMPLETE</div>
               </div>
               
               <p className="text-xl mb-8">
                 "By 2035, I <span className="bg-neon-pink/20 text-neon-pink px-2">will have finished</span> the project."
               </p>

               <div className="flex gap-4 justify-center">
                  <button onClick={() => setStage('check2')} className="px-6 py-2 border border-slate-700 hover:border-white transition-all">
                    ANALYZE GRAMMAR
                  </button>
               </div>
           </motion.div>
        )}

        {/* 5. CCQ 2: Concept Checking */}
        {stage === 'check2' && (
          <motion.div 
            key="c2" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: error ? [0, -10, 10, 0] : 0 }} 
            className="max-w-md w-full p-6 border border-slate-800 bg-black"
          >
             <h3 className="text-neon-pink text-sm tracking-widest mb-4">DECRYPTION CHALLENGE 02</h3>
             <p className="mb-6 text-lg">Does "By 2035" mean before or exactly at that time?</p>
             
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => verify(true, 'finish')}
                 className="p-4 border border-slate-700 hover:bg-neon-pink/20 hover:border-neon-pink transition-all text-white"
               >
                 BEFORE (Completed)
               </button>
               <button 
                 onClick={() => verify(false, '')}
                 className="p-4 border border-slate-700 hover:bg-red-500/20 hover:border-red-500 transition-all text-slate-400 hover:text-white"
               >
                 EXACTLY AT (Starting)
               </button>
             </div>
             {error && <div className="mt-4 text-red-500 text-xs text-center font-bold">ACCESS DENIED. THINK ABOUT 'DEADLINES'.</div>}
          </motion.div>
        )}

        {/* 6. FINISH: Summary Rule Download */}
        {stage === 'finish' && (
           <motion.div key="fin" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 border-2 border-neon-green rounded bg-slate-900/80">
               <h2 className="text-2xl text-white font-bold mb-4">DATA DOWNLOADED</h2>
               <div className="text-left space-y-4 mb-8 text-sm text-slate-300 font-mono">
                   <p><span className="text-neon-cyan font-bold">Future Continuous:</span> Action in progress. (will be -ing)</p>
                   <p><span className="text-neon-pink font-bold">Future Perfect:</span> Action completed. (will have -ed)</p>
               </div>
               <button 
                onClick={onComplete}
                className="w-full py-4 bg-neon-green text-black font-black hover:bg-white hover:scale-105 transition-all"
               >
                   INITIATE NEURAL LINK
               </button>
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TimelineGrammar;