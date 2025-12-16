import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface TimelineProps {
  onComplete: () => void;
}

type TenseType = 'continuous' | 'perfect';

// Data Structure Updated for Multilingual Support
const tenseData = {
  continuous: {
    title: "Future Continuous",
    icon: "🔮",
    color: "text-mystic-blue",
    bgGradient: "from-mystic-blue/20",
    borderColor: "border-mystic-blue",
    
    vision: {
        scenario: "THE SCENARIO",
        quote: "Do not disturb the Archmage. He will be casting the spell.",
    },
    
    logic: {
        meaning: "Action IN PROGRESS at a specific moment.",
        timeMarker: "AT 10:00 PM",
        visualType: "overlap"
    },

    examplesList: [
        { 
            en: "I will be flying to Mars.", highlightEn: "will be flying",
            ru: "Я буду лететь на Марс.", highlightRu: "буду лететь",
            uz: "Men Marsga uchayotgan bo'laman.", highlightUz: "uchayotgan bo'laman"
        },
        { 
            en: "She will be coding the matrix.", highlightEn: "will be coding",
            ru: "Она будет создавать матрицу.", highlightRu: "будет создавать",
            uz: "U matritsani kodlayotgan bo'ladi.", highlightUz: "kodlayotgan bo'ladi"
        },
        { 
            en: "We will be dancing at midnight.", highlightEn: "will be dancing",
            ru: "Мы будем танцевать в полночь.", highlightRu: "будем танцевать",
            uz: "Biz yarim tunda raqsga tushayotgan bo'lamiz.", highlightUz: "raqsga tushayotgan bo'lamiz"
        }
    ],
    
    spell: {
        formula: ["Subject", "will be", "Verb-ing"],
        pronunciation: "I'll be casting"
    }
  },
  perfect: {
    title: "Future Perfect",
    icon: "📜",
    color: "text-crimson",
    bgGradient: "from-crimson/20",
    borderColor: "border-crimson",
    
    vision: {
        scenario: "THE DEADLINE",
        quote: "By the time the moon rises, I will have finished the potion.",
    },
    
    logic: {
        meaning: "Action COMPLETED BEFORE a future deadline.",
        timeMarker: "BY MIDNIGHT",
        visualType: "before"
    },

    examplesList: [
        { 
            en: "I will have saved the world.", highlightEn: "will have saved",
            ru: "Я уже спасу этот мир.", highlightRu: "уже спасу",
            uz: "Men dunyoni qutqargan bo'laman.", highlightUz: "qutqargan bo'laman"
        },
        { 
            en: "They will have built the city.", highlightEn: "will have built",
            ru: "Они уже построят город.", highlightRu: "уже построят",
            uz: "Ular shaharni qurib bo'lishadi.", highlightUz: "qurib bo'lishadi"
        },
        { 
            en: "Time will have healed us.", highlightEn: "will have healed",
            ru: "Время уже исцелит нас.", highlightRu: "уже исцелит",
            uz: "Vaqt bizni davolagan bo'ladi.", highlightUz: "davolagan bo'ladi"
        }
    ],
    
    spell: {
        formula: ["Subject", "will have", "V3 (Past Part.)"],
        pronunciation: "I'll've finished"
    }
  }
};

const RotatingExampleView: React.FC<{ example: any, color: string }> = ({ example, color }) => {
    const [lang, setLang] = useState<'en' | 'ru' | 'uz'>('en');
    
    useEffect(() => {
        const sequence: ('en' | 'ru' | 'uz')[] = ['en', 'ru', 'uz'];
        let idx = 0;
        const timer = setInterval(() => {
            idx = (idx + 1) % 3;
            setLang(sequence[idx]);
        }, 4000); // 4 seconds per language
        return () => clearInterval(timer);
    }, []);

    const content = {
        en: { text: example.en, highlight: example.highlightEn },
        ru: { text: example.ru, highlight: example.highlightRu },
        uz: { text: example.uz, highlight: example.highlightUz }
    }[lang];

    const words = content.text.split(" ");
    
    // Determine language label for UI nicety
    const langLabel = { en: "ENGLISH", ru: "RUSSIAN", uz: "UZBEK" }[lang];

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 text-center relative z-10 w-full">
            <motion.div 
                key="label"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} 
                className="absolute top-1/4 font-rune text-sm tracking-[0.5em] text-ink dark:text-parchment mb-8"
            >
                {langLabel}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={lang}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex flex-wrap justify-center gap-x-3 md:gap-x-6 gap-y-2 max-w-[95vw]"
                >
                    {words.map((word: string, i: number) => {
                        const cleanWord = word.replace(/[.,]/g, "").toLowerCase();
                        const cleanHighlight = content.highlight.toLowerCase();
                        // Simple inclusion check for highlighting
                        const isHighlight = cleanHighlight.includes(cleanWord); 
                        
                        return (
                            <span 
                                key={i} 
                                className={`
                                    text-[clamp(2.5rem,7vw,9rem)] leading-none font-display font-black
                                    ${isHighlight ? color : 'text-ink dark:text-parchment'}
                                    ${isHighlight ? 'drop-shadow-[0_0_30px_currentColor]' : ''}
                                `}
                            >
                                {word}{" "}
                            </span>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  const [currentTense, setCurrentTense] = useState<TenseType>('continuous');
  const [slide, setSlide] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  const data = tenseData[currentTense];
  const totalSlides = 6;

  const nextStep = () => {
    playSound('click');
    if (slide < totalSlides - 1) {
        setSlide(s => s + 1);
    } else {
        if (currentTense === 'continuous') {
            setCurrentTense('perfect');
            setSlide(0);
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

  // Background particles
  const renderParticles = () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
              <motion.div
                  key={i}
                  className={`absolute rounded-full opacity-20 ${data.color.replace('text-', 'bg-')}`}
                  initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: Math.random() * window.innerHeight,
                      scale: Math.random() * 0.5 + 0.5 
                  }}
                  animate={{ 
                      y: [null, Math.random() * window.innerHeight],
                      x: [null, Math.random() * window.innerWidth]
                  }}
                  transition={{ 
                      duration: Math.random() * 20 + 20,
                      repeat: Infinity, 
                      ease: "linear",
                      repeatType: "mirror"
                  }}
                  style={{ width: Math.random() * 200 + 50, height: Math.random() * 200 + 50, filter: 'blur(40px)' }}
              />
          ))}
      </div>
  );

  // Slide Renderers
  const renderVision = () => (
    <motion.div 
        key="vision"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-6 relative z-10"
    >
        <div className="text-[15vh] mb-6 animate-float">{data.icon}</div>
        <h3 className="font-rune text-3xl opacity-60 uppercase tracking-[0.5em] mb-8 text-ink dark:text-parchment">
            {data.vision.scenario}
        </h3>
        <div className="max-w-6xl">
            <p className="text-5xl md:text-8xl font-display font-bold leading-tight text-ink dark:text-parchment drop-shadow-lg">
                "{data.vision.quote}"
            </p>
        </div>
    </motion.div>
  );

  const renderLogic = () => (
    <motion.div 
        key="logic"
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-obsidian"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <motion.div 
             className={`absolute inset-0 bg-gradient-radial ${data.bgGradient} to-transparent opacity-30`}
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {renderParticles()}

        <div className="relative w-full h-[60vh] flex items-center justify-center">
            <div className="absolute w-full h-2 md:h-4 bg-white/10">
                 <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                    className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                 />
            </div>
            
            <div className="absolute left-[10%] h-full flex flex-col items-center justify-center">
                <div className="h-full w-1 bg-white/20 absolute"></div>
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 2, type: "spring" }}
                    className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-[0_0_50px_white] z-10" 
                />
                <span className="absolute bottom-0 text-xl md:text-2xl font-rune text-white/50 tracking-widest mb-4">NOW</span>
            </div>

            <div className="absolute right-[20%] h-full flex flex-col items-center justify-center">
                 <div className={`h-full w-2 md:w-4 ${data.color.replace('text-', 'bg-')}/30 absolute`}></div>
                 <motion.div 
                    initial={{ y: -500, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    className={`w-16 h-16 md:w-24 md:h-24 border-8 ${data.borderColor} bg-obsidian rounded-full z-10 shadow-[0_0_60px_currentColor] ${data.color}`}
                 />
                 <span className={`absolute top-0 mt-8 text-3xl md:text-5xl font-display font-black ${data.color} tracking-tight`}>
                    {data.logic.timeMarker}
                 </span>
            </div>

            {data.logic.visualType === 'overlap' ? (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "60%", opacity: 1 }}
                    transition={{ duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute left-[15%] h-32 md:h-48 bg-mystic-blue/20 border-y-4 border-mystic-blue flex items-center justify-center backdrop-blur-sm overflow-hidden z-20"
                >
                     <motion.div 
                        animate={{ x: ["-20%", "20%"] }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                        className="text-[10vw] md:text-8xl text-mystic-blue font-display font-black opacity-30 whitespace-nowrap"
                     >
                        IN PROGRESS >>> IN PROGRESS
                     </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ scale: 4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 3, type: "spring", bounce: 0.2, delay: 1.5 }}
                    className="absolute right-[30%] z-30"
                >
                     <div className="relative">
                        <div className="absolute inset-0 bg-crimson blur-3xl opacity-40 animate-pulse"></div>
                        <div className="border-[12px] border-crimson text-crimson text-6xl md:text-9xl font-black px-12 py-4 rounded-xl -rotate-12 bg-obsidian/90 shadow-2xl">
                            FINISHED
                        </div>
                     </div>
                </motion.div>
            )}
        </div>

        <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-12 md:bottom-24 text-center max-w-6xl px-6"
        >
            <span className="text-3xl md:text-5xl font-body italic text-parchment">
                {data.logic.meaning}
            </span>
        </motion.p>
    </motion.div>
  );

  const renderSpell = () => (
    <motion.div 
        key="spell"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-6 w-full z-10"
    >
        <h3 className="font-rune text-3xl opacity-60 uppercase tracking-[0.5em] mb-16 text-ink dark:text-parchment">
            The Incantation
        </h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
            {data.spell.formula.map((part, i) => (
                <motion.div 
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.5, duration: 1, type: "spring" }}
                    className={`px-10 py-8 text-4xl md:text-7xl font-mono font-bold border-4 rounded-2xl shadow-2xl
                    ${part.includes('will') ? `${data.borderColor} ${data.color} bg-black/20` : 'border-ink/20 dark:border-parchment/20 bg-parchment dark:bg-obsidian text-ink dark:text-parchment'}`}
                >
                    {part}
                </motion.div>
            ))}
        </div>
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2, duration: 1 }}
            className="p-10 border-8 border-double border-magic-gold bg-black/5 dark:bg-white/5 rounded-2xl transform -rotate-1"
        >
            <p className="text-lg font-rune uppercase opacity-60 mb-4 text-ink dark:text-parchment">Native Flow</p>
            <p className={`text-6xl md:text-8xl font-black ${data.color} tracking-tight`}>
                "{data.spell.pronunciation}"
            </p>
        </motion.div>
    </motion.div>
  );

  if (isFinished) {
    return (
      <div className="h-full w-full bg-obsidian flex flex-col items-center justify-center text-parchment font-display relative overflow-hidden">
        <div className="absolute inset-0 bg-leather-texture opacity-50"/>
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 text-center p-12 border-4 border-magic-gold rounded-xl bg-black/80 backdrop-blur-md"
        >
            <h1 className="text-6xl text-magic-gold mb-6">Codex Updated</h1>
            <p className="font-body text-2xl italic mb-4">"You now perceive the flow and the end."</p>
            <div className="text-lg font-rune opacity-70 animate-pulse">Redirecting to Pangea...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-parchment dark:bg-obsidian relative font-body text-ink dark:text-parchment overflow-hidden flex flex-col bg-paper-texture dark:bg-leather-texture transition-colors">
      
      {slide !== 1 && (
          <div className="w-full p-6 flex justify-between items-center z-50">
             <div className="flex items-center gap-4">
                 <span className="text-4xl">{data.icon}</span>
                 <h1 className={`text-4xl md:text-5xl font-display font-bold ${data.color}`}>{data.title}</h1>
             </div>
             <div className="flex gap-4">
                 {[...Array(totalSlides)].map((_, i) => (
                     <div key={i} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-500 ${i === slide ? `bg-${data.color.split('-')[1]}-500` : 'bg-gray-500/30'}`} />
                 ))}
             </div>
          </div>
      )}

      <AnimatePresence mode="wait">
         {slide === 0 && renderVision()}
         {slide === 1 && renderLogic()}
         {slide === 2 && <RotatingExampleView key="ex1" example={data.examplesList[0]} color={data.color} />}
         {slide === 3 && <RotatingExampleView key="ex2" example={data.examplesList[1]} color={data.color} />}
         {slide === 4 && <RotatingExampleView key="ex3" example={data.examplesList[2]} color={data.color} />}
         {slide === 5 && renderSpell()}
      </AnimatePresence>

      <div className="absolute bottom-10 left-10 z-50 pointer-events-none">
          <button 
             onClick={nextStep}
             className="pointer-events-auto px-12 py-5 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-display font-bold text-3xl rounded-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-parchment dark:border-ink"
          >
              {slide === 5 && currentTense === 'perfect' ? "COMPLETE CODEX" : "NEXT RUNE →"}
          </button>
      </div>
    </div>
  );
};

export default TimelineGrammar;