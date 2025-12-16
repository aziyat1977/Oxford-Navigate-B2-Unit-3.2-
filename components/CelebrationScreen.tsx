import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

interface CelebrationProps {
  badge: string;
  title: string;
  subtitle: string;
  onNext: () => void;
}

const CelebrationScreen: React.FC<CelebrationProps> = ({ badge, title, subtitle, onNext }) => {
  useEffect(() => {
    playSound('level_complete');
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-parchment dark:bg-obsidian bg-paper-texture dark:bg-leather-texture relative overflow-hidden p-6 text-center z-50">
      
      {/* Burst Background */}
      <motion.div 
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1.5, opacity: 1, rotate: 180 }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-magic-gold/20 to-transparent blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="text-8xl md:text-9xl mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] relative z-10 select-none"
      >
        {badge}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="z-10 relative"
      >
        <h2 className="text-crimson dark:text-magic-gold text-lg font-rune tracking-widest uppercase mb-2">
            Trial Completed
        </h2>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-ink dark:text-parchment mb-4">
            {title}
        </h1>
        <p className="text-xl italic text-ink/80 dark:text-parchment/80 font-body max-w-md mx-auto mb-10">
            "{subtitle}"
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => { playSound('click'); onNext(); }}
        className="z-10 relative px-10 py-4 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-display font-bold text-xl rounded-sm border-2 border-magic-gold hover:scale-105 active:scale-95 transition-all shadow-xl group overflow-hidden cursor-pointer"
      >
        <span className="relative z-10">CONTINUE JOURNEY →</span>
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"/>
      </motion.button>

    </div>
  );
};

export default CelebrationScreen;