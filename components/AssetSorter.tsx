import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { playSound } from '../utils/audio';

interface AssetSorterProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

// --- DATA: EXERCISE 1 (VENN DIAGRAM) ---
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

// Pre-filled items for visual reference (not draggable)
const staticItems = [
  { text: 'be short of', category: 'BOTH', x: 0, y: 0 },
  { text: 'take your', category: 'TIME', x: 150, y: -40 },
];

// --- DATA: EXERCISE 2 (SENTENCES) ---
interface Sentence {
  id: number;
  pre: string;
  post: string;
  correct: string[]; // Allow multiple valid answers if applicable
}

const sentences: Sentence[] = [
  { id: 1, pre: "Apps such as Candy Crush are a good way to", post: "the time when you're bored.", correct: ["while away", "kill"] },
  { id: 2, pre: "If you", post: "time, microwave meals are just as good as home-cooked food.", correct: ["are short of", "run out of"] }, // Adapted "be short of" to fit context
  { id: 3, pre: "Don't", post: "time worrying about what other people have.", correct: ["waste"] },
  { id: 4, pre: "It's important to", post: "time for the people you care about.", correct: ["set aside", "invest", "make"] },
  { id: 5, pre: "Don't", post: "money, try to save it for something really worth buying.", correct: ["fritter away", "throw your ... around", "waste"] },
  { id: 6, pre: "The best way to", post: "is in your education.", correct: ["invest"] },
  { id: 7, pre: "If education is expensive, make sure you", post: "by working hard.", correct: ["get your ...'s worth"] },
];

const wordBank = [
  "while away", "are short of", "waste", "set aside", "fritter away", "invest", "get your ...'s worth", "kill", "throw your ... around"
];


// --- COMPONENT: DRAGGABLE WORD PILL ---
interface DraggableWordProps {
  text: string;
  id: string;
  onDrop: (id: string, zone: Category | null) => void;
}

const DraggableWord: React.FC<DraggableWordProps> = ({ text, id, onDrop }) => {
    const controls = useDragControls();
    
    return (
        <motion.div
            drag
            dragControls={controls}
            whileDrag={{ scale: 1.2, zIndex: 100, textShadow: "0 0 8px #fff" }}
            dragSnapToOrigin={true}
            onDragEnd={(e, info) => {
                const dropX = info.point.x;
                const dropY = info.point.y;
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                // Simple Zone Detection based on screen coordinates
                // Center (Both) takes priority
                const centerX = width / 2;
                const centerY = height / 2;
                
                let zone: Category | null = null;
                
                // Distance from center
                const dist = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));
                
                if (dist < 100) {
                    zone = 'BOTH';
                } else if (dropX < centerX - 50) {
                    zone = 'MONEY';
                } else if (dropX > centerX + 50) {
                    zone = 'TIME';
                }
                
                onDrop(id, zone);
            }}
            className="px-4 py-2 bg-ink dark:bg-parchment text-parchment dark:text-ink font-bold font-body rounded-full shadow-lg border-2 border-magic-gold cursor-grab active:cursor-grabbing text-sm md:text-base m-2 inline-block whitespace-nowrap z-50 hover:scale-105 transition-transform"
        >
            {text}
        </motion.div>
    );
};


