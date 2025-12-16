import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { playSound } from '../utils/audio';

interface AssetSorterProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const cardsData = [
  { text: "SCROLLING TIKTOK", type: "fritter", hint: "PASSIVE / NEGATIVE" },
  { text: "LEARNING PYTHON", type: "invest", hint: "ACTIVE / POSITIVE" },
  { text: "WAITING FOR FLIGHT", type: "kill", hint: "ACTIVE / NEUTRAL" },
  { text: "RELAXING ON SUNDAY", type: "while", hint: "PASSIVE / POSITIVE" },
  { text: "GAMING ALL NIGHT", type: "fritter", hint: "PASSIVE / NEGATIVE" },
  { text: "GYM WORKOUT", type: "invest", hint: "ACTIVE / POSITIVE" },
  { text: "SITTING BY RIVER", type: "while", hint: "PASSIVE / POSITIVE" },
  { text: "BUYING JUNK FOOD", type: "fritter", hint: "PASSIVE / NEGATIVE" },
];

interface CardProps {
  card: { text: string; type: string; hint: string };
  onSwipe: (direction: string) => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, onSwipe, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);
  const scale = useTransform(index, [0, 1, 2], [1, 0.95, 0.9]);

  const borderColor = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const threshold = 50;
      if (latestX > threshold && latestY < -threshold) return "#00ff99"; // Invest (Green)
      if (latestX < -threshold && latestY > threshold) return "#ff0055"; // Fritter (Red)
      if (latestX < -threshold && latestY < -threshold) return "#00f3ff"; // Kill (Cyan)
      if (latestX > threshold && latestY > threshold) return "#facc15"; // While (Yellow)
      return "#334155"; // Default Slate
    }
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const { x: ox, y: oy } = info.offset;

    if (Math.abs(ox) > threshold || Math.abs(oy) > threshold) {
        let dir = "";
        if (ox > 0 && oy < 0) dir = "invest";
        else if (ox < 0 && oy > 0) dir = "fritter";
        else if (ox < 0 && oy < 0) dir = "kill";
        else if (ox > 0 && oy > 0) dir = "while";
        
        if (dir) {
            playSound('swipe');
            onSwipe(dir);
        }
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity, scale, borderColor, zIndex: 100 - index }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="absolute w-72 h-96 bg-white dark:bg-black border-4 shadow-2xl flex flex-col items-center justify-center p-6 text-center rounded-sm cursor-grab active:cursor-grabbing backdrop-blur-md"
    >
        <div className="absolute top-2 left-2 w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
        
        <h2 className="text-slate-900 dark:text-white font-display text-2xl font-bold leading-tight select-none drop-shadow-sm">
            {card.text}
        </h2>
        
        <motion.div style={{ opacity: useTransform(x, [-50, 0, 50], [1, 0, 1]) }} className="absolute bottom-10 text-[10px] font-mono text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-1 bg-gray-50 dark:bg-black">
            {card.hint}
        </motion.div>
    </motion.div>
  );
};

const AssetSorter: React.FC<AssetSorterProps> = ({ onComplete, updateLife }) => {
  const [index, setIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<{msg: string, color: string} | null>(null);

  const handleSwipe = (direction: string) => {
    const card = cardsData[index];
    if (!card) return;

    const isCorrect = direction === card.type;
    
    if (isCorrect) {
        setCombo(c => c + 1);
        updateLife(1); 
        playSound('success');
        setFeedback({ msg: `${direction.toUpperCase()} CONFIRMED`, color: "text-emerald-600 dark:text-neon-green" });
    } else {
        setCombo(0);
        updateLife(-3);
        playSound('error');
        setFeedback({ msg: "DATA CORRUPTION", color: "text-red-600 dark:text-neon-pink" });
    }

    setIndex(prev => prev + 1);
    if (index + 1 >= cardsData.length) {
        setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative font-mono overflow-hidden">
      
      {/* Background Matrix UI */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Grid Lines */}
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
         <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 dark:bg-slate-800" />

         {/* Quadrant Watermarks */}
         <div className="absolute top-10 left-10 text-4xl font-display font-black text-slate-200 dark:text-slate-900 select-none opacity-50 dark:opacity-50">KILL</div>
         <div className="absolute top-10 right-10 text-4xl font-display font-black text-slate-200 dark:text-slate-900 select-none opacity-50 dark:opacity-50">INVEST</div>
         <div className="absolute bottom-10 left-10 text-4xl font-display font-black text-slate-200 dark:text-slate-900 select-none opacity-50 dark:opacity-50">FRITTER</div>
         <div className="absolute bottom-10 right-10 text-4xl font-display font-black text-slate-200 dark:text-slate-900 select-none opacity-50 dark:opacity-50">WHILE</div>

         {/* Axis Labels */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-emerald-600 dark:text-neon-green tracking-widest bg-white dark:bg-black px-2 border border-emerald-500 dark:border-neon-green">ACTIVE</div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-widest">PASSIVE</div>
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-red-500 dark:text-neon-pink tracking-widest -rotate-90">NEGATIVE</div>
         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-yellow-500 dark:text-neon-yellow tracking-widest rotate-90">POSITIVE</div>
      </div>

      {/* Combo Meter */}
      <div className="absolute top-20 right-10 text-right">
          <div className="text-[10px] text-slate-500">COMBO CHAIN</div>
          <motion.div 
            key={combo} 
            initial={{ scale: 1.5 }} 
            animate={{ scale: 1, color: combo > 2 ? (document.documentElement.classList.contains('dark') ? '#00ff99' : '#059669') : 'currentColor' }}
            className="text-4xl font-display font-black text-slate-900 dark:text-white"
          >
             x{combo}
          </motion.div>
      </div>

      {/* Card Stack */}
      <div className="relative w-72 h-96 z-10">
         <AnimatePresence>
            {index < cardsData.length ? (
                cardsData.slice(index).reverse().map((card, i) => (
                    <Card key={index + (cardsData.length - 1 - i)} card={card} index={i} onSwipe={handleSwipe} />
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 border border-emerald-500 dark:border-neon-green rounded-xl"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">MATRIX ALIGNED</h2>
                    <div className="w-8 h-8 border-2 border-t-emerald-500 dark:border-t-neon-green border-r-transparent border-b-emerald-500 dark:border-b-neon-green border-l-transparent rounded-full animate-spin"></div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Feedback text */}
      {feedback && (
          <div className={`absolute bottom-20 font-display text-xl font-bold tracking-widest ${feedback.color} animate-pulse`}>
              {feedback.msg}
          </div>
      )}

    </div>
  );
};

export default AssetSorter;