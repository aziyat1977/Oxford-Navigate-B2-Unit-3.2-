import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const questions = [
  { q: "This time next week, I _____ on a beach.", options: ["will lie", "will have lain", "will be lying", "am lying"], a: 2 },
  { q: "By 2030, scientists _____ a cure.", options: ["will be finding", "will have found", "find", "are finding"], a: 1 },
  { q: "Don't phone at 7. We _____ dinner.", options: ["will have had", "have", "will be having", "had"], a: 2 },
  { q: "By the time you get home, the kids _____.", options: ["will have gone", "will be going", "go", "are going"], a: 0 },
  { q: "At 10 o'clock tomorrow, she _____.", options: ["will have worked", "will be working", "worked", "works"], a: 1 },
  { q: "I _____ all my exams by June 15th.", options: ["will be finishing", "will have finished", "finish", "am finishing"], a: 1 },
  { q: "In fifty years, people _____ on Mars.", options: ["will be living", "will have lived", "live", "lived"], a: 0 },
  { q: "By the end of this lesson, you _____ 5 words.", options: ["will be learning", "will have learned", "learn", "are learning"], a: 1 },
  { q: "Will you _____ using the PC for long?", options: ["be", "have", "do", "are"], a: 0 },
  { q: "By next year, he _____ saved enough.", options: ["will be", "will have", "is", "was"], a: 1 },
  { q: "Tomorrow afternoon we _____ tennis.", options: ["will be playing", "will have played", "play", "played"], a: 0 },
  { q: "By the time police arrive, the thief _____.", options: ["will be escaping", "will have escaped", "escapes", "is escaping"], a: 1 },
];

const NeuralCalibration: React.FC<NeuralProps> = ({ onComplete, updateLife }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [glitch, setGlitch] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const timerRef = useRef<any>(null);

  // Timer Logic
  useEffect(() => {
    if (showResult) return;
    setTimeLeft(15); // Reset timer on new question
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [index]);

  const handleTimeOut = () => {
    setGlitch(true);
    updateLife(-5);
    setStreak(0);
    setTimeout(() => {
       setGlitch(false);
       nextQ();
    }, 500);
  };

  const nextQ = () => {
    if (index + 1 < questions.length) {
        setIndex(prev => prev + 1);
    } else {
        clearInterval(timerRef.current);
        setShowResult(true);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === questions[index].a;
    if (isCorrect) {
        setScore(prev => prev + 1);
        const streakBonus = streak > 2 ? 2 : 0;
        updateLife(2 + streakBonus);
        setStreak(s => s + 1);
    } else {
        setGlitch(true);
        setStreak(0);
        updateLife(-5);
        setTimeout(() => setGlitch(false), 300);
    }
    nextQ();
  };

  if (showResult) {
      return (
        <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-mono">
            <h1 className="text-4xl text-neon-green mb-4 font-display font-black">NEURAL LINK ESTABLISHED</h1>
            <p className="text-white text-xl mb-8">EFFICIENCY: {Math.round((score / questions.length) * 100)}%</p>
            <button onClick={onComplete} className="px-10 py-4 bg-white text-black font-bold rounded hover:bg-neon-green transition-colors">
                ACCESS TIME CAPSULE
            </button>
        </div>
      );
  }

  return (
    <div className={`h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-mono relative overflow-hidden ${glitch ? 'animate-glitch' : ''}`}>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,153,0.1),transparent_70%)] opacity-20" />
      
      <div className="z-10 w-full max-w-3xl px-6">
          <div className="flex justify-between items-center mb-6 text-xs font-bold tracking-widest text-slate-500">
              <div className="text-neon-cyan">SYNC: {index + 1}/{questions.length}</div>
              {streak > 1 && <div className="text-neon-yellow animate-pulse">STREAK x{streak}</div>}
          </div>

          {/* Timer Bar */}
          <div className="w-full h-1 bg-slate-800 mb-12 relative overflow-hidden">
             <motion.div 
               key={index}
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 15, ease: "linear" }}
               className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-neon-green'}`}
             />
          </div>

          <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                  <h2 className="text-2xl md:text-4xl text-white font-bold mb-10 leading-snug">
                      {questions[index].q.split("_____").map((part, i) => (
                          <React.Fragment key={i}>
                              {part}
                              {i === 0 && <span className="inline-block w-32 border-b-4 border-neon-cyan mx-2 animate-pulse"></span>}
                          </React.Fragment>
                      ))}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[index].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="relative p-6 bg-slate-900 border border-slate-700 hover:border-white hover:bg-white hover:text-black transition-all text-left group overflow-hidden"
                          >
                              <span className="font-mono text-xs opacity-50 mr-4 group-hover:opacity-100">0{i + 1}</span>
                              <span className="font-bold text-lg">{opt}</span>
                          </button>
                      ))}
                  </div>
              </motion.div>
          </AnimatePresence>
      </div>

      {/* Red Glitch Overlay */}
      {glitch && (
          <div className="absolute inset-0 bg-red-500/20 pointer-events-none flex items-center justify-center z-50 mix-blend-overlay">
              <span className="text-white font-black text-9xl">ERROR</span>
          </div>
      )}
    </div>
  );
};

export default NeuralCalibration;