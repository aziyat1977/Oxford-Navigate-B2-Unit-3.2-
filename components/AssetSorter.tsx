import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';

interface AssetSorterProps {
  onComplete: () => void;
}

// PART 3: PRE-TEACH VOCABULARY
// Logic:
// FRITTER AWAY: Negative / Passive (Wasting little by little) -> Bottom Left
// INVEST: Positive / Active (Building value) -> Top Right
// WHILE AWAY: Positive / Passive (Relaxing) -> Bottom Right
// KILL TIME: Neutral/Active (Waiting) -> Top Left

const cardsData = [
  { text: "SCROLLING TIKTOK", type: "fritter", hint: "Negative / Passive: Wasting time in small chunks" },
  { text: "LEARNING ENGLISH", type: "invest", hint: "Positive / Active: Future benefit" },
  { text: "WAITING FOR TRAIN", type: "kill", hint: "Neutral: Making time pass quickly" },
  { text: "READING A NOVEL", type: "while", hint: "Positive / Passive: Pleasant relaxation" },
  { text: "PLAYING VIDEO GAMES ALL WEEKEND", type: "fritter", hint: "Negative: Regret later" },
  { text: "GOING TO THE GYM", type: "invest", hint: "Active: Health benefits" },
  { text: "SITTING BY THE RIVER", type: "while", hint: "Passive: Enjoying the moment" },
  { text: "BUYING CLOTHES YOU DON'T NEED", type: "fritter", hint: "Negative: Money/Time waste" },
];

interface CardProps {
  card: { text: string; type: string; hint: string };
  onSwipe: (direction: string) => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, onSwipe, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);

  const color = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      if (Math.abs(latestX) < 20 && Math.abs(latestY) < 20) return "#334155"; 
      if (latestX > 0 && latestY < 0) return "#00ff99"; // Top-Right (Invest)
      if (latestX < 0 && latestY > 0) return "#ff0055"; // Bottom-Left (Fritter)
      if (latestX < 0 && latestY < 0) return "#00f3ff"; // Top-Left (Kill)
      if (latestX > 0 && latestY > 0) return "#fbbf24"; // Bottom-Right (While)
      return "#334155";
    }
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const { x: ox, y: oy } = info.offset;

    if (Math.abs(ox) > threshold || Math.abs(oy) > threshold) {
        let dir = "";
        if (ox > 0 && oy < 0) dir = "invest";
        else if (ox < 0 && oy > 0) dir = "fritter";
        else if (ox < 0 && oy < 0) dir = "kill";
        else if (ox > 0 && oy > 0) dir = "while";
        
        if (dir) onSwipe(dir);
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity, borderColor: color, zIndex: 100 - index }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05, cursor: "grab" }}
      whileTap={{ cursor: "grabbing" }}
      className="absolute w-72 h-96 bg-black/90 rounded-2xl flex flex-col items-center justify-center border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl p-6 text-center"
    >
        <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500">ASSET_ID: {Math.floor(Math.random() * 9999)}</div>
        <h2 className="text-white font-display text-3xl font-bold leading-tight select-none mb-4">
            {card.text}
        </h2>
        <div className="absolute bottom-4 left-0 w-full text-xs font-mono text-slate-400 px-4">{card.hint}</div>
    </motion.div>
  );
};

const AssetSorter: React.FC<AssetSorterProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState("");

  const handleSwipe = (direction: string) => {
    const card = cardsData[index];
    if (!card) return;

    let correct = direction === card.type;
    
    if (correct) {
        setScore(s => s + 100);
        setLastFeedback(`CORRECT: ${direction.toUpperCase()}`);
    } else {
        setScore(s => Math.max(0, s - 50));
        setLastFeedback(`ERROR. IT WAS ${card.type.toUpperCase()}`);
    }

    setIndex(prev => prev + 1);
    if (index + 1 >= cardsData.length) {
        setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center overflow-hidden relative font-mono">
      
      {/* THE QUADRANT UI */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Axes */}
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800" />
         <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800" />

         {/* Labels */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500">ACTIVE</div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-500">PASSIVE</div>
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 -rotate-90">NEGATIVE</div>
         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 rotate-90">POSITIVE</div>

         {/* Quadrant Names */}
         <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-display font-black text-slate-800 select-none">KILL</div>
         <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-display font-black text-slate-800 select-none">INVEST</div>
         <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 text-4xl md:text-6xl font-display font-black text-slate-800 select-none">FRITTER</div>
         <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 text-4xl md:text-6xl font-display font-black text-slate-800 select-none">WHILE</div>
      </div>

      {/* Header UI */}
      <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
         <div>
            <div className="text-[10px] text-slate-400">PHASE 2</div>
            <div className="text-xl text-white font-display">ASSET SORTER</div>
         </div>
         <div className="text-right">
             <div className="text-[10px] text-slate-400">CREDITS</div>
             <div className="text-xl text-neon-green">${score}</div>
         </div>
      </div>

      {/* Cards Stack */}
      <div className="relative w-72 h-96 z-10">
         <AnimatePresence>
            {index < cardsData.length ? (
                cardsData.slice(index).reverse().map((card, i) => (
                    <Card key={index + (cardsData.length - 1 - i)} card={card} index={i} onSwipe={handleSwipe} />
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full flex items-center justify-center bg-black border-2 border-neon-green rounded-2xl"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">VOCAB SYNCED</h2>
                        <p className="text-neon-green text-xs">UPLOADING DATA...</p>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Feedback Overlay */}
      <div className="absolute bottom-10 left-0 w-full text-center h-8">
          <span key={index} className="text-neon-green font-bold tracking-widest animate-pulse">
              {lastFeedback}
          </span>
      </div>

    </div>
  );
};

export default AssetSorter;