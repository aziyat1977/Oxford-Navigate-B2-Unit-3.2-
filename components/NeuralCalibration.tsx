import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface NeuralProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

const questions = [
  { 
    q: "This time next week, I _____ on a dragon's back.", 
    options: ["will fly", "will have flown", "will be flying", "am flying"], 
    a: 2,
    ru: "В это же время на следующей неделе я буду лететь на спине дракона.",
    uz: "Keyingi hafta shu vaqtda men ajdaho belida uchayotgan bo'laman."
  },
  { 
    q: "By 2050, wizards _____ a cure for the plague.", 
    options: ["will be finding", "will have found", "find", "are finding"], 
    a: 1,
    ru: "К 2050 году волшебники найдут лекарство от чумы.",
    uz: "2050 yilga kelib sehrgarlar vabo davosini topgan bo'lishadi."
  },
  { 
    q: "Do not disturb. We _____ the feast.", 
    options: ["will have had", "have", "will be having", "had"], 
    a: 2,
    ru: "Не беспокоить. У нас будет пир.",
    uz: "Bezovta qilmang. Biz bazm qilayotgan bo'lamiz."
  },
  { 
    q: "By the time you arrive, the goblins _____.", 
    options: ["will have gone", "will be going", "go", "are going"], 
    a: 0,
    ru: "К моменту твоего прибытия гоблины уже уйдут.",
    uz: "Siz yetib kelguningizcha, goblinlar ketib bo'lishadi."
  },
  { 
    q: "At midnight, the witch _____ her brew.", 
    options: ["will have stirred", "will be stirring", "stirred", "stirs"], 
    a: 1,
    ru: "В полночь ведьма будет помешивать свое варево.",
    uz: "Yarim tunda jodugar damlamasini aralashtirayotgan bo'ladi."
  },
];

// --- TRANSLATION HELPER ---
const TranslationControl = ({ ru, uz }: { ru: string, uz: string }) => {
    const [lang, setLang] = useState<'ru' | 'uz' | null>(null);
    return (
        <div className="flex flex-col items-center gap-2 mt-4 z-20 relative">
            <div className="flex gap-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); setLang(lang === 'ru' ? null : 'ru'); }} 
                    className={`text-xs font-bold px-2 py-1 rounded border ${lang === 'ru' ? 'bg-magic-gold text-obsidian border-magic-gold' : 'border-ink/30 dark:border-parchment/30 text-ink/50 dark:text-parchment/50'}`}
                >
                    RU
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setLang(lang === 'uz' ? null : 'uz'); }} 
                    className={`text-xs font-bold px-2 py-1 rounded border ${lang === 'uz' ? 'bg-emerald-rune text-obsidian border-emerald-rune' : 'border-ink/30 dark:border-parchment/30 text-ink/50 dark:text-parchment/50'}`}
                >
                    UZ
                </button>
            </div>
            <AnimatePresence>
                {lang && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="text-sm font-body italic text-ink dark:text-parchment bg-parchment/80 dark:bg-obsidian/80 px-3 py-1 rounded shadow-sm text-center max-w-lg"
                    >
                        {lang === 'ru' ? ru : uz}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NeuralCalibration: React.FC<NeuralProps> = ({ onComplete, updateLife }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [feedbackState, setFeedbackState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  const [showResult, setShowResult] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (showResult) {
        playSound('success');
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }
  }, [showResult, onComplete]);

  useEffect(() => {
    if (showResult || isPaused) return;
    
    setTimeLeft(15); 
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4) playSound('tick'); 
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [index, isPaused, showResult]);

  const handleTimeOut = () => {
    if (isPaused) return; 
    playSound('error');
    setFeedbackState('incorrect');
    updateLife(-5);
    setStreak(0);
    setIsPaused(true); 
    
    setTimeout(() => {
       setIsPaused(false);
       setFeedbackState('neutral');
       nextQ();
    }, 1000);
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
    if (isPaused) return; 
    
    clearInterval(timerRef.current); 
    setIsPaused(true);

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
        setIsPaused(false);
        setFeedbackState('neutral');
        nextQ();
    }, 800); 
  };

  if (showResult) {
      return (
        <div className="h-full w-full bg-parchment dark:bg-obsidian flex flex-col items-center justify-center font-display bg-paper-texture">
            <h1 className="text-5xl text-magic-gold mb-4 font-bold drop-shadow-md">TRIAL COMPLETE</h1>
            <p className="text-ink dark:text-parchment text-2xl mb-8 font-body italic">
                MASTERY: {Math.round((score / questions.length) * 100)}%
            </p>
            
            <div className="w-64 bg-ink/20 h-2 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-magic-gold"
                />
            </div>
             <p className="text-xs font-rune mt-2 text-ink/60 dark:text-parchment/60 animate-pulse">
                Unlocking the Grimoire...
             </p>
        </div>
      );
  }

  return (
    <div className={`h-full w-full bg-parchment dark:bg-obsidian flex flex-col items-center justify-center font-body relative overflow-hidden transition-colors duration-200 bg-paper-texture dark:bg-leather-texture`}>
      
      {feedbackState === 'correct' && <div className="absolute inset-0 bg-emerald-rune/20 z-0 animate-pulse" />}
      {feedbackState === 'incorrect' && <div className="absolute inset-0 bg-crimson/20 z-0 animate-pulse" />}

      <div className="z-10 w-full max-w-4xl px-8 py-10 border-[6px] border-double border-ink/40 dark:border-magic-gold/40 rounded-lg bg-parchment/90 dark:bg-obsidian/90 shadow-2xl mx-4">
          
          <div className="flex justify-between items-center mb-8 font-rune text-lg text-ink/70 dark:text-parchment/70">
              <div className="text-mystic-blue">Rune: {index + 1}/{questions.length}</div>
              {streak > 1 && <div className="text-magic-gold animate-bounce">Streak x{streak}</div>}
          </div>

          <div className="w-full h-2 bg-ink/20 dark:bg-parchment/20 mb-12 relative rounded-full overflow-hidden">
             <motion.div 
               key={index}
               initial={{ width: "100%" }}
               animate={{ width: isPaused ? `${(timeLeft/15)*100}%` : "0%" }} 
               transition={{ duration: isPaused ? 0 : 15, ease: "linear" }}
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
                className="flex flex-col items-center"
              >
                  <h2 className="text-3xl md:text-5xl text-ink dark:text-parchment font-display font-bold mb-4 leading-tight text-center">
                      {questions[index].q.split("_____").map((part, i) => (
                          <React.Fragment key={i}>
                              {part}
                              {i === 0 && <span className="inline-block w-20 md:w-40 border-b-4 border-dotted border-mystic-blue mx-2"></span>}
                          </React.Fragment>
                      ))}
                  </h2>
                  
                  <div className="mb-12">
                     <TranslationControl ru={questions[index].ru} uz={questions[index].uz} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {questions[index].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="relative p-6 bg-parchment dark:bg-black border-2 border-ink dark:border-gray-600 hover:border-magic-gold hover:shadow-[0_0_15px_#d4af37] active:scale-95 active:bg-ink/5 dark:active:bg-magic-gold/10 transition-all text-left group overflow-hidden shadow-md"
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