const AssetSorter: React.FC<AssetSorterProps> = ({ onComplete, updateLife }) => {
  const [stage, setStage] = useState<'intro' | 'venn' | 'sentences' | 'complete'>('intro');
  
  // State for Venn
  const [vennPlacements, setVennPlacements] = useState<Record<string, Category | null>>({});
  const [vennShowAnswers, setVennShowAnswers] = useState(false);
  
  // State for Sentences
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<number, string>>({});
  const [sentencesShowAnswers, setSentencesShowAnswers] = useState(false);

  // --- LOGIC: VENN ---
  const handleVennDrop = (id: string, zone: Category | null) => {
      playSound('click');
      setVennPlacements(prev => ({ ...prev, [id]: zone }));
  };

  const checkVenn = () => {
      let correctCount = 0;
      collocations.forEach(c => {
          if (vennPlacements[c.id] === c.category) correctCount++;
      });
      
      if (correctCount === collocations.length) {
          playSound('success');
          updateLife(5);
          setTimeout(() => setStage('sentences'), 1500);
      } else {
          playSound('error');
          updateLife(-2);
      }
  };

  // --- LOGIC: SENTENCES ---
  // Simple "click to fill" mechanic for better UX on mobile than intricate drop targets
  const [activeSentenceId, setActiveSentenceId] = useState<number | null>(null);

  const handleWordBankClick = (word: string) => {
      if (activeSentenceId !== null) {
          playSound('click');
          setSentenceAnswers(prev => ({ ...prev, [activeSentenceId]: word }));
          setActiveSentenceId(null);
      }
  };

  const checkSentences = () => {
      let correctCount = 0;
      sentences.forEach(s => {
          if (sentenceAnswers[s.id] && s.correct.includes(sentenceAnswers[s.id])) correctCount++;
      });

      if (correctCount === sentences.length) {
          playSound('level_complete');
          updateLife(5);
          setStage('complete');
          setTimeout(onComplete, 2000);
      } else {
          playSound('error');
          updateLife(-2);
      }
  };


  // --- RENDERS ---

  const renderIntro = () => (
      <div 
        onClick={() => setStage('venn')}
        className="flex flex-col items-center justify-center h-full text-center p-8 cursor-pointer"
      >
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="text-8xl mb-6"
          >
              ⚖️
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink dark:text-parchment mb-4">
              THE CHRONO-VENN
          </h1>
          <p className="font-body text-xl italic text-ink/70 dark:text-parchment/70 animate-pulse">
              Tap to Begin Calibration
          </p>
      </div>
  );

  const renderVenn = () => (
      <div className="h-full w-full relative flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 flex justify-between items-center z-20">
              <h2 className="font-display font-bold text-ink dark:text-parchment text-xl">
                  SORTER: Sort the concepts
              </h2>
              <div className="flex gap-2">
                  <button onClick={() => setVennShowAnswers(!vennShowAnswers)} className="text-xs font-rune text-mystic-blue underline">
                      {vennShowAnswers ? "Hide Truth" : "Reveal Truth"}
                  </button>
                  <button onClick={checkVenn} className="px-4 py-1 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-bold rounded shadow-lg hover:scale-105 transition-transform">
                      VERIFY
                  </button>
              </div>
          </div>

          {/* Draggable Pool (Top) */}
          <div className="flex-none p-4 min-h-[100px] flex flex-wrap justify-center gap-2 z-30">
              {collocations.map(c => (
                  !vennPlacements[c.id] && (
                      <DraggableWord key={c.id} id={c.id} text={c.text} onDrop={handleVennDrop} />
                  )
              ))}
          </div>

          {/* The Venn Diagram */}
          <div className="flex-1 relative flex items-center justify-center">
               
               {/* Left Circle (Money) */}
               <motion.div 
                  className={`absolute w-[40vh] h-[40vh] md:w-[50vh] md:h-[50vh] rounded-full border-4 border-mystic-blue bg-mystic-blue/10 flex items-center justify-center -translate-x-1/4 backdrop-blur-sm z-10 transition-colors
                    ${vennShowAnswers ? 'bg-mystic-blue/30' : ''}
                  `}
               >
                   <span className="absolute left-10 md:left-20 font-display font-black text-4xl text-mystic-blue opacity-50 pointer-events-none">MONEY</span>
                   
                   {/* Dropped Items: Money */}
                   <div className="flex flex-col gap-1 items-center pr-20 pt-20">
                        {collocations.filter(c => vennPlacements[c.id] === 'MONEY').map(c => (
                            <span 
                                key={c.id} onClick={() => handleVennDrop(c.id, null)}
                                className={`px-2 py-0.5 rounded text-xs md:text-sm font-bold cursor-pointer ${vennShowAnswers && c.category !== 'MONEY' ? 'bg-crimson text-white' : 'bg-mystic-blue text-obsidian'}`}
                            >
                                {c.text}
                            </span>
                        ))}
                        {vennShowAnswers && collocations.filter(c => c.category === 'MONEY' && vennPlacements[c.id] !== 'MONEY').map(c => (
                            <span key={c.id} className="text-xs text-mystic-blue/50 italic">{c.text}</span>
                        ))}
                   </div>
               </motion.div>

               {/* Right Circle (Time) */}
               <motion.div 
                  className={`absolute w-[40vh] h-[40vh] md:w-[50vh] md:h-[50vh] rounded-full border-4 border-emerald-rune bg-emerald-rune/10 flex items-center justify-center translate-x-1/4 backdrop-blur-sm z-10 transition-colors
                    ${vennShowAnswers ? 'bg-emerald-rune/30' : ''}
                  `}
               >
                   <span className="absolute right-10 md:right-20 font-display font-black text-4xl text-emerald-rune opacity-50 pointer-events-none">TIME</span>
                   
                   {/* Dropped Items: Time */}
                   <div className="flex flex-col gap-1 items-center pl-20 pt-20">
                        {/* Static Example */}
                        <span className="text-emerald-rune/50 italic text-xs mb-2">take your</span>

                        {collocations.filter(c => vennPlacements[c.id] === 'TIME').map(c => (
                            <span 
                                key={c.id} onClick={() => handleVennDrop(c.id, null)}
                                className={`px-2 py-0.5 rounded text-xs md:text-sm font-bold cursor-pointer ${vennShowAnswers && c.category !== 'TIME' ? 'bg-crimson text-white' : 'bg-emerald-rune text-obsidian'}`}
                            >
                                {c.text}
                            </span>
                        ))}
                        {vennShowAnswers && collocations.filter(c => c.category === 'TIME' && vennPlacements[c.id] !== 'TIME').map(c => (
                            <span key={c.id} className="text-xs text-emerald-rune/50 italic">{c.text}</span>
                        ))}
                   </div>
               </motion.div>

               {/* Center Intersection (Both) - Logical Zone */}
               <div className="absolute z-20 w-[15vh] h-[30vh] flex flex-col items-center justify-center gap-1">
                    {/* Static Example */}
                    <span className="text-parchment/50 italic text-xs mb-2">be short of</span>

                    {collocations.filter(c => vennPlacements[c.id] === 'BOTH').map(c => (
                        <span 
                            key={c.id} onClick={() => handleVennDrop(c.id, null)}
                            className={`px-2 py-0.5 rounded text-xs md:text-sm font-bold cursor-pointer whitespace-nowrap ${vennShowAnswers && c.category !== 'BOTH' ? 'bg-crimson text-white' : 'bg-magic-gold text-obsidian'}`}
                        >
                            {c.text}
                        </span>
                    ))}
                    {vennShowAnswers && collocations.filter(c => c.category === 'BOTH' && vennPlacements[c.id] !== 'BOTH').map(c => (
                        <span key={c.id} className="text-xs text-magic-gold/50 italic whitespace-nowrap">{c.text}</span>
                    ))}
               </div>

          </div>
          <div className="p-2 text-center text-xs text-ink/40 dark:text-parchment/40">Drag phrases to the correct sphere</div>
      </div>
  );

  const renderSentences = () => (
      <div className="h-full w-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-ink/20 pb-4">
              <h2 className="font-display font-bold text-ink dark:text-parchment text-xl md:text-3xl">
                  SYNTAX WEAVE: Complete the prophecies
              </h2>
              <div className="flex gap-2">
                  <button onClick={() => setSentencesShowAnswers(!sentencesShowAnswers)} className="text-xs font-rune text-mystic-blue underline">
                      {sentencesShowAnswers ? "Hide" : "Peek"}
                  </button>
                  <button onClick={checkSentences} className="px-6 py-2 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-bold rounded shadow-lg hover:scale-105 transition-transform">
                      CAST
                  </button>
              </div>
          </div>

          {/* Word Bank */}
          <div className="flex flex-wrap gap-2 mb-8 bg-black/10 dark:bg-white/5 p-4 rounded-lg border border-ink/20 dark:border-magic-gold/20">
              <span className="w-full text-xs font-bold opacity-50 mb-2">WORD BANK (Tap a blank below, then tap a word):</span>
              {wordBank.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleWordBankClick(word)}
                    className="px-3 py-1 bg-parchment dark:bg-obsidian border border-ink dark:border-parchment rounded hover:bg-magic-gold hover:text-obsidian transition-colors text-sm font-mono"
                  >
                      {word}
                  </button>
              ))}
          </div>

          {/* Sentences List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {sentences.map((s) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: s.id * 0.1 }}
                    className="flex flex-wrap items-baseline gap-2 text-lg md:text-xl text-ink dark:text-parchment leading-relaxed p-2 rounded hover:bg-white/5"
                  >
                      <span className="font-bold text-magic-gold/50">{s.id}.</span>
                      <span>{s.pre}</span>
                      
                      <button
                        onClick={() => setActiveSentenceId(s.id)}
                        className={`min-w-[120px] px-2 border-b-2 transition-all font-bold text-center
                           ${activeSentenceId === s.id ? 'border-magic-gold bg-magic-gold/20 scale-105' : 'border-ink/50 dark:border-parchment/50'}
                           ${sentencesShowAnswers && !s.correct.includes(sentenceAnswers[s.id]) ? 'text-crimson' : 'text-mystic-blue'}
                        `}
                      >
                          {sentencesShowAnswers ? s.correct[0] : (sentenceAnswers[s.id] || "__________")}
                      </button>

                      <span>{s.post}</span>
                      
                      {/* Status Icon */}
                      {sentenceAnswers[s.id] && !sentencesShowAnswers && (
                          <span className="text-base">
                              {s.correct.includes(sentenceAnswers[s.id]) ? '✨' : '❌'}
                          </span>
                      )}
                  </motion.div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="h-full w-full bg-paper-texture dark:bg-leather-texture transition-colors">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
             <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                 {renderIntro()}
             </motion.div>
        )}
        {stage === 'venn' && (
             <motion.div key="venn" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                 {renderVenn()}
             </motion.div>
        )}
        {stage === 'sentences' && (
             <motion.div key="sentences" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                 {renderSentences()}
             </motion.div>
        )}
        {stage === 'complete' && (
             <div className="h-full flex items-center justify-center text-4xl font-display text-magic-gold animate-bounce">
                 LOGIC CALIBRATED
             </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetSorter;