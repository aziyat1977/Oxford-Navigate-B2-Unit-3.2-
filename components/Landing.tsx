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

const diagnosticQuestions = [
  { 
    q: "Do not disturb me. I _____ the stars.", 
    options: ["will be watching", "will have watched", "am watching", "will watch"], 
    answer: "will be watching" 
  },
  { 
    q: "By arrival, the potion _____.", 
    options: ["will have brewed", "will be brewing", "brews", "has brewed"], 
    answer: "will have brewed" 
  },
  { 
    q: "Next century, I _____ in the High Tower.", 
    options: ["will be living", "will have lived", "live", "am living"], 
    answer: "will be living" 
  },
  { 
    q: "I _____ tomorrow, so let us duel.", 
    options: ["won't be practicing", "won't have practiced", "don't practice", "not practicing"], 
    answer: "won't be practicing" 
  },
  { 
    q: "By midnight, I _____ all the mana.", 
    options: ["will have drained", "will be draining", "drain", "am draining"], 
    answer: "will have drained" 
  },
  {
    q: "In ten years, the Guild _____ a leader.",
    options: ["will have chosen", "will be choosing", "chose", "is choosing"],
    answer: "will have chosen"
  },
  {
    q: "Don't enter. She _____ a ritual.",
    options: ["will be performing", "will have performed", "performs", "performed"],
    answer: "will be performing"
  },
  {
    q: "By 2040, nature _____ the ruins.",
    options: ["will have reclaimed", "will be reclaiming", "reclaims", "is reclaiming"],
    answer: "will have reclaimed"
  },
  {
    q: "Look at the time. We _____ late.",
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
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const requestRef = useRef<number>();

  // Shuffle options on question change
  useEffect(() => {
    if (qIndex < diagnosticQuestions.length) {
      setCurrentOptions(shuffle(diagnosticQuestions[qIndex].options));
    }
  }, [qIndex]);

  const startHolding = () => { initAudio(); setIsHolding(true); };
  const stopHolding = () => setIsHolding(false);

  // Progress Bar Logic
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
    if (isHolding || progress > 0) requestRef.current = requestAnimationFrame(updateProgress);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
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
           onComplete(nextScore);
       }
    }, 600);
  };

  // --- PAGE 1: THE GATE (INTRO) ---
  const renderIntro = () => (
    <motion.div 
      key="intro" 
      exit={{opacity: 0, scale: 1.1}} 
      className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-6 text-center relative"
      onClick={() => setPhase('ritual')}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-ink dark:text-parchment font-rune text-3xl mb-4 tracking-widest uppercase opacity-70">
            Oxford Navigate B2
        </h2>
        <h1 className="text-7xl md:text-9xl font-display font-black text-magic-gold drop-shadow-lg leading-none">
            CHRONOS
        </h1>
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-ink dark:via-parchment to-transparent my-8 opacity-50" />
        <h3 className="text-xl md:text-3xl font-body italic text-ink/80 dark:text-parchment/80">
            "Unit 3.2: The Future Perfect & Continuous"
        </h3>
      </div>
      <div className="absolute bottom-10 left-10 animate-pulse text-crimson dark:text-emerald-rune font-display font-bold text-3xl">
          TAP TO ENTER [ ↵ ]
      </div>
    </motion.div>
  );

  // --- PAGE 2: THE RITUAL (LOGIN) ---
  const renderRitual = () => (
    <motion.div 
      key="ritual"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full w-full z-10"
    >
      <h2 className="text-4xl md:text-6xl font-display font-bold text-ink dark:text-parchment mb-12 text-center px-4">
          ATTUNE YOUR <span className="text-magic-gold">SIGNATURE</span>
      </h2>

      <div 
        className="relative group cursor-pointer touch-none"
        onMouseDown={startHolding} onMouseUp={stopHolding} onMouseLeave={stopHolding}
        onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopHolding(); }}
      >
          {/* The Orb */}
          <motion.div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400 to-indigo-900 dark:from-purple-900 dark:to-black shadow-[0_0_50px_rgba(75,0,130,0.5)] border-8 border-magic-gold/30 flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform"
            animate={isHolding ? { scale: 1.05, boxShadow: "0 0 100px #4b9cd3" } : { scale: 1 }}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] opacity-50 animate-spin [animation-duration:20s]"></div>
            <motion.div animate={{ opacity: isHolding ? 1 : 0.5, scale: isHolding ? 1.2 : 1 }} className="text-white text-8xl">
                {isHolding ? "✨" : "✋"}
            </motion.div>
          </motion.div>
          
          {/* Progress Ring */}
          <svg className="absolute -top-10 -left-10 w-[21rem] h-[21rem] md:w-[26rem] md:h-[26rem] pointer-events-none -rotate-90" viewBox="0 0 100 100">
            <motion.circle 
                cx="50" cy="50" r="46"
                stroke="#d4af37" strokeWidth="3" fill="none"
                strokeDasharray="290"
                strokeDashoffset={290 - (290 * progress) / 100}
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_gold]"
            />
          </svg>
      </div>
      
      <p className="absolute bottom-10 left-10 font-rune text-xl text-ink/60 dark:text-parchment/60 animate-pulse">
          {isHolding ? "Syncing Temporal Data..." : "Hold Orb to Initialize"}
      </p>
    </motion.div>
  );

  // --- PAGE 3: THE TRIAL (DIAGNOSTIC) ---
  const renderDiagnostic = () => (
    <motion.div
      key="diagnostic"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className={`h-full w-full flex flex-col p-6 md:p-12 transition-colors duration-500
        ${feedbackState === 'correct' ? 'bg-emerald-rune/10' : ''}
        ${feedbackState === 'incorrect' ? 'bg-crimson/10' : ''}
      `}
    >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-ink dark:border-magic-gold pb-4">
            <span className="text-2xl md:text-3xl font-display font-bold text-crimson dark:text-mystic-blue uppercase tracking-widest">
                Rune {qIndex + 1}/{diagnosticQuestions.length}
            </span>
            <div className="h-4 w-32 bg-ink/20 dark:bg-parchment/20 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${((qIndex + 1) / diagnosticQuestions.length) * 100}%` }}
                    className="h-full bg-magic-gold"
                />
            </div>
        </div>

        {/* Question Area - Flex Grow to take available space */}
        <div className="flex-1 flex items-center justify-center my-4">
            <motion.p 
                key={qIndex}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-body font-bold text-ink dark:text-parchment leading-tight text-center"
            >
            {diagnosticQuestions[qIndex].q.split("_____").map((part, i) => (
                <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span className="inline-block min-w-[3ch] border-b-4 border-dashed border-magic-gold mx-2 text-transparent">___</span>}
                </React.Fragment>
            ))}
            </motion.p>
        </div>

        {/* Options Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-auto">
            {currentOptions.map((opt, i) => (
                <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="py-6 px-8 bg-parchment dark:bg-obsidian border-4 border-ink/20 dark:border-magic-gold/30 hover:border-magic-gold hover:bg-ink/5 dark:hover:bg-magic-gold/10 active:scale-95 transition-all shadow-lg rounded-xl text-left flex items-center group"
                >
                    <span className="w-10 h-10 rounded-full border-2 border-ink/30 dark:border-parchment/30 flex items-center justify-center mr-4 group-hover:bg-magic-gold group-hover:text-obsidian transition-colors font-bold">
                        {['A', 'B', 'C', 'D'][i]}
                    </span>
                    <span className="text-xl md:text-3xl font-display font-bold text-ink dark:text-parchment">{opt}</span>
                </button>
            ))}
        </div>
    </motion.div>
  );

  return (
    <div className="h-full w-full overflow-hidden select-none bg-paper-texture dark:bg-leather-texture" onClick={initAudio}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && renderIntro()}
        {phase === 'ritual' && renderRitual()}
        {phase === 'diagnostic' && renderDiagnostic()}
      </AnimatePresence>
    </div>
  );
};

export default Landing;