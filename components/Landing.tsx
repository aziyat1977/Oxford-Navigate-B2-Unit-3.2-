import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const requestRef = useRef<number>();

  // Countdown Effect
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

  // Biometric Scan Logic
  const updateProgress = () => {
    if (isHolding) {
      setProgress((prev) => {
        const next = prev + 1.5; 
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

  // Quiz Logic
  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === diagnosticQuestions[qIndex].a) {
        setScore(prev => prev + 1);
        updateLife(2); // Bonus years for correct logic
    } else {
        updateLife(-2); // Cost of failure
    }
    
    if (qIndex + 1 < diagnosticQuestions.length) {
        setQIndex(prev => prev + 1);
    } else {
        setPhase('result');
    }
  };

  useEffect(() => {
      if (phase === 'result') {
          const timer = setTimeout(onComplete, 4500);
          return () => clearTimeout(timer);
      }
  }, [phase, onComplete]);

  // Persona Logic based on score
  const getPersona = () => {
      if (score === 5) return { title: "CHRONO-ARCHITECT", color: "text-neon-green", desc: "Temporal awareness maximum." };
      if (score >= 3) return { title: "TIME DRIFTER", color: "text-neon-yellow", desc: "Potential detected. Calibration needed." };
      return { title: "ENTROPY VICTIM", color: "text-neon-pink", desc: "Urgent intervention required." };
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative select-none font-mono text-white">
      
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: THE DROP */}
        {phase === 'countdown' && (
             <motion.div key="intro" exit={{opacity: 0}} className="text-center z-20">
                 <h2 className="text-neon-green text-xs tracking-[1em] mb-4 animate-pulse">INITIATING DROP</h2>
                 <h1 className="text-9xl font-display font-black text-white mix-blend-overlay">
                    {count.toLocaleString()}
                 </h1>
             </motion.div>
        )}

        {/* PHASE 2: BIOMETRIC SCAN */}
        {phase === 'scan' && (
          <motion.div 
            key="scan-ui"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10"
          >
             <p className="mb-8 text-xs text-slate-500 uppercase tracking-widest text-center">
                 Identity Verification Required <br/>
                 <span className="text-neon-pink">Do not remove finger</span>
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
                   className="w-32 h-40 border border-slate-800 bg-slate-900/80 rounded flex items-center justify-center relative overflow-hidden"
                   whileTap={{ scale: 0.98 }}
                 >
                    {isHolding && (
                      <motion.div className="absolute w-full h-1 bg-neon-green shadow-[0_0_30px_#00ff99] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                    )}
                    
                    <svg className={`w-16 h-16 ${isHolding ? 'text-neon-green' : 'text-slate-700'} transition-colors duration-200`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.71c-.16 0-.32-.1-.4-.26-.11-.22-.2-.44-.28-.67-.1-.28.05-.58.32-.67.28-.1.58.05.67.32.08.23.16.44.26.66.1.2.02.44-.19.56-.12.04-.26.06-.38.06zm17.6 2.54c-.26-.06-.42-.32-.36-.58.05-.23.1-.46.13-.68.04-.29.3-.49.58-.45.29.04.49.3.45.58-.04.24-.09.49-.14.74-.04.2-.21.35-.41.39-.08.01-.17 0-.25 0zM12 20c-3.1 0-5.83-1.66-7.38-4.14-.15-.24-.08-.55.16-.7.24-.15.55-.08.7.16C6.79 17.52 9.24 19 12 19c2.76 0 5.21-1.48 6.52-3.68.15-.24.46-.31.7-.16.24.15.31.46.16.7C17.83 18.34 15.1 20 12 20z"/>
                    </svg>

                    {/* Glitch Overlay within button */}
                    {isHolding && <div className="absolute inset-0 bg-neon-green/10 animate-pulse" />}
                 </motion.div>
                 
                 {/* Radial Progress */}
                 <svg className="absolute -top-4 -left-4 w-40 h-48 pointer-events-none" viewBox="0 0 100 120">
                    <circle cx="50" cy="60" r="48" stroke="#1e293b" strokeWidth="2" fill="none" />
                    <motion.circle 
                       cx="50" cy="60" r="48"
                       stroke="#00ff99" strokeWidth="2" fill="none"
                       strokeDasharray="300"
                       strokeDashoffset={300 - (300 * progress) / 100}
                       strokeLinecap="round"
                       transform="rotate(-90 50 60)"
                    />
                 </svg>
              </div>
          </motion.div>
        )}

        {/* PHASE 3: DIAGNOSTIC */}
        {phase === 'diagnostic' && (
          <motion.div
            key="quiz-ui"
            initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-xl px-6 z-20"
          >
             <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-neon-pink animate-pulse"></div>
                     <span className="text-[10px] text-neon-pink font-bold tracking-widest uppercase">Live Audit</span>
                 </div>
                 <div className="font-mono text-slate-500 text-xs">Q.{qIndex + 1}_05</div>
             </div>

             <motion.div key={qIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <p className="text-2xl md:text-3xl font-display leading-relaxed mb-10">
                    {diagnosticQuestions[qIndex].q.split("_____").map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i === 0 && <span className="inline-block w-24 border-b-2 border-slate-600 mx-2"></span>}
                        </React.Fragment>
                    ))}
                 </p>
             </motion.div>

             <div className="flex flex-col gap-3">
                 {diagnosticQuestions[qIndex].options.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="group relative p-4 border border-slate-800 bg-slate-900/50 hover:bg-neon-green/10 hover:border-neon-green text-left transition-all overflow-hidden"
                     >
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-neon-green transition-colors" />
                         <span className="relative z-10 font-mono text-sm md:text-base pl-4 group-hover:pl-6 transition-all">{opt}</span>
                     </button>
                 ))}
             </div>
          </motion.div>
        )}

        {/* PHASE 4: RESULT / PERSONA */}
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
             <p className="font-mono text-white mb-8 border-t border-b border-slate-800 py-4 max-w-md mx-auto">
                {getPersona().desc}
             </p>
             <div className="flex justify-center gap-2">
                 <div className="w-1 h-8 bg-neon-green animate-scan"></div>
                 <div className="w-1 h-8 bg-neon-green animate-scan delay-75"></div>
                 <div className="w-1 h-8 bg-neon-green animate-scan delay-150"></div>
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Landing;