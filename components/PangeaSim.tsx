import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface PangeaProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    context: "VISION: The floating isles are drifting apart. The process is ongoing.",
    prompt: "In the coming age, the isles ____________ (drift) further.",
    answer: "will be drifting",
    hint: "Use Future Continuous for a process in flow.",
  },
  {
    id: 2,
    context: "PROPHECY: The convergence happens before the eclipse. It is finished by then.",
    prompt: "By the eclipse, the realms ____________ (unite) once more.",
    answer: "will have united",
    hint: "Use Future Perfect for a completed fate.",
  }
];

const PangeaSim: React.FC<PangeaProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const currentStep = steps[stepIndex];

  const checkAnswer = () => {
    const cleanInput = input.toLowerCase().trim();
    if (cleanInput === currentStep.answer) {
      playSound('success');
      setStatus("success");
      setTimeout(() => {
        if (stepIndex + 1 < steps.length) {
            setStepIndex(prev => prev + 1);
            setInput("");
            setStatus("idle");
        } else {
            // Auto-advance
            onComplete();
        }
      }, 2500);
    } else {
      playSound('error');
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="h-full w-full bg-parchment dark:bg-obsidian flex flex-col items-center justify-center relative overflow-hidden bg-paper-texture dark:bg-leather-texture transition-colors">
      
      {/* 3D Realm Visual (Abstract Representation) */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 mb-12 flex items-center justify-center">
        
        {/* Magic Circle Background */}
        <div className={`absolute inset-0 rounded-full border-4 border-double border-ink/20 dark:border-magic-gold/20 ${status === 'error' ? 'animate-pulse border-crimson' : 'animate-[spin_60s_linear_infinite]'}`}>
            <svg viewBox="0 0 100 100" className="opacity-30">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeDasharray="5,5" />
                <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" />
            </svg>
        </div>

        {/* Floating Isles Logic */}
        {/* Isle 1 */}
        <motion.div 
            className="absolute w-24 h-24 bg-mystic-blue/40 rounded-full blur-md flex items-center justify-center"
            initial={{ x: -40, y: -40 }}
            animate={
                stepIndex === 0 
                ? { x: [-40, -60, -40], y: [-40, -20, -40] } // Drifting
                : { x: 0, y: 0 } // Uniting
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
             <span className="text-2xl opacity-50">🏝️</span>
        </motion.div>
        
        {/* Isle 2 */}
        <motion.div 
            className="absolute w-32 h-32 bg-emerald-rune/40 rounded-full blur-md flex items-center justify-center"
            initial={{ x: 40, y: 40 }}
            animate={
                stepIndex === 0 
                ? { x: [40, 60, 40], y: [40, 20, 40] } // Drifting
                : { x: 0, y: 0 } // Uniting
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
             <span className="text-3xl opacity-50">🏔️</span>
        </motion.div>

        {/* Success Burst */}
        <AnimatePresence>
            {status === 'success' && (
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-magic-gold/20 rounded-full blur-xl z-0"
                />
            )}
        </AnimatePresence>
      </div>

      {/* Spell Interface */}
      <div className="z-10 bg-parchment/90 dark:bg-obsidian/90 p-8 rounded-lg border-[6px] border-double border-ink dark:border-magic-gold backdrop-blur-sm max-w-xl w-full shadow-2xl mx-4">
        <div className="flex justify-between items-center mb-6 border-b border-ink/20 dark:border-magic-gold/20 pb-2">
            <h2 className="text-crimson dark:text-mystic-blue font-display font-bold">REALM CONVERGENCE</h2>
            <span className="font-rune text-ink dark:text-parchment">Phase {stepIndex + 1}/{steps.length}</span>
        </div>
        
        <p className="text-ink/60 dark:text-parchment/60 font-body italic mb-4 text-sm">{currentStep.context}</p>
        
        <p className="text-ink dark:text-parchment text-xl md:text-2xl mb-8 font-display leading-relaxed">
             {currentStep.prompt.split("____________").map((part, i) => (
                 <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span className="inline-block w-40 border-b-2 border-dashed border-ink dark:border-magic-gold mx-2"></span>}
                 </React.Fragment>
             ))}
        </p>

        <div className="flex gap-2 relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Incant the verb..."
                className={`flex-1 bg-ink/5 dark:bg-parchment/10 border-2 rounded px-4 py-3 text-ink dark:text-parchment font-body text-xl focus:outline-none focus:ring-0
                    ${status === 'error' ? 'border-crimson' : 'border-ink/30 dark:border-magic-gold/50 focus:border-magic-gold'}
                `}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <button 
                onClick={checkAnswer}
                className="bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-bold px-6 py-3 rounded border-2 border-transparent hover:scale-105 active:scale-95 transition-all font-display shadow-md"
            >
                CAST
            </button>
            
            {/* Success Particles */}
            {status === 'success' && (
                 <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: -50, opacity: 0 }} className="absolute right-0 -top-10 text-magic-gold font-bold">
                     ✨ CAST SUCCESSFUL
                 </motion.div>
            )}
        </div>

        {status === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-crimson font-display font-bold text-sm flex items-center gap-2">
                <span>⚡</span> {currentStep.hint}
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default PangeaSim;