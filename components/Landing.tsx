import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingProps {
  onComplete: () => void;
}

const diagnosticQuestions = [
  { q: "Don't call me at 8:00. I _____ the football match.", options: ["will have watched", "will be watching"], a: 1 },
  { q: "By the time we get there, the store _____.", options: ["will be closing", "will have closed"], a: 1 },
  { q: "This time next year, I _____ in London.", options: ["will have lived", "will be living"], a: 1 },
  { q: "_____ the report by Friday?", options: ["Will you have finished", "Will you be finishing"], a: 0 },
  { q: "In 2050, everyone _____ electric cars.", options: ["will be driving", "will have driven"], a: 0 },
  { q: "I _____ tomorrow, so let's meet for coffee.", options: ["won't have worked", "won't be working"], a: 1 },
  { q: "By the end of the trip, we _____ five countries.", options: ["will be visiting", "will have visited"], a: 1 },
  { q: "At midnight, I _____, so please be quiet.", options: ["will have slept", "will be sleeping"], a: 1 },
  { q: "She _____ her first book by the age of 25.", options: ["will have written", "will be writing"], a: 0 },
  { q: "The government says they _____ the bridge by 2030.", options: ["will have built", "will be building"], a: 0 },
  { q: "Unfortunately, at the party, I _____ for my exam.", options: ["will be studying", "will have studied"], a: 0 },
  { q: "By 10 PM, I _____ all the pizza.", options: ["will be eating", "will have eaten"], a: 1 },
  { q: "Can we meet later? I _____ for a call right now.", options: ["will have waited", "will be waiting"], a: 1 },
  { q: "In ten years' time, robots _____ all the hard work.", options: ["will be doing", "will have done"], a: 0 },
  { q: "By next June, we _____ married for 10 years.", options: ["will have been", "will be being"], a: 0 },
];

const Landing: React.FC<LandingProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'countdown' | 'scan' | 'diagnostic' | 'result'>('countdown');
  const [count, setCount] = useState(86400);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>();

  // Phase 1: Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.max(0, prev - Math.floor(Math.random() * 123)));
    }, 50);
    if (phase !== 'countdown') clearInterval(interval);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('scan'), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Scanner Logic
  const updateProgress = () => {
    if (isHolding) {
      setProgress((prev) => {
        const next = prev + 1; 
        if (next >= 100) {
          setPhase('diagnostic');
          return 100;
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    if (isHolding) requestRef.current = requestAnimationFrame(updateProgress);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isHolding]);

  // Phase 3: Diagnostic Logic
  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === diagnosticQuestions[qIndex].a) {
        setScore(prev => prev + 1);
    }
    
    if (qIndex + 1 < diagnosticQuestions.length) {
        setQIndex(prev => prev + 1);
    } else {
        setPhase('result');
    }
  };

  useEffect(() => {
      if (phase === 'result') {
          const timer = setTimeout(onComplete, 4000);
          return () => clearTimeout(timer);
      }
  }, [phase, onComplete]);

  return (
    <div className="h-screen w-full bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden select-none font-mono text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* PHASE 1 & 2: INTRO */}
        {(phase === 'countdown' || phase === 'scan') && (
          <motion.div 
            key="scan-ui"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="flex flex-col items-center z-10"
          >
            <div className="text-center mb-12">
               <h2 className="text-neon-green text-xs tracking-[0.5em] mb-4 animate-pulse">TEMPORAL AGENCY</h2>
               <h1 className="text-7xl md:text-9xl font-display font-black text-white mix-blend-screen drop-shadow-[0_0_15px_rgba(0,255,153,0.5)]">
                 {count.toLocaleString()}
               </h1>
               <p className="mt-4 text-slate-500 text-xs uppercase tracking-widest">
                 TIME = MONEY <span className="mx-2">|</span> STATUS: <span className="text-white">UNVERIFIED</span>
               </p>
            </div>

            {phase === 'scan' && (
              <div 
                className="relative group cursor-pointer"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
              >
                 <motion.div 
                   className="w-24 h-32 border border-slate-700 bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden"
                   whileTap={{ scale: 0.95 }}
                 >
                    {isHolding && (
                      <motion.div className="absolute w-full h-1 bg-neon-green shadow-[0_0_20px_#00ff99] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                    <svg className={`w-12 h-12 ${isHolding ? 'text-neon-green' : 'text-slate-600'} transition-colors`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 8z"/>
                    </svg>
                 </motion.div>
                 
                 <svg className="absolute -top-3 -left-3 w-30 h-38 pointer-events-none w-[120px] h-[150px]" viewBox="0 0 120 150">
                    <motion.path 
                       d="M 60 10 A 50 50 0 0 1 60 140 A 50 50 0 0 1 60 10"
                       fill="none" stroke="#00ff99" strokeWidth="2"
                       strokeDasharray="360"
                       strokeDashoffset={360 - (360 * progress) / 100}
                    />
                 </svg>
                 <div className="absolute -bottom-10 left-0 w-full text-center text-[10px] text-neon-green font-mono">
                    {isHolding ? `LOADING DIAGNOSTIC...` : "HOLD TO LOGIN"}
                 </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PHASE 3: DIAGNOSTIC QUIZ */}
        {phase === 'diagnostic' && (
          <motion.div
            key="quiz-ui"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl px-6 z-20"
          >
             <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
                 <h3 className="text-neon-pink text-xs font-bold tracking-widest">PLACEMENT TEST</h3>
                 <span className="font-mono text-slate-500 text-xs">{qIndex + 1} / {diagnosticQuestions.length}</span>
             </div>

             <motion.div 
                key={qIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
             >
                 <p className="text-2xl md:text-3xl font-display leading-tight">
                    {diagnosticQuestions[qIndex].q.split("_____").map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i === 0 && <span className="inline-block w-20 border-b-2 border-neon-green animate-pulse mx-2"></span>}
                        </React.Fragment>
                    ))}
                 </p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {diagnosticQuestions[qIndex].options.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="p-6 border border-slate-700 hover:border-neon-green hover:bg-neon-green/10 text-left transition-all rounded group"
                     >
                         <span className="text-slate-500 mr-4 group-hover:text-neon-green">{String.fromCharCode(65 + i)})</span>
                         <span className="font-mono text-lg">{opt}</span>
                     </button>
                 ))}
             </div>
          </motion.div>
        )}

        {/* PHASE 4: RESULT */}
        {phase === 'result' && (
          <motion.div
             key="result-ui"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-center z-20"
          >
             <h1 className="text-6xl font-display font-black text-white mb-2">
               SCORE: <span className={score > 10 ? "text-neon-green" : "text-neon-pink"}>{Math.round((score / 15) * 100)}%</span>
             </h1>
             <p className="font-mono text-slate-400 mb-8 uppercase tracking-widest">
                {score > 12 ? "Advanced Knowledge Detected" : "Temporal Dissonance Detected"}
             </p>
             <div className="inline-block px-6 py-2 border border-neon-green text-neon-green font-bold animate-pulse">
                 INITIATING TRAINING PROTOCOL...
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Landing;