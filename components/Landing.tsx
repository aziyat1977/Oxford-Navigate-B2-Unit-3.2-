import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingProps {
  onComplete: () => void;
}

const Landing: React.FC<LandingProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'countdown' | 'scan' | 'diagnostic' | 'result'>('countdown');
  const [count, setCount] = useState(86400);
  const [progress, setProgress] = useState(0);
  const [diagInput, setDiagInput] = useState('');
  const [isHolding, setIsHolding] = useState(false);
  const requestRef = useRef<number>();

  // Phase 1: Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.max(0, prev - Math.floor(Math.random() * 123)));
    }, 50);
    if (phase !== 'countdown') clearInterval(interval);
    return () => clearInterval(interval);
  }, [phase]);

  // Transition from Countdown to Scan
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
  const handleDiagnosticSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase('result');
    setTimeout(onComplete, 4000);
  };

  return (
    <div className="h-screen w-full bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden select-none font-mono text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* PHASE 1 & 2: COUNTDOWN & SCAN */}
        {(phase === 'countdown' || phase === 'scan') && (
          <motion.div 
            key="scan-ui"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="flex flex-col items-center z-10"
          >
            <div className="text-center mb-12">
               <h2 className="text-neon-green text-xs tracking-[0.5em] mb-4 animate-pulse">TEMPORAL AUDIT</h2>
               <h1 className="text-7xl md:text-9xl font-display font-black text-white mix-blend-screen drop-shadow-[0_0_15px_rgba(0,255,153,0.5)]">
                 {count.toLocaleString()}
               </h1>
               <p className="mt-4 text-slate-500 text-xs uppercase tracking-widest">
                 Seconds Remaining <span className="mx-2">|</span> Status: <span className="text-white">Time Billionaire</span>
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
                    {isHolding ? `SYNCING ${Math.floor(progress)}%` : "HOLD TO SCAN"}
                 </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PHASE 3: DIAGNOSTIC ROLEPLAY */}
        {phase === 'diagnostic' && (
          <motion.div
            key="diag-ui"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-xl px-6 z-20"
          >
             <div className="border-l-2 border-neon-pink pl-6 mb-8">
                <h3 className="text-neon-pink text-xs font-bold tracking-widest mb-1">SIMULATION: 2040 REUNION</h3>
                <p className="text-slate-300 font-display text-2xl leading-tight">
                  "Hey! Long time no see. It's 2040. <br/>
                  <span className="text-white font-bold">What are you doing with your life these days?</span>"
                </p>
             </div>

             <form onSubmit={handleDiagnosticSubmit} className="relative">
                <input 
                  autoFocus
                  type="text" 
                  value={diagInput}
                  onChange={(e) => setDiagInput(e.target.value)}
                  placeholder="I will..."
                  className="w-full bg-black border-b-2 border-slate-700 text-2xl text-neon-green py-4 focus:outline-none focus:border-neon-green font-mono placeholder:text-slate-700"
                />
                <button type="submit" className="absolute right-0 bottom-4 text-slate-500 hover:text-white transition-colors">
                  SEND ↵
                </button>
             </form>
             <p className="mt-4 text-[10px] text-slate-500 uppercase">
                *Pro Tip: Don't sound basic.
             </p>
          </motion.div>
        )}

        {/* PHASE 4: RESULT / GLITCH */}
        {phase === 'result' && (
          <motion.div
             key="result-ui"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-center z-20"
          >
             <h1 className="text-6xl font-display font-black text-neon-pink animate-glitch mb-4">
               DIAGNOSTIC FAILED
             </h1>
             <div className="bg-red-900/20 border border-red-500/50 p-6 rounded max-w-md mx-auto backdrop-blur-md">
                <p className="font-mono text-red-300 mb-2">> ANALYSIS: "{diagInput}"</p>
                <p className="font-mono text-white text-lg">
                  ERROR: PREDICTION RESOLUTION TOO LOW.<br/>
                  GRAMMAR LEVEL: B1 DETECTED.
                </p>
             </div>
             <p className="mt-8 text-neon-green animate-pulse tracking-widest">INITIATING B2 UPGRADE PROTOCOLS...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Landing;