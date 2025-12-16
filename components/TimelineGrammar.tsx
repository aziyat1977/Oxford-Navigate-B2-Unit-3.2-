import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface TimelineProps {
  onComplete: () => void;
}

type TenseType = 'continuous' | 'perfect';

const tenseData = {
  continuous: {
    title: "Future Continuous",
    icon: "🔮",
    color: "text-mystic-blue",
    borderColor: "border-mystic-blue",
    
    // Slide 1: Vision
    vision: {
        scenario: "THE SCENARIO",
        quote: "At sunset tomorrow, do not disturb the Archmage. He will be casting the spell.",
        examples: ["At noon, I will be crossing the bridge.", "They will be waiting in the shadows."]
    },
    
    // Slide 2: Logic
    logic: {
        meaning: "Action IN PROGRESS at a specific moment.",
        timeMarker: "AT A SPECIFIC TIME",
        visualType: "overlap"
    },
    
    // Slide 3: Spell
    spell: {
        formula: ["Subject", "will be", "Verb-ing"],
        pronunciation: "I'll be casting"
    }
  },
  perfect: {
    title: "Future Perfect",
    icon: "📜",
    color: "text-crimson",
    borderColor: "border-crimson",
    
    // Slide 1: Vision
    vision: {
        scenario: "THE DEADLINE",
        quote: "By the time the moon rises, I will have finished the potion.",
        examples: ["By dawn, the army will have retreated.", "She will have mastered it by then."]
    },
    
    // Slide 2: Logic
    logic: {
        meaning: "Action COMPLETED BEFORE a future deadline.",
        timeMarker: "BY A DEADLINE",
        visualType: "before"
    },
    
    // Slide 3: Spell
    spell: {
        formula: ["Subject", "will have", "V3 (Past Part.)"],
        pronunciation: "I'll've finished"
    }
  }
};

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  const [currentTense, setCurrentTense] = useState<TenseType>('continuous');
  // 0: Vision (Context), 1: Logic (Meaning), 2: Spell (Form)
  const [slide, setSlide] = useState<0 | 1 | 2>(0);
  const [isFinished, setIsFinished] = useState(false);

  const data = tenseData[currentTense];

  const nextStep = () => {
    playSound('click');
    if (slide < 2) {
        setSlide(s => (s + 1) as 0 | 1 | 2);
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

  // --- RENDERING SLIDES ---

  // SLIDE 1: VISION (Context)
  const renderVision = () => (
    <motion.div 
        key="vision"
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-6"
    >
        <div className="text-8xl mb-6 animate-float">{data.icon}</div>
        <h3 className="font-rune text-xl opacity-60 uppercase tracking-[0.5em] mb-4 text-ink dark:text-parchment">
            {data.vision.scenario}
        </h3>
        
        <div className="mb-12 max-w-4xl">
            <p className="text-4xl md:text-6xl font-display font-bold leading-tight text-ink dark:text-parchment">
                "{data.vision.quote}"
            </p>
        </div>

        <div className="space-y-4 w-full max-w-2xl">
            {data.vision.examples.map((ex, i) => (
                <div key={i} className={`p-4 border-l-8 ${data.borderColor} bg-ink/5 dark:bg-parchment/5 text-xl md:text-2xl font-bold text-left`}>
                    {ex}
                </div>
            ))}
        </div>
    </motion.div>
  );

  // SLIDE 2: LOGIC (Timeline)
  const renderLogic = () => (
    <motion.div 
        key="logic"
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-6 w-full max-w-5xl"
    >
        <h3 className="font-rune text-xl opacity-60 uppercase tracking-[0.5em] mb-12 text-ink dark:text-parchment">
            The Logic
        </h3>

        {/* Huge Timeline Graphic */}
        <div className="relative w-full h-40 flex items-center my-8">
            {/* The Track */}
            <div className="absolute w-full h-2 bg-ink/20 dark:bg-parchment/20 rounded-full"></div>
            
            {/* Markers */}
            <div className="absolute left-[10%] -top-8 flex flex-col items-center">
                <span className="text-lg font-bold opacity-50">NOW</span>
                <div className="w-4 h-4 bg-ink dark:bg-parchment rounded-full mt-2"></div>
            </div>

            <div className="absolute right-[20%] -top-10 flex flex-col items-center z-10">
                 <span className={`text-xl font-bold ${data.color} mb-2 uppercase`}>{data.logic.timeMarker}</span>
                 <div className="w-6 h-6 border-4 border-magic-gold bg-obsidian rounded-full"></div>
            </div>

            {/* The Visual Representation */}
            {data.logic.visualType === 'overlap' ? (
                // Wavy line for continuous
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1 }}
                    className="absolute left-[20%] h-16 bg-mystic-blue/20 border-y-4 border-mystic-blue flex items-center justify-center backdrop-blur-sm"
                >
                    <span className="text-mystic-blue font-bold tracking-widest bg-obsidian/50 px-2">IN PROGRESS</span>
                </motion.div>
            ) : (
                // Block for perfect
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                    className="absolute right-[30%] -top-16 flex flex-col items-center"
                >
                    <span className="text-6xl">✅</span>
                    <span className="text-crimson font-bold bg-obsidian/80 px-2 mt-2">COMPLETED</span>
                </motion.div>
            )}
        </div>

        <p className="text-4xl md:text-5xl font-display font-bold mt-16 text-ink dark:text-parchment leading-tight">
            {data.logic.meaning}
        </p>
    </motion.div>
  );

  // SLIDE 3: SPELL (Structure)
  const renderSpell = () => (
    <motion.div 
        key="spell"
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-6"
    >
        <h3 className="font-rune text-xl opacity-60 uppercase tracking-[0.5em] mb-12 text-ink dark:text-parchment">
            The Incantation
        </h3>

        {/* Formula Blocks */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
            {data.spell.formula.map((part, i) => (
                <div key={i} className={`px-8 py-6 text-3xl md:text-5xl font-mono font-bold border-4 rounded-xl shadow-lg
                    ${part.includes('will') ? `${data.borderColor} ${data.color} bg-black/10` : 'border-ink/20 dark:border-parchment/20 bg-parchment dark:bg-obsidian text-ink dark:text-parchment'}`}>
                    {part}
                </div>
            ))}
        </div>

        {/* Pronunciation Card */}
        <div className="p-8 border-4 border-double border-magic-gold bg-black/5 dark:bg-white/5 rounded-xl transform rotate-1">
            <p className="text-sm font-rune uppercase opacity-60 mb-2 text-ink dark:text-parchment">Native Flow</p>
            <p className={`text-6xl md:text-7xl font-black ${data.color} tracking-tight`}>
                "{data.spell.pronunciation}"
            </p>
        </div>
    </motion.div>
  );


  // --- FINAL SCREEN ---
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
      
      {/* Top Bar: Title */}
      <div className="w-full p-6 flex justify-between items-center z-10">
         <div className="flex items-center gap-4">
             <span className="text-3xl">{data.icon}</span>
             <h1 className={`text-3xl md:text-4xl font-display font-bold ${data.color}`}>{data.title}</h1>
         </div>
         {/* Slide Dots */}
         <div className="flex gap-2">
             {[0, 1, 2].map(i => (
                 <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === slide ? `bg-${data.color.split('-')[1]}-500` : 'bg-gray-500/30'}`} />
             ))}
         </div>
      </div>

      {/* Main Content Area - Full Screen Slide */}
      <AnimatePresence mode="wait">
         {slide === 0 && renderVision()}
         {slide === 1 && renderLogic()}
         {slide === 2 && renderSpell()}
      </AnimatePresence>

      {/* Bottom Control */}
      <div className="w-full p-6 flex justify-center pb-12 z-10">
          <button 
             onClick={nextStep}
             className="px-12 py-4 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-display font-bold text-2xl rounded-sm hover:scale-105 transition-transform shadow-xl"
          >
              {slide === 2 && currentTense === 'perfect' ? "COMPLETE CODEX" : "NEXT RUNE →"}
          </button>
      </div>

    </div>
  );
};

export default TimelineGrammar;