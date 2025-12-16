import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface LandingProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const diagnosticQuestions = [
  { q: "Don't call me at 8:00. I _____ the football match.", options: ["will have watched", "will be watching"], a: 1 },
  { q: "By the time we get there, the store _____.", options: ["will be closing", "will have closed"], a: 1 },
  { q: "This time next year, I _____ in London.", options: ["will have lived", "will be living"], a: 1 },
  { q: "I _____ tomorrow, so let's meet for coffee.", options: ["won't have worked", "won't be working"], a: 1 },
  { q: "By 10 PM, I _____ all the pizza.", options: ["will be eating", "will have eaten"], a: 1 },
];

const Landing: React.FC<LandingProps> = ({ onComplete, updateLife }) => {
  const [phase, setPhase] = useState<'countdown' | 'scan' | 'diagnostic' | 'result'>('countdown');
  const [count, setCount] = useState(86400);
  const [isHolding, setIsHolding] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  const requestRef = useRef<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.max(0, prev - Math.floor(Math.random() * 243)));
    }, 50);
    if (phase !== 'countdown') clearInterval(interval);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('scan'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateProgress = () => {
    if (isHolding) {
      setProgress((prev) => {
        const next = prev + 1.5; 
        if (next >= 100) {
          playSound('success');
          setPhase('diagnostic');
          return 100;
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    if (isHolding) {
      playSound('hover'); // Continuous-ish sound
      requestRef.current = requestAnimationFrame(updateProgress);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isHolding]);

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === diagnosticQuestions[qIndex].a;
    
    if (isCorrect) {
        playSound('success');
        setFeedbackState('correct');
        setScore(prev => prev + 1);
        updateLife(2);
    } else {
        playSound('error');
        setFeedbackState('incorrect');
        updateLife(-2);
    }

    setTimeout(() => {
       setFeedbackState('neutral');
       if (qIndex + 1 < diagnosticQuestions.length) {
           setQIndex(prev => prev + 1);
       } else {
           setPhase('result');
       }
    }, 600);
  };

  useEffect(() => {
      if (phase === 'result') {
          const timer = setTimeout(onComplete, 4500);
          return () => clearTimeout(timer);
      }
  }, [phase, onComplete]);

  const getPersona = () => {
      if (score === 5) return { title: "CHRONO-ARCHITECT", color: "text-emerald-600 dark:text-neon-green", desc: "Temporal awareness maximum." };
      if (score >= 3) return { title: "TIME DRIFTER", color: "text-yellow-600 dark:text-neon-yellow", desc: "Potential detected. Calibration needed." };
      return { title: "ENTROPY VICTIM", color: "text-red-600 dark:text-neon-pink", desc: "Urgent intervention required." };
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative select-none font-mono">
      
      <AnimatePresence mode="wait">
        
        {phase === 'countdown' && (
             <motion.div key="intro" exit={{opacity: 0}} className="text-center z-20">
                 <h2 className="text-emerald-600 dark:text-neon-green text-xs tracking-[1em] mb-4 animate-pulse">INITIATING DROP</h2>
                 <h1 className="text-8xl md:text-9xl font-display font-black text-slate-200 dark:text-white dark:mix-blend-overlay">
                    {count.toLocaleString()}
                 </h1>
             </motion.div>
        )}

        {phase === 'scan' && (
          <motion.div 
            key="scan-ui"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10"
          >
             <p className="mb-8 text-xs text-slate-500 uppercase tracking-widest text-center">
                 Identity Verification Required <br/>
                 <span className="text-red-600 dark:text-neon-pink">Do not remove finger</span>
             </p>

              <div 
                className="relative group cursor-pointer"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
              >
                 <motion.div 
                   className="w-32 h-40 border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 rounded flex items-center justify-center relative overflow-hidden shadow-lg"
                   whileTap={{ scale: 0.98 }}
                 >
                    {isHolding && (
                      <motion.div className="absolute w-full h-1 bg-emerald-500 dark:bg-neon-green shadow-[0_0_30px_#00ff99] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                    )}
                    
                    <svg className={`w-16 h-16 ${isHolding ? 'text-emerald-600 dark:text-neon-green' : 'text-slate-400 dark:text-slate-700'} transition-colors duration-200`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.71c-.16 0-.32-.1-.4-.26-.11-.22-.2-.44-.28-.67-.1-.28.05-.58.32-.67.28-.1.58.05.67.32.08.23.16.44.26.66.1.2.02.44-.19.56-.12.04-.26.06-.38.06zm17.6 2.54c-.26-.06-.42-.32-.36-.58.05-.23.1-.46.13-.68.04-.29.3-.49.58-.45.29.04.49.3.45.58-.04.24-.09.49-.14.74-.04.2-.21.35-.41.39-.08.01-.17 0-.25 0zM12 20c-3.1 0-5.83-1.66-7.38-4.14-.15-.24-.08-.55.16-.7.24-.15.55-.08.7.16C6.79 17.52 9.24 19 12 19c2.76 0 5.21-1.48 6.52-3.68.15-.24.46-.31.7-.16.24.15.31.46.16.7C17.83 18.34 15.1 20 12 20z"/>
                    </svg>
                 </motion.div>
                 
                 <svg className="absolute -top-4 -left-4 w-40 h-48 pointer-events-none" viewBox="0 0 100 120">
                    <circle cx="50" cy="60" r="48" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="2" fill="none" />
                    <motion.circle 
                       cx="50" cy="60" r="48"
                       stroke="currentColor" className="text-emerald-500 dark:text-neon-green" strokeWidth="2" fill="none"
                       strokeDasharray="300"
                       strokeDashoffset={300 - (300 * progress) / 100}
                       strokeLinecap="round"
                       transform="rotate(-90 50 60)"
                    />
                 </svg>
              </div>
          </motion.div>
        )}

        {phase === 'diagnostic' && (
          <motion.div
            key="quiz-ui"
            initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, x: -100 }}
            className={`w-full max-w-xl px-6 z-20 rounded-xl p-8 transition-colors duration-300
              ${feedbackState === 'correct' ? 'bg-emerald-100/20 dark:bg-neon-green/10' : ''}
              ${feedbackState === 'incorrect' ? 'bg-red-100/20 dark:bg-neon-pink/10' : ''}
            `}
          >
             <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-red-500 dark:bg-neon-pink animate-pulse"></div>
                     <span className="text-[10px] text-red-500 dark:text-neon-pink font-bold tracking-widest uppercase">Live Audit</span>
                 </div>
                 <div className="font-mono text-slate-400 text-xs">Q.{qIndex + 1}_05</div>
             </div>

             <motion.div key={qIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <p className="text-2xl md:text-3xl font-display leading-relaxed mb-10 text-slate-900 dark:text-white">
                    {diagnosticQuestions[qIndex].q.split("_____").map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i === 0 && <span className="inline-block w-24 border-b-2 border-slate-400 dark:border-slate-600 mx-2"></span>}
                        </React.Fragment>
                    ))}
                 </p>
             </motion.div>

             <div className="flex flex-col gap-3">
                 {diagnosticQuestions[qIndex].options.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        onMouseEnter={() => playSound('hover')}
                        className="group relative p-4 border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-emerald-500/10 dark:hover:bg-neon-green/10 hover:border-emerald-500 dark:hover:border-neon-green text-left transition-all overflow-hidden text-slate-900 dark:text-white"
                     >
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-800 group-hover:bg-emerald-500 dark:group-hover:bg-neon-green transition-colors" />
                         <span className="relative z-10 font-mono text-sm md:text-base pl-4 group-hover:pl-6 transition-all">{opt}</span>
                     </button>
                 ))}
             </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
             key="result-ui"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-center z-20 px-4"
          >
             <div className="mb-2 text-[10px] text-slate-500 uppercase tracking-widest">Analysis Complete</div>
             <h1 className={`text-5xl md:text-7xl font-display font-black mb-4 ${getPersona().color} animate-glitch`}>
               {getPersona().title}
             </h1>
             <p className="font-mono text-slate-700 dark:text-white mb-8 border-t border-b border-slate-300 dark:border-slate-800 py-4 max-w-md mx-auto">
                {getPersona().desc}
             </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Landing;