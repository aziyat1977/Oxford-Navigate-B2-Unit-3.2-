import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { playSound } from '../utils/audio';

interface AssetSorterProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const cardsData = [
  { text: "GAZING INTO ORBS", type: "fritter", hint: "PASSIVE / FOLLY" },
  { text: "STUDYING RUNES", type: "invest", hint: "ACTIVE / WISDOM" },
  { text: "AWAITING THE CARRIAGE", type: "kill", hint: "ACTIVE / IDLE" },
  { text: "MEDITATING BY BROOK", type: "while", hint: "PASSIVE / RESTORATION" },
  { text: "TAVERN GAMBLING", type: "fritter", hint: "PASSIVE / FOLLY" },
  { text: "SWORD TRAINING", type: "invest", hint: "ACTIVE / WISDOM" },
  { text: "SITTING IN GARDEN", type: "while", hint: "PASSIVE / RESTORATION" },
  { text: "BUYING USELESS TRINKETS", type: "fritter", hint: "PASSIVE / FOLLY" },
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
  
  // Fix: Calculate scale directly instead of using useTransform with a number
  const scale = 1 - index * 0.05;

  const borderColor = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const threshold = 50;
      if (latestX > threshold && latestY < -threshold) return "#50c878"; // Invest (Emerald)
      if (latestX < -threshold && latestY > threshold) return "#8a0303"; // Fritter (Crimson)
      if (latestX < -threshold && latestY < -threshold) return "#4b9cd3"; // Kill (Blue)
      if (latestX > threshold && latestY > threshold) return "#d4af37"; // While (Gold)
      return "#2c1810"; // Default Ink
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
      style={{ x, y, rotate, opacity, borderColor, zIndex: 100 - index }}
      animate={{ scale: scale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      drag={index === 0} // Only allow dragging the top card
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="absolute w-72 h-[26rem] bg-parchment dark:bg-obsidian border-[6px] shadow-2xl flex flex-col items-center justify-between p-6 text-center rounded-xl cursor-grab active:cursor-grabbing bg-paper-texture dark:bg-leather-texture"
    >
        {/* Card Design Elements */}
        <div className="w-full h-full border-2 border-double border-ink/20 dark:border-magic-gold/30 rounded-lg p-4 flex flex-col items-center justify-center relative">
            
            {/* Corner Runes */}
            <span className="absolute top-0 left-0 text-2xl text-ink/40 dark:text-magic-gold/40">♠</span>
            <span className="absolute bottom-0 right-0 text-2xl text-ink/40 dark:text-magic-gold/40">♠</span>

            {/* Illustration Placeholder */}
            <div className="w-32 h-32 rounded-full border-2 border-ink dark:border-parchment mb-6 flex items-center justify-center bg-ink/5 dark:bg-white/5">
                <span className="text-4xl">🔮</span>
            </div>

            <h2 className="text-ink dark:text-parchment font-display text-2xl font-bold leading-tight select-none">
                {card.text}
            </h2>
            
            <motion.div style={{ opacity: useTransform(x, [-50, 0, 50], [1, 0, 1]) }} className="mt-4 font-rune text-xs text-ink/60 dark:text-parchment/60 uppercase tracking-widest">
                {card.hint}
            </motion.div>
        </div>
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
        setFeedback({ msg: "FATE SEALED", color: "text-emerald-rune" });
    } else {
        setCombo(0);
        updateLife(-3);
        playSound('error');
        setFeedback({ msg: "A POOR OMEN", color: "text-crimson" });
    }

    setIndex(prev => prev + 1);
    if (index + 1 >= cardsData.length) {
        setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative font-body overflow-hidden">
      
      {/* Background Table */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
         {/* Quadrant Lines */}
         <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-ink/20 dark:bg-parchment/10 border-l border-r border-dotted" />
         <div className="absolute top-1/2 left-0 right-0 h-1 bg-ink/20 dark:bg-parchment/10 border-t border-b border-dotted" />

         {/* Quadrant Watermarks */}
         <div className="absolute top-10 left-10 text-4xl font-display font-bold text-ink dark:text-parchment opacity-30">KILL</div>
         <div className="absolute top-10 right-10 text-4xl font-display font-bold text-ink dark:text-parchment opacity-30">INVEST</div>
         <div className="absolute bottom-10 left-10 text-4xl font-display font-bold text-ink dark:text-parchment opacity-30">FRITTER</div>
         <div className="absolute bottom-10 right-10 text-4xl font-display font-black text-ink dark:text-parchment opacity-30">WHILE</div>
      </div>

      {/* Combo Meter */}
      <div className="absolute top-24 right-10 text-right">
          <div className="text-sm font-rune text-ink dark:text-parchment">Spell Chain</div>
          <motion.div 
            key={combo} 
            initial={{ scale: 1.5 }} 
            animate={{ scale: 1 }}
            className={`text-5xl font-display font-bold ${combo > 2 ? 'text-magic-gold drop-shadow-md' : 'text-ink dark:text-parchment'}`}
          >
             x{combo}
          </motion.div>
      </div>

      {/* Card Stack */}
      <div className="relative w-72 h-[26rem] z-10">
         <AnimatePresence>
            {index < cardsData.length ? (
                cardsData.slice(index).map((card, i) => (
                    <Card key={index + i} card={card} index={i} onSwipe={handleSwipe} />
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center bg-parchment border-4 border-magic-gold rounded-xl shadow-2xl p-6 text-center"
                >
                    <h2 className="text-2xl font-display font-bold text-ink mb-4">The Deck is Empty</h2>
                    <p className="font-body italic text-lg">"Your choices have been woven into the tapestry."</p>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Feedback text */}
      {feedback && (
          <div className={`absolute bottom-16 font-display text-2xl font-bold tracking-widest ${feedback.color} animate-pulse drop-shadow-md`}>
              {feedback.msg}
          </div>
      )}

    </div>
  );
};

export default AssetSorter;