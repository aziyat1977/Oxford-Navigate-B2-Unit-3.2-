import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface AssetSorterProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

// --- DATA ---
type Category = 'MONEY' | 'TIME' | 'BOTH';

interface Collocation {
  id: string;
  text: string;
  category: Category;
}

const collocations: Collocation[] = [
  { id: 'c1', text: 'choose the right', category: 'TIME' },
  { id: 'c2', text: 'fritter away', category: 'BOTH' },
  { id: 'c3', text: 'get your ...\'s worth', category: 'MONEY' },
  { id: 'c4', text: 'have ... to spare', category: 'BOTH' },
  { id: 'c5', text: 'invest', category: 'BOTH' },
  { id: 'c6', text: 'kill', category: 'TIME' },
  { id: 'c7', text: 'run out of', category: 'BOTH' },
  { id: 'c8', text: 'set aside', category: 'BOTH' },
  { id: 'c9', text: 'throw your ... around', category: 'MONEY' },
  { id: 'c10', text: 'waste', category: 'BOTH' },
  { id: 'c11', text: 'while away', category: 'TIME' },
];

interface Sentence {
  id: number;
  pre: string;
  post: string;
  correct: string[]; 
}

const sentences: Sentence[] = [
  { id: 1, pre: "Apps such as Candy Crush are a good way to", post: "the time when you're bored.", correct: ["while away", "kill"] },
  { id: 2, pre: "If you", post: "time, microwave meals are just as good as home-cooked food.", correct: ["are short of", "run out of"] }, 
  { id: 3, pre: "Don't", post: "time worrying about what other people have.", correct: ["waste"] },
  { id: 4, pre: "It's important to", post: "time for the people you care about.", correct: ["set aside", "invest", "make"] },
  { id: 5, pre: "Don't", post: "money, try to save it for something really worth buying.", correct: ["fritter away", "throw your ... around", "waste"] },
  { id: 6, pre: "The best way to", post: "is in your education.", correct: ["invest"] },
  { id: 7, pre: "If education is expensive, make sure you", post: "by working hard.", correct: ["get your ...'s worth"] },
];

const wordBank = [
  "while away", "are short of", "waste", "set aside", "fritter away", "invest", "get your ...'s worth", "kill", "throw your ... around"
];

// --- SUB-COMPONENTS ---

// 1. THE TREASURY (Sorting Game)
const TreasuryGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentItem = collocations[index];
  const isFinished = index >= collocations.length;

  useEffect(() => {
    if (isFinished) {
      setTimeout(onFinish, 1500);
    }
  }, [isFinished, onFinish]);

  const handleChoice = (choice: Category) => {
    if (feedback !== 'idle' || isFinished) return;

    if (choice === currentItem.category) {
      setFeedback('correct');
      playSound('success');
      updateLife(2);
    } else {
      setFeedback('wrong');
      playSound('error');
      updateLife(-2);
    }

    // Auto-advance
    setTimeout(() => {
      setFeedback('idle');
      if (index < collocations.length) {
        setIndex(prev => prev + 1);
      }
    }, 1000);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <div className="text-8xl mb-4">⚖️</div>
        <h2 className="text-4xl font-display font-bold text-magic-gold">BALANCE RESTORED</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">
          The Treasury of Fate
        </h2>
        <div className="font-rune text-xl text-magic-gold">
          {index + 1} / {collocations.length}
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, y: -50 }}
            className={`
              relative w-full max-w-lg aspect-[3/2] flex items-center justify-center p-8 rounded-xl shadow-2xl border-4 
              ${feedback === 'idle' ? 'bg-parchment dark:bg-obsidian border-magic-gold' : ''}
              ${feedback === 'correct' ? 'bg-emerald-rune border-emerald-rune text-obsidian' : ''}
              ${feedback === 'wrong' ? 'bg-crimson border-crimson text-parchment' : ''}
              transition-colors duration-300
            `}
          >
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-current opacity-50"/>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-current opacity-50"/>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-current opacity-50"/>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-current opacity-50"/>

            <h3 className="text-4xl md:text-6xl font-display font-bold text-center leading-tight">
              {currentItem.text}
            </h3>

            {/* Feedback Icon Overlay */}
            {feedback === 'correct' && (
               <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-6 -right-6 text-6xl bg-white rounded-full shadow-lg">✅</motion.div>
            )}
            {feedback === 'wrong' && (
               <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-6 -right-6 text-6xl bg-white rounded-full shadow-lg">❌</motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls / Pedestals */}
      <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8 min-h-[150px]">
        <button
          onClick={() => handleChoice('MONEY')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-mystic-blue/10 border-2 border-mystic-blue/30 rounded-t-full rounded-b-lg hover:bg-mystic-blue/30 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">💰</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-mystic-blue z-10">MONEY</span>
          <div className="h-1 w-12 bg-mystic-blue mt-2 rounded-full"/>
        </button>

        <button
          onClick={() => handleChoice('BOTH')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-magic-gold/10 border-2 border-magic-gold/30 rounded-t-full rounded-b-lg hover:bg-magic-gold/30 active:scale-95 transition-all -translate-y-4"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">⚖️</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-magic-gold z-10">BOTH</span>
          <div className="h-1 w-12 bg-magic-gold mt-2 rounded-full"/>
        </button>

        <button
          onClick={() => handleChoice('TIME')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-emerald-rune/10 border-2 border-emerald-rune/30 rounded-t-full rounded-b-lg hover:bg-emerald-rune/30 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">⏳</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-emerald-rune z-10">TIME</span>
          <div className="h-1 w-12 bg-emerald-rune mt-2 rounded-full"/>
        </button>
      </div>
      
      <div className="text-center mt-4 text-xs font-rune opacity-50">TAP THE CORRECT PEDESTAL TO SORT THE ESSENCE</div>
    </div>
  );
};

// 2. CONSTELLATION WEAVING (Sentence Game)
const ConstellationGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [qIndex, setQIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  
  const currentSentence = sentences[qIndex];
  const isComplete = qIndex >= sentences.length;

  const handleWordSelect = (word: string) => {
    if (solved) return;
    
    // Check if the selected word is ONE of the correct answers
    if (currentSentence.correct.includes(word)) {
      setSolved(true);
      playSound('success');
      updateLife(3);
      
      setTimeout(() => {
        if (qIndex + 1 < sentences.length) {
          setQIndex(prev => prev + 1);
          setSolved(false);
        } else {
          onFinish();
        }
      }, 1500);
    } else {
      playSound('error');
      updateLife(-2);
    }
  };

  if (isComplete) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">
          Weaving the Prophecy
        </h2>
        <div className="flex gap-1">
           {sentences.map((_, i) => (
             <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i <= qIndex ? 'bg-magic-gold' : 'bg-gray-500'}`}
             />
           ))}
        </div>
      </div>

      {/* The Scroll / Sentence Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSentence.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full text-center"
          >
             <p className="text-3xl md:text-5xl font-display leading-normal text-ink dark:text-parchment drop-shadow-lg">
               {currentSentence.pre}
               <span className={`
                 inline-flex items-center justify-center min-w-[150px] mx-3 border-b-4 border-dashed
                 ${solved ? 'border-magic-gold text-magic-gold' : 'border-ink/50 dark:border-parchment/50 text-transparent'}
                 transition-colors duration-300
               `}>
                 {solved ? currentSentence.correct[0] : "______"}
               </span>
               {currentSentence.post}
             </p>
             
             {solved && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="mt-8 text-magic-gold font-rune text-xl"
               >
                 ✨ PROPHECY ALIGNED ✨
               </motion.div>
             )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The Rune Pool (Word Bank) */}
      <div className="mt-auto pt-8">
        <p className="text-center font-rune text-sm opacity-50 mb-4">SELECT THE MISSING RUNE</p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {wordBank.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordSelect(word)}
              disabled={solved}
              className={`
                px-4 py-3 md:px-6 md:py-4 rounded-lg font-body font-bold text-lg md:text-xl border-2 shadow-md transition-all
                bg-parchment dark:bg-obsidian 
                ${solved 
                    ? 'opacity-50 cursor-not-allowed border-transparent' 
                    : 'border-ink/20 dark:border-parchment/20 hover:border-magic-gold hover:scale-105 active:scale-95'
                }
                text-ink dark:text-parchment
              `}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- MAIN CONTAINER ---
const AssetSorter: React.FC<AssetSorterProps> = ({ onComplete, updateLife }) => {
  const [stage, setStage] = useState<'intro' | 'treasury' | 'constellation' | 'complete'>('intro');

  // Renders
  const renderIntro = () => (
    <div 
      onClick={() => { playSound('click'); setStage('treasury'); }}
      className="flex flex-col items-center justify-center h-full text-center p-8 cursor-pointer animate-in fade-in zoom-in duration-500"
    >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-8xl mb-8"
        >
            🔮
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-ink dark:text-parchment mb-6">
            THE TRIALS OF FATE
        </h1>
        <p className="font-body text-2xl italic text-ink/70 dark:text-parchment/70 max-w-lg mx-auto">
            "First, you must balance the scales of time and gold. <br/>Then, you must weave the broken stars."
        </p>
        <div className="mt-12 px-8 py-3 bg-magic-gold text-obsidian font-bold rounded shadow-lg animate-pulse">
            BEGIN TRIAL
        </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-paper-texture dark:bg-leather-texture transition-colors overflow-hidden">
      <AnimatePresence mode="wait">
        
        {stage === 'intro' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             {renderIntro()}
          </motion.div>
        )}

        {stage === 'treasury' && (
          <motion.div key="treasury" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             <TreasuryGame onFinish={() => setStage('constellation')} updateLife={updateLife} />
          </motion.div>
        )}

        {stage === 'constellation' && (
          <motion.div key="constellation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             <ConstellationGame onFinish={() => setStage('complete')} updateLife={updateLife} />
          </motion.div>
        )}

        {stage === 'complete' && (
          <motion.div 
            key="complete" 
            initial={{opacity:0}} animate={{opacity:1}} 
            onAnimationComplete={() => setTimeout(onComplete, 2000)}
            className="h-full flex flex-col items-center justify-center"
          >
             <div className="text-9xl mb-8 animate-bounce">🗝️</div>
             <h1 className="text-4xl md:text-6xl font-display font-bold text-magic-gold">TRIALS COMPLETE</h1>
             <p className="font-rune text-xl opacity-60 mt-4">The path opens...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AssetSorter;