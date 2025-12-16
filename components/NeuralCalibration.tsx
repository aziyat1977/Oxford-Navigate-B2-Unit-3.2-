import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface NeuralProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const questions = [
  { q: "This time next week, I _____ on a dragon's back.", options: ["will fly", "will have flown", "will be flying", "am flying"], a: 2 },
  { q: "By 2050, wizards _____ a cure for the plague.", options: ["will be finding", "will have found", "find", "are finding"], a: 1 },
  { q: "Do not disturb. We _____ the feast.", options: ["will have had", "have", "will be having", "had"], a: 2 },
  { q: "By the time you arrive, the goblins _____.", options: ["will have gone", "will be going", "go", "are going"], a: 0 },
  { q: "At midnight, the witch _____ her brew.", options: ["will have stirred", "will be stirring", "stirred", "stirs"], a: 1 },
];

const NeuralCalibration: React.FC<NeuralProps> = ({ onComplete, updateLife }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [feedbackState, setFeedbackState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  const [showResult, setShowResult] = useState(false);
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (showResult) return;
    setTimeLeft(15); 
    
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
    playSound('error');
    setFeedbackState('incorrect');
    updateLife(-5);
    setStreak(0);
    setTimeout(() => {
       setFeedbackState('neutral');
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
        playSound('success');
        setFeedbackState('correct');
        setScore(prev => prev + 1);
        const streakBonus = streak > 2 ? 2 : 0;
        updateLife(2 + streakBonus);
        setStreak(s => s + 1);
    } else {
        playSound('error');
        setFeedbackState('incorrect');
        setStreak(0);
        updateLife(-5);
    }
    
    setTimeout(() => {
        setFeedbackState('neutral');
        nextQ();
    }, 300);
  };

  if (showResult) {
      return (
        <div className="h-full w-full bg-parchment dark:bg-obsidian flex flex-col items-center justify-center font-display bg-paper-texture">
            <h1 className="text-5xl text-magic-gold mb-4 font-bold drop-shadow-md">TRIAL COMPLETE</h1>
            <p className="text-ink dark:text-parchment text-2xl mb-8 font-body italic">
                MASTERY: {Math.round((score / questions.length) * 100)}%
            </p>
            <button onClick={onComplete} className="px-10 py-4 bg-ink text-parchment text-xl font-bold rounded-sm border-2 border-magic-gold hover:bg-crimson transition-colors shadow-lg">
                OPEN THE GRIMOIRE
            </button>
        </div>
      );
  }

  return (
    <div className={`h-full w-full bg-parchment dark:bg-obsidian flex flex-col items-center justify-center font-body relative overflow-hidden transition-colors duration-200 bg-paper-texture dark:bg-leather-texture`}>
      
      {/* Visual Feedback Overlay */}
      {feedbackState === 'correct' && <div className="absolute inset-0 bg-emerald-rune/20 z-0" />}
      {feedbackState === 'incorrect' && <div className="absolute inset-0 bg-crimson/20 z-0" />}

      <div className="z-10 w-full max-w-4xl px-8 py-10 border-[6px] border-double border-ink/40 dark:border-magic-gold/40 rounded-lg bg-parchment/90 dark:bg-obsidian/90 shadow-2xl">
          
          <div className="flex justify-between items-center mb-8 font-rune text-lg text-ink/70 dark:text-parchment/70">
              <div className="text-mystic-blue">Rune: {index + 1}/{questions.length}</div>
              {streak > 1 && <div className="text-magic-gold animate-bounce">Streak x{streak}</div>}
          </div>

          {/* Candle Timer */}
          <div className="w-full h-2 bg-ink/20 dark:bg-parchment/20 mb-12 relative rounded-full overflow-hidden">
             <motion.div 
               key={index}
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 15, ease: "linear" }}
               className={`h-full ${timeLeft < 5 ? 'bg-crimson shadow-[0_0_10px_red]' : 'bg-magic-gold shadow-[0_0_10px_gold]'}`}
             />
          </div>

          <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                  <h2 className="text-3xl md:text-5xl text-ink dark:text-parchment font-display font-bold mb-12 leading-tight text-center">
                      {questions[index].q.split("_____").map((part, i) => (
                          <React.Fragment key={i}>
                              {part}
                              {i === 0 && <span className="inline-block w-40 border-b-4 border-dotted border-mystic-blue mx-2"></span>}
                          </React.Fragment>
                      ))}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {questions[index].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            onMouseEnter={() => playSound('hover')}
                            className="relative p-6 bg-parchment dark:bg-black border-2 border-ink dark:border-gray-600 hover:border-magic-gold hover:shadow-[0_0_15px_#d4af37] transition-all text-left group overflow-hidden shadow-md"
                          >
                              <span className="font-rune text-sm opacity-50 mr-4 group-hover:opacity-100 text-ink dark:text-parchment">
                                {['I', 'II', 'III', 'IV'][i]}
                              </span>
                              <span className="font-bold text-xl text-ink dark:text-parchment font-display">{opt}</span>
                          </button>
                      ))}
                  </div>
              </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
};

export default NeuralCalibration;