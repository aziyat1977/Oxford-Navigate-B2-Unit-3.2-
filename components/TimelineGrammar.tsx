import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface TimelineProps {
  onComplete: () => void;
}

type TenseType = 'continuous' | 'perfect';
type LessonStep = 'leadin' | 'meaning' | 'form' | 'pronunciation' | 'check';

const tenseData = {
  continuous: {
    title: "The Flux (Future Continuous)",
    icon: "🔮",
    color: "text-mystic-blue",
    borderColor: "border-mystic-blue",
    context: "At sunset tomorrow, do not disturb the Archmage...",
    example: "He will be casting the spell.",
    meanings: {
      en: "Action IN PROGRESS at a specific future moment.",
      ru: "Действие В ПРОЦЕССЕ в определенный момент будущего.",
      uz: "Kelajakdagi aniq bir vaqtda DAVOM ETAYOTGAN harakat."
    },
    form: ["Subject", "+ will be +", "Verb-ing"],
    pronunciation: {
      full: "I will be casting",
      contracted: "I'll be casting",
      ipa: "/aɪl bi ˈkɑːstɪŋ/"
    },
    timelineType: "overlap" // Action covers the point in time
  },
  perfect: {
    title: "The Seal (Future Perfect)",
    icon: "📜",
    color: "text-crimson",
    borderColor: "border-crimson",
    context: "By the time the moon rises...",
    example: "I will have finished the potion.",
    meanings: {
      en: "Action COMPLETED BEFORE a future deadline.",
      ru: "Действие ЗАВЕРШЕННОЕ к моменту в будущем.",
      uz: "Kelajakdagi ma'lum bir vaqtgacha TUGALLANGAN harakat."
    },
    form: ["Subject", "+ will have +", "V3 (Past Participle)"],
    pronunciation: {
      full: "I will have finished",
      contracted: "I'll've finished",
      ipa: "/aɪləv ˈfɪnɪʃt/"
    },
    timelineType: "before" // Action happens before the point
  }
};

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  // We start with Continuous, then move to Perfect
  const [currentTense, setCurrentTense] = useState<TenseType>('continuous');
  const [step, setStep] = useState<LessonStep>('leadin');
  
  // For the final finish screen
  const [isFinished, setIsFinished] = useState(false);

  const data = tenseData[currentTense];

  const nextStep = () => {
    playSound('click');
    if (step === 'leadin') setStep('meaning');
    else if (step === 'meaning') setStep('form');
    else if (step === 'form') setStep('pronunciation');
    else if (step === 'pronunciation') {
      if (currentTense === 'continuous') {
        setCurrentTense('perfect');
        setStep('leadin');
      } else {
        setIsFinished(true);
      }
    }
  };

  useEffect(() => {
    if (isFinished) {
      playSound('success');
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, onComplete]);

  // --- RENDER HELPERS ---

  const renderTimeline = () => (
    <div className="relative w-full h-24 flex items-center justify-center my-6 bg-ink/5 dark:bg-parchment/5 rounded-lg border border-ink/20 dark:border-parchment/20">
       {/* The Line */}
       <div className="absolute w-[90%] h-1 bg-ink/30 dark:bg-parchment/30 rounded-full" />
       
       {/* NOW Marker */}
       <div className="absolute left-[10%] flex flex-col items-center">
          <div className="w-3 h-3 bg-ink dark:bg-parchment rounded-full mb-2" />
          <span className="text-[10px] font-rune uppercase opacity-70">Now</span>
       </div>

       {/* FUTURE Marker */}
       <div className="absolute right-[20%] flex flex-col items-center z-10">
          <div className="w-4 h-4 border-2 border-magic-gold bg-obsidian rounded-full mb-2" />
          <span className="text-[10px] font-rune uppercase text-magic-gold">Deadline</span>
       </div>

       {/* VISUALIZATION */}
       {data.timelineType === 'overlap' ? (
         // Future Continuous: A wavy line going THROUGH the deadline
         <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "60%", opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute left-[25%] h-8 bg-mystic-blue/30 border-t-2 border-b-2 border-mystic-blue rounded-full flex items-center justify-center"
         >
            <span className="text-xs font-bold text-mystic-blue bg-obsidian/50 px-2 rounded">IN PROGRESS</span>
         </motion.div>
       ) : (
         // Future Perfect: An X or Block BEFORE the deadline
         <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="absolute right-[35%] flex flex-col items-center"
         >
             <span className="text-3xl">✅</span>
             <span className="text-xs font-bold text-crimson bg-obsidian/50 px-2 rounded mt-1">COMPLETED</span>
         </motion.div>
       )}
    </div>
  );

  if (isFinished) {
    return (
      <div className="h-full w-full bg-obsidian flex flex-col items-center justify-center text-parchment font-display relative overflow-hidden">
        <div className="absolute inset-0 bg-leather-texture opacity-50"/>
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 text-center p-8 border-4 border-magic-gold rounded-lg bg-black/80 backdrop-blur-md"
        >
            <h1 className="text-5xl text-magic-gold mb-6">Codex Updated</h1>
            <p className="font-body text-xl italic mb-4">"You now perceive the flow and the end."</p>
            <div className="text-sm font-rune opacity-70">Redirecting to Pangea...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-parchment dark:bg-obsidian relative font-body text-ink dark:text-parchment overflow-hidden flex items-center justify-center transition-colors bg-paper-texture dark:bg-leather-texture">
      
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-gold to-transparent opacity-50" />

      <AnimatePresence mode="wait">
        <motion.div 
           key={currentTense + step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="w-full max-w-2xl px-6"
        >
           {/* HEADER */}
           <div className={`flex items-center gap-4 mb-6 border-b-2 ${data.borderColor} pb-2`}>
              <span className="text-4xl">{data.icon}</span>
              <div>
                  <h2 className={`text-2xl font-display font-bold ${data.color}`}>{data.title}</h2>
                  <div className="text-xs font-rune opacity-60 uppercase">Chronomancy Level 2</div>
              </div>
           </div>

           {/* CONTENT AREA */}
           <div className="bg-parchment/50 dark:bg-black/40 p-6 rounded-lg border border-ink/10 dark:border-parchment/10 shadow-lg min-h-[300px] flex flex-col justify-center">
              
              {step === 'leadin' && (
                  <div className="text-center">
                      <p className="text-lg font-rune opacity-70 mb-4">The Scenario</p>
                      <p className="text-2xl md:text-3xl font-body italic leading-relaxed mb-6">"{data.context}"</p>
                      <div className="p-4 bg-ink/5 dark:bg-parchment/10 rounded border-l-4 border-magic-gold text-xl font-bold">
                          {data.example}
                      </div>
                  </div>
              )}

              {step === 'meaning' && (
                  <div>
                      <h3 className="text-center font-display font-bold mb-4">The Meaning</h3>
                      {renderTimeline()}
                      
                      <div className="space-y-4 mt-6">
                          <div className="grid grid-cols-[30px_1fr] items-start gap-2">
                             <span className="text-xl">🇬🇧</span>
                             <p className="font-bold text-lg">{data.meanings.en}</p>
                          </div>
                          <div className="grid grid-cols-[30px_1fr] items-start gap-2 text-ink/80 dark:text-parchment/80">
                             <span className="text-xl">🇷🇺</span>
                             <p className="italic">{data.meanings.ru}</p>
                          </div>
                          <div className="grid grid-cols-[30px_1fr] items-start gap-2 text-ink/80 dark:text-parchment/80">
                             <span className="text-xl">🇺🇿</span>
                             <p className="italic">{data.meanings.uz}</p>
                          </div>
                      </div>
                  </div>
              )}

              {step === 'form' && (
                  <div className="text-center">
                      <h3 className="font-display font-bold mb-8">The Spell Structure (Form)</h3>
                      
                      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-lg md:text-2xl font-bold font-mono">
                          {data.form.map((part, i) => (
                              <motion.div 
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className={`px-4 py-3 rounded border-2 ${
                                    part.includes("will") 
                                    ? `bg-${data.color.replace('text-', '')}/20 ${data.borderColor}` 
                                    : "bg-ink/5 dark:bg-parchment/10 border-transparent"
                                }`}
                              >
                                  {part}
                              </motion.div>
                          ))}
                      </div>

                      <div className="mt-8 text-sm opacity-60">
                          *Remember: "Will" creates the future time.
                      </div>
                  </div>
              )}

              {step === 'pronunciation' && (
                  <div className="text-center">
                      <h3 className="font-display font-bold mb-6">The Incantation (Pronunciation)</h3>
                      
                      <div className="mb-8">
                          <p className="text-sm uppercase opacity-60 mb-1">Full Form</p>
                          <p className="text-xl opacity-80">{data.pronunciation.full}</p>
                      </div>

                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`p-6 border-2 ${data.borderColor} rounded-lg bg-black/20 mb-8`}
                      >
                          <p className="text-sm uppercase opacity-60 mb-2">Native Flow (Contraction)</p>
                          <p className={`text-3xl font-bold ${data.color} mb-2`}>{data.pronunciation.contracted}</p>
                          <p className="font-mono text-lg opacity-70">{data.pronunciation.ipa}</p>
                      </motion.div>

                      <button 
                        onClick={() => playSound('swipe')}
                        className="flex items-center justify-center gap-2 mx-auto text-sm font-bold uppercase tracking-widest hover:text-magic-gold transition-colors"
                      >
                         <span>🔊</span> Listen & Repeat
                      </button>
                  </div>
              )}

           </div>

           {/* CONTROLS */}
           <div className="mt-8 flex justify-end">
               <button 
                 onClick={nextStep}
                 className="group relative px-8 py-3 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-bold font-display text-lg rounded-sm overflow-hidden"
               >
                   <span className="relative z-10">
                       {step === 'pronunciation' && currentTense === 'perfect' ? "Complete Codex" : "Next Rune →"}
                   </span>
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
               </button>
           </div>

           {/* Step Indicator */}
           <div className="mt-4 flex justify-center gap-2">
               {['leadin', 'meaning', 'form', 'pronunciation'].map((s, i) => (
                   <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all duration-300 ${s === step ? `w-8 ${data.color.replace('text-', 'bg-')}` : 'w-2 bg-ink/20 dark:bg-parchment/20'}`}
                   />
               ))}
           </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TimelineGrammar;