import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, initAudio } from '../utils/audio';

interface LandingProps {
  onComplete: (score: number) => void;
  updateLife: (years: number) => void;
}

// Utility to shuffle array
const shuffle = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Expanded Question Set with 4 options each
const diagnosticQuestions = [
  { 
    q: "Do not disturb me at sunset. I _____ the stars.", 
    options: ["will be watching", "will have watched", "am watching", "will watch"], 
    answer: "will be watching" 
  },
  { 
    q: "By the time we arrive, the potion _____.", 
    options: ["will have brewed", "will be brewing", "brews", "has brewed"], 
    answer: "will have brewed" 
  },
  { 
    q: "This time next century, I _____ in the High Tower.", 
    options: ["will be living", "will have lived", "live", "am living"], 
    answer: "will be living" 
  },
  { 
    q: "I _____ tomorrow, so let us duel.", 
    options: ["won't be practicing", "won't have practiced", "don't practice", "not practicing"], 
    answer: "won't be practicing" 
  },
  { 
    q: "By the witching hour, I _____ all the mana.", 
    options: ["will have drained", "will be draining", "drain", "am draining"], 
    answer: "will have drained" 
  },
  {
    q: "In ten years, the Guild _____ a new leader.",
    options: ["will have chosen", "will be choosing", "chose", "is choosing"],
    answer: "will have chosen"
  },
  {
    q: "Don't enter the sanctum. She _____ a ritual.",
    options: ["will be performing", "will have performed", "performs", "performed"],
    answer: "will be performing"
  },
  {
    q: "By 2040, nature _____ the ruins.",
    options: ["will have reclaimed", "will be reclaiming", "reclaims", "is reclaiming"],
    answer: "will have reclaimed"
  },
  {
    q: "Look at the hourglass. We _____ late.",
    options: ["will be", "will have been", "are being", "have been"],
    answer: "will be"
  },
  {
    q: "At noon, the army _____ the bridge.",
    options: ["will be crossing", "will have crossed", "crosses", "is crossing"],
    answer: "will be crossing"
  }
];

const Landing: React.FC<LandingProps> = ({ onComplete, updateLife }) => {
  const [phase, setPhase] = useState<'intro' | 'ritual' | 'diagnostic'>('intro');
  const [isHolding, setIsHolding] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  
  // State for shuffled options to ensure randomization
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const requestRef = useRef<number>();

  useEffect(() => {
    // Intro animation time
    const timer = setTimeout(() => setPhase('ritual'), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Shuffle options whenever the question index changes
  useEffect(() => {
    if (qIndex < diagnosticQuestions.length) {
      setCurrentOptions(shuffle(diagnosticQuestions[qIndex].options));
    }
  }, [qIndex]);

  const startHolding = () => {
    initAudio(); 
    setIsHolding(true);
  };

  const stopHolding = () => {
    setIsHolding(false);
  };

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
    } else {
        setProgress(prev => Math.max(0, prev - 2));
        if (progress > 0) requestRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    if (isHolding || progress > 0) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isHolding, progress]);

  const handleAnswer = (selectedOption: string) => {
    if (feedbackState !== 'neutral') return;

    const isCorrect = selectedOption === diagnosticQuestions[qIndex].answer;
    const nextScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
        playSound('success');
        setFeedbackState('correct');
        setScore(nextScore);
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
           // Completion logic
           onComplete(nextScore);
       }
    }, 600);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative select-none" onClick={initAudio}>
      
      <AnimatePresence mode="wait">
        
        {phase === 'intro' && (
             <motion.div key="intro" exit={{opacity: 0, scale: 1.1}} className="text-center z-20 px-6 cursor-pointer">
                 <h2 className="text-ink dark:text-parchment font-rune text-xl mb-4">The Guild Awaits...</h2>
                 <h1 className="text-6xl md:text-8xl font-display font-bold text-magic-gold drop-shadow-md">
                    CHRONOS
                 </h1>
                 <p className="mt-8 text-sm opacity-50 font-body">Tap anywhere to begin</p>
             </motion.div>
        )}

        {phase === 'ritual' && (
          <motion.div 
            key="ritual-ui"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10"
          >
             <p className="mb-8 font-body text-2xl text-ink dark:text-parchment italic text-center max-w-md px-4">
                 "Hold the Orb to attune your magical signature."
             </p>

              <div 
                className="relative group cursor-pointer touch-none"
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopHolding(); }}
              >
                 <motion.div 
                   className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-200 to-indigo-600 dark:from-purple-900 dark:to-black shadow-[0_0_30px_rgba(75,0,130,0.5)] border-4 border-magic-gold/30 flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform"
                   animate={isHolding ? { scale: 1.05, boxShadow: "0 0 60px #4b9cd3" } : { scale: 1 }}
                 >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] opacity-50 animate-spin [animation-duration:10s]"></div>
                    {isHolding && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-white text-6xl font-rune"
                      >
                         ✨
                      </motion.div>
                    )}
                 </motion.div>
                 
                 <svg className="absolute -top-6 -left-6 w-60 h-60 pointer-events-none rotate-spin-slow" viewBox="0 0 100 100">
                    <motion.circle 
                       cx="50" cy="50" r="46"
                       stroke="#d4af37" strokeWidth="2" fill="none"
                       strokeDasharray="290"
                       strokeDashoffset={290 - (290 * progress) / 100}
                       strokeLinecap="round"
                       className="drop-shadow-[0_0_5px_gold]"
                    />
                 </svg>
              </div>
          </motion.div>
        )}

        {phase === 'diagnostic' && (
          <motion.div
            key="quiz-ui"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`w-full max-w-xl px-8 py-10 z-20 rounded-lg shadow-2xl border-4 border-double border-ink dark:border-magic-gold transition-colors duration-500 bg-parchment dark:bg-obsidian bg-paper-texture dark:bg-leather-texture mx-4
              ${feedbackState === 'correct' ? 'shadow-[0_0_30px_#50c878]' : ''}
              ${feedbackState === 'incorrect' ? 'shadow-[0_0_30px_#8a0303]' : ''}
            `}
          >
             <div className="flex justify-between items-center mb-6 border-b border-ink/30 dark:border-magic-gold/30 pb-2">
                 <div className="flex items-center gap-2">
                     <span className="text-sm font-display font-bold text-crimson dark:text-mystic-blue">Attunement Trial</span>
                 </div>
                 <div className="font-rune text-ink dark:text-parchment opacity-70">Rune {qIndex + 1}/{diagnosticQuestions.length}</div>
             </div>

             <motion.div key={qIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <p className="text-2xl md:text-3xl font-body italic leading-relaxed mb-8 text-ink dark:text-parchment">
                    {diagnosticQuestions[qIndex].q.split("_____").map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i === 0 && <span className="inline-block w-24 border-b-2 border-dotted border-ink dark:border-magic-gold mx-2"></span>}
                        </React.Fragment>
                    ))}
                 </p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentOptions.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="group relative px-4 py-4 border-2 border-ink/20 dark:border-magic-gold/40 hover:border-magic-gold hover:bg-ink/5 dark:hover:bg-magic-gold/10 text-left transition-all active:scale-95 active:bg-ink/10 dark:active:bg-magic-gold/20 flex items-center"
                     >
                         <span className="font-display font-bold text-base text-ink dark:text-parchment group-hover:text-crimson dark:group-hover:text-magic-gold transition-colors">{opt}</span>
                     </button>
                 ))}
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Landing;