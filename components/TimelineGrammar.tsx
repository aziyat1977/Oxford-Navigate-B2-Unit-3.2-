import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface TimelineProps {
  onComplete: () => void;
}

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'scene1' | 'check1' | 'scene2' | 'check2' | 'finish'>('intro');
  const [error, setError] = useState(false);

  // Auto-advance logic for finish stage
  useEffect(() => {
    if (stage === 'finish') {
      playSound('success');
      const timer = setTimeout(onComplete, 5000); // 5 seconds to read
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  // CCQ Verification Logic
  const verify = (correct: boolean, nextStage: any) => {
    if (correct) {
      playSound('success');
      setError(false);
      setStage(nextStage);
    } else {
      playSound('error');
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="h-full w-full bg-parchment dark:bg-obsidian relative font-body text-ink dark:text-parchment overflow-hidden flex items-center justify-center transition-colors">
      
      {/* Background */}
      <div className="absolute inset-0 bg-paper-texture dark:bg-leather-texture opacity-50" />
      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-magic-gold to-transparent opacity-50" />
      <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-crimson to-transparent opacity-50" />

      <AnimatePresence mode="wait">
        
        {/* 1. INTRO: The Library */}
        {stage === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }}
            className="max-w-xl p-10 border-4 border-double border-ink dark:border-magic-gold bg-parchment shadow-2xl rounded-sm relative mx-4"
          >
            {/* Wax Seal Decoration */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-crimson rounded-full border-4 border-white/20 shadow-md"></div>

            <h1 className="text-4xl font-display font-bold mb-4 text-center mt-4">The Prophecy Scrolls</h1>
            <p className="text-xl italic mb-8 text-center">
              To weave time, you must understand the difference between <br/>
              <span className="text-mystic-blue font-bold">The Flow</span> and <span className="text-crimson font-bold">The Mark</span>.
            </p>
            <button 
              onClick={() => { playSound('click'); setStage('scene1'); }}
              className="w-full px-6 py-3 bg-ink text-parchment font-bold hover:bg-crimson active:scale-95 transition-all font-display text-lg rounded-sm"
            >
              Unfurl the First Scroll
            </button>
          </motion.div>
        )}

        {/* 2. SCENE 1: Future Continuous (Scrying) */}
        {stage === 'scene1' && (
           <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-2xl px-4">
               
               {/* Scrying Mirror Visual */}
               <div className="mb-8 relative w-48 h-64 mx-auto border-8 border-silver rounded-full bg-deep-purple flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(75,0,130,0.6)]">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-spin-slow opacity-50" />
                   <span className="text-5xl relative z-10">🔮</span>
                   <div className="absolute bottom-4 text-xs font-rune text-white">Vision: Sunset</div>
               </div>
               
               <p className="text-2xl mb-8 font-body leading-relaxed">
                 "Do not disturb the wizard at sunset. He <span className="text-mystic-blue font-bold border-b-2 border-mystic-blue">will be casting</span> the spell."
               </p>

               <button onClick={() => { playSound('click'); setStage('check1'); }} className="px-8 py-3 border-2 border-ink dark:border-parchment hover:bg-ink hover:text-parchment active:scale-95 transition-all font-display text-lg">
                 Interpret the Vision
               </button>
           </motion.div>
        )}

        {/* 3. CCQ 1 */}
        {stage === 'check1' && (
          <motion.div 
            key="c1" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: error ? [0, -10, 10, 0] : 0 }} 
            className="max-w-md w-full p-8 bg-parchment border-4 border-ink shadow-2xl relative mx-4"
          >
             <h3 className="text-mystic-blue font-display text-lg mb-4 text-center">The Riddle of the Flow</h3>
             <p className="mb-8 text-xl text-center italic">At sunset, is the spell finished?</p>
             
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => verify(false, '')}
                 className="p-4 border-2 border-ink hover:bg-crimson hover:text-white active:scale-95 transition-all font-bold"
               >
                 YES <br/>(It is done)
               </button>
               <button 
                 onClick={() => verify(true, 'scene2')}
                 className="p-4 border-2 border-ink hover:bg-mystic-blue hover:text-white active:scale-95 transition-all font-bold"
               >
                 NO <br/>(It is happening)
               </button>
             </div>
             {error && <div className="mt-4 text-crimson text-center font-bold">"Your inner eye is clouded. Look again."</div>}
          </motion.div>
        )}

        {/* 4. SCENE 2: Future Perfect (Completed Quest) */}
        {stage === 'scene2' && (
           <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-2xl px-4">
               
               {/* Quest Board Visual */}
               <div className="mb-8 relative w-64 h-48 mx-auto bg-[#3e2723] border-4 border-[#5d4037] rounded shadow-lg flex items-center justify-center p-4">
                   <div className="bg-parchment w-full h-full flex flex-col items-center justify-center shadow-inner">
                        <span className="text-5xl mb-2">📜</span>
                        <span className="text-crimson font-display font-bold text-2xl rotate-[-10deg] border-4 border-crimson px-2 rounded">DONE</span>
                   </div>
               </div>
               
               <p className="text-2xl mb-8 font-body leading-relaxed">
                 "By the next moon, I <span className="text-crimson font-bold border-b-2 border-crimson">will have slain</span> the dragon."
               </p>

               <button onClick={() => { playSound('click'); setStage('check2'); }} className="px-8 py-3 border-2 border-ink dark:border-parchment hover:bg-ink hover:text-parchment active:scale-95 transition-all font-display text-lg">
                 Interpret the Vow
               </button>
           </motion.div>
        )}

        {/* 5. CCQ 2 */}
        {stage === 'check2' && (
          <motion.div 
            key="c2" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: error ? [0, -10, 10, 0] : 0 }} 
            className="max-w-md w-full p-8 bg-parchment border-4 border-ink shadow-2xl relative mx-4"
          >
             <h3 className="text-crimson font-display text-lg mb-4 text-center">The Riddle of the Mark</h3>
             <p className="mb-8 text-xl text-center italic">Does "By the next moon" mean before or at that moment?</p>
             
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => verify(true, 'finish')}
                 className="p-4 border-2 border-ink hover:bg-crimson hover:text-white active:scale-95 transition-all font-bold"
               >
                 BEFORE <br/>(Completed)
               </button>
               <button 
                 onClick={() => verify(false, '')}
                 className="p-4 border-2 border-ink hover:bg-mystic-blue hover:text-white active:scale-95 transition-all font-bold"
               >
                 EXACTLY AT <br/>(Starting)
               </button>
             </div>
             {error && <div className="mt-4 text-crimson text-center font-bold">"Look to the deadline, apprentice."</div>}
          </motion.div>
        )}

        {/* 6. FINISH (Automatic Transition) */}
        {stage === 'finish' && (
           <motion.div key="fin" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 border-4 border-double border-magic-gold rounded-lg bg-obsidian text-parchment shadow-2xl max-w-lg mx-4">
               <h2 className="text-3xl font-display font-bold mb-6 text-magic-gold">Knowledge Inscribed</h2>
               <div className="text-left space-y-6 mb-10 text-lg font-body">
                   <p><span className="text-mystic-blue font-bold text-xl">Future Continuous:</span><br/> The spell is casting. (will be -ing)</p>
                   <p><span className="text-crimson font-bold text-xl">Future Perfect:</span><br/> The quest is complete. (will have -ed)</p>
               </div>
               
               {/* Auto-advance loader */}
               <div className="w-full bg-ink/50 h-2 rounded-full overflow-hidden mt-8">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-magic-gold"
                  />
               </div>
               <p className="text-xs font-rune mt-2 text-magic-gold/80 animate-pulse">
                   Opening the Realm Gate...
               </p>
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TimelineGrammar;