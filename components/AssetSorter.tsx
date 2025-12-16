import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface AssetSorterProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

// --- DATA ---
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

interface Sentence {
  id: number;
  pre: string;
  post: string;
  correct: string[]; 
}

const sentences: Sentence[] = [
  { id: 1, pre: "Apps such as Candy Crush are a good way to", post: "the time when you're bored.", correct: ["while away", "kill"] },
  { id: 2, pre: "If you", post: "time, microwave meals are just as good as home-cooked food.", correct: ["are short of", "run out of"] }, 
  { id: 3, pre: "Don't", post: "time worrying about what other people have.", correct: ["waste"] },
  { id: 4, pre: "It's important to", post: "time for the people you care about.", correct: ["set aside", "invest", "make"] },
  { id: 5, pre: "Don't", post: "money, try to save it for something really worth buying.", correct: ["fritter away", "throw your ... around", "waste"] },
  { id: 6, pre: "The best way to", post: "is in your education.", correct: ["invest"] },
  { id: 7, pre: "If education is expensive, make sure you", post: "by working hard.", correct: ["get your ...'s worth"] },
];

const wordBank = [
  "while away", "are short of", "waste", "set aside", "fritter away", "invest", "get your ...'s worth", "kill", "throw your ... around"
];

// --- SPEAKING DATA ---
const speakingQuestions: Record<string, string[]> = {
  'choose the right': [
    "When is it hardest to choose the right moment to speak?",
    "Did you choose the right song for your mood today?",
    "In time travel, how would you choose the right year to visit?"
  ],
  'fritter away': [
    "Do you fritter away your pocket money on snacks?",
    "How do people fritter away their weekends?",
    "If you fritter away your youth, will you regret it?"
  ],
  'get your ...\'s worth': [
    "Did you get your money's worth from your last purchase?",
    "How do you get your time's worth when studying?",
    "If you bought a time machine, how would you get your money's worth?"
  ],
  'have ... to spare': [
    "Do you have time to spare for hobbies these days?",
    "If you had money to spare, where would you fly?",
    "Does a musician have energy to spare after a show?"
  ],
  'invest': [
    "How much time do you invest in listening to music?",
    "Do you plan to invest money in your future plans?",
    "Is it wise to invest emotions in a short friendship?"
  ],
  'kill': [
    "How do you kill time at a boring party?",
    "Does listening to music help you kill time on a bus?",
    "If you could kill time by pausing it, what would you do?"
  ],
  'run out of': [
    "What do you do when you run out of patience?",
    "Have you ever run out of money on a trip?",
    "If the world runs out of music, what happens?"
  ],
  'set aside': [
    "Do you set aside money for big future plans?",
    "Can you set aside time to relax every day?",
    "Why should we set aside our anger in life?"
  ],
  'throw your ... around': [
    "Do celebrities throw their money around too much?",
    "Why shouldn't you throw your weight around in a team?",
    "If you were rich, would you throw your money around?"
  ],
  'waste': [
    "Do you waste time on social media?",
    "Is it a waste of money to buy expensive brands?",
    "How can we stop wasting our life on worries?"
  ],
  'while away': [
    "How do you while away a rainy Sunday?",
    "Can you while away hours listening to jazz?",
    "If you were stuck in the past, how would you while away the time?"
  ],
  'are short of': [
      "Are you short of time during exam week?",
      "If you are short of money, do you ask for help?",
      "Why is the modern world short of patience?"
  ],
  'make': [
      "Do you make time for your family?",
      "How do you make time for music in your life?",
      "If you could make time stop, when would you do it?"
  ]
};

const getQuestionsForWord = (phrase: string): string[] => {
    // Normalize phrase (remove '...')
    const clean = phrase.replace(/\.\.\./g, "...'s").replace("'s", ""); 
    
    // Direct match
    if (speakingQuestions[phrase]) return speakingQuestions[phrase];
    
    // Partial match keys
    const keys = Object.keys(speakingQuestions);
    const found = keys.find(k => phrase.includes(k.replace('...', '')));
    if (found) return speakingQuestions[found];

    // Fallback
    return [
        `How does "${phrase}" relate to your daily life?`,
        `Can using "${phrase}" change your future plans?`,
        `Describe a situation where you might "${phrase}".`
    ];
};

// --- SUB-COMPONENTS ---

const SpeakingOverlay = ({ 
    word, 
    questions, 
    idx, 
    onNext 
}: { 
    word: string, 
    questions: string[], 
    idx: number, 
    onNext: () => void 
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-obsidian/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-gold to-transparent animate-pulse" />
            
            <div className="text-magic-gold font-rune text-xl mb-8 tracking-widest uppercase">
                Oracle Interrogation {idx + 1} / {questions.length}
            </div>
            
            <div className="mb-10 relative">
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full border-4 border-mystic-blue flex items-center justify-center bg-mystic-blue/20"
                 >
                    <span className="text-4xl">🗣️</span>
                 </motion.div>
            </div>
    
            <motion.h3 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-parchment text-3xl md:text-5xl font-display font-bold mb-8 leading-snug max-w-4xl"
            >
                "{questions[idx]}"
            </motion.h3>
    
            <div className="text-parchment/60 italic mb-12 font-body text-xl">
                Speak aloud. Use the phrase <span className="text-magic-gold font-bold border-b border-magic-gold">"{word}"</span>.
            </div>
    
            <button 
                onClick={() => { playSound('click'); onNext(); }}
                className="px-10 py-4 bg-crimson text-parchment font-bold text-xl font-display rounded shadow-[0_0_20px_rgba(220,20,60,0.4)] border-2 border-transparent hover:border-parchment hover:scale-105 transition-all"
            >
                CONFIRM TRANSMISSION
            </button>
        </motion.div>
    );
};


// 1. THE TREASURY (Sorting Game)
const TreasuryGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  // Speaking State
  const [speakingQ, setSpeakingQ] = useState<string[] | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState(0);

  const currentItem = collocations[index];
  const isFinished = index >= collocations.length;

  // Final exit check
  useEffect(() => {
    if (isFinished && !speakingQ) {
      setTimeout(onFinish, 1500);
    }
  }, [isFinished, speakingQ, onFinish]);

  const handleChoice = (choice: Category) => {
    if (feedback !== 'idle' || isFinished || speakingQ) return;

    const isCorrect = choice === currentItem.category;

    if (isCorrect) {
      setFeedback('correct');
      playSound('success');
      updateLife(2);
    } else {
      setFeedback('wrong');
      playSound('error');
      updateLife(-2);
    }

    // After feedback, start speaking phase instead of advancing immediately
    setTimeout(() => {
      setFeedback('idle');
      const questions = getQuestionsForWord(currentItem.text);
      setSpeakingQ(questions);
      setSpeakingIdx(0);
    }, 1000);
  };

  const handleSpeakingNext = () => {
      if (!speakingQ) return;
      if (speakingIdx < speakingQ.length - 1) {
          setSpeakingIdx(prev => prev + 1);
      } else {
          // Done with speaking
          setSpeakingQ(null);
          setSpeakingIdx(0);
          if (index < collocations.length) {
              setIndex(prev => prev + 1);
          }
      }
  };

  if (isFinished && !speakingQ) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <div className="text-8xl mb-4">⚖️</div>
        <h2 className="text-4xl font-display font-bold text-magic-gold">BALANCE RESTORED</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 relative">
      
      {/* Speaking Overlay */}
      <AnimatePresence>
        {speakingQ && currentItem && (
            <SpeakingOverlay 
                word={currentItem.text} 
                questions={speakingQ} 
                idx={speakingIdx} 
                onNext={handleSpeakingNext} 
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">
          The Treasury of Fate
        </h2>
        <div className="font-rune text-xl text-magic-gold">
          {index + 1} / {collocations.length}
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
                key={currentItem.id}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.2, opacity: 0, y: -50 }}
                className={`
                relative w-full max-w-lg aspect-[3/2] flex items-center justify-center p-8 rounded-xl shadow-2xl border-4 
                ${feedback === 'idle' ? 'bg-parchment dark:bg-obsidian border-magic-gold' : ''}
                ${feedback === 'correct' ? 'bg-emerald-rune border-emerald-rune text-obsidian' : ''}
                ${feedback === 'wrong' ? 'bg-crimson border-crimson text-parchment' : ''}
                transition-colors duration-300
                `}
            >
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-current opacity-50"/>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-current opacity-50"/>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-current opacity-50"/>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-current opacity-50"/>

                <h3 className="text-4xl md:text-6xl font-display font-bold text-center leading-tight">
                {currentItem.text}
                </h3>

                {feedback === 'correct' && (
                <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-6 -right-6 text-6xl bg-white rounded-full shadow-lg">✅</motion.div>
                )}
                {feedback === 'wrong' && (
                <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-6 -right-6 text-6xl bg-white rounded-full shadow-lg">❌</motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls / Pedestals */}
      <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8 min-h-[150px]">
        <button
          onClick={() => handleChoice('MONEY')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-mystic-blue/10 border-2 border-mystic-blue/30 rounded-t-full rounded-b-lg hover:bg-mystic-blue/30 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">💰</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-mystic-blue z-10">MONEY</span>
          <div className="h-1 w-12 bg-mystic-blue mt-2 rounded-full"/>
        </button>

        <button
          onClick={() => handleChoice('BOTH')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-magic-gold/10 border-2 border-magic-gold/30 rounded-t-full rounded-b-lg hover:bg-magic-gold/30 active:scale-95 transition-all -translate-y-4"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">⚖️</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-magic-gold z-10">BOTH</span>
          <div className="h-1 w-12 bg-magic-gold mt-2 rounded-full"/>
        </button>

        <button
          onClick={() => handleChoice('TIME')}
          className="group relative flex flex-col items-center justify-end pb-4 bg-emerald-rune/10 border-2 border-emerald-rune/30 rounded-t-full rounded-b-lg hover:bg-emerald-rune/30 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl">⏳</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-emerald-rune z-10">TIME</span>
          <div className="h-1 w-12 bg-emerald-rune mt-2 rounded-full"/>
        </button>
      </div>
      
      <div className="text-center mt-4 text-xs font-rune opacity-50">TAP THE CORRECT PEDESTAL TO SORT THE ESSENCE</div>
    </div>
  );
};

// 2. CONSTELLATION WEAVING (Sentence Game)
const ConstellationGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [qIndex, setQIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  
  // Speaking State
  const [speakingQ, setSpeakingQ] = useState<string[] | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState("");
  
  const currentSentence = sentences[qIndex];
  const isComplete = qIndex >= sentences.length;

  const handleWordSelect = (word: string) => {
    if (solved || speakingQ) return;
    
    // Check if the selected word is ONE of the correct answers
    if (currentSentence.correct.includes(word)) {
      setSolved(true);
      setSelectedWord(word);
      playSound('success');
      updateLife(3);
      
      setTimeout(() => {
        // Init speaking phase
        const qs = getQuestionsForWord(word);
        setSpeakingQ(qs);
        setSpeakingIdx(0);
      }, 1500);
    } else {
      playSound('error');
      updateLife(-2);
    }
  };

  const handleSpeakingNext = () => {
    if (!speakingQ) return;
    if (speakingIdx < speakingQ.length - 1) {
        setSpeakingIdx(prev => prev + 1);
    } else {
        // Done with speaking
        setSpeakingQ(null);
        setSpeakingIdx(0);
        setSolved(false);
        
        if (qIndex + 1 < sentences.length) {
            setQIndex(prev => prev + 1);
        } else {
            onFinish();
        }
    }
  };

  if (isComplete) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-8 relative">
      
      {/* Speaking Overlay */}
      <AnimatePresence>
        {speakingQ && (
            <SpeakingOverlay 
                word={selectedWord} 
                questions={speakingQ} 
                idx={speakingIdx} 
                onNext={handleSpeakingNext} 
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">
          Weaving the Prophecy
        </h2>
        <div className="flex gap-1">
           {sentences.map((_, i) => (
             <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i <= qIndex ? 'bg-magic-gold' : 'bg-gray-500'}`}
             />
           ))}
        </div>
      </div>

      {/* The Scroll / Sentence Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <AnimatePresence mode="wait">
          {!speakingQ && (
            <motion.div
                key={currentSentence.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center"
            >
                <p className="text-3xl md:text-5xl font-display leading-normal text-ink dark:text-parchment drop-shadow-lg">
                {currentSentence.pre}
                <span className={`
                    inline-flex items-center justify-center min-w-[150px] mx-3 border-b-4 border-dashed
                    ${solved ? 'border-magic-gold text-magic-gold' : 'border-ink/50 dark:border-parchment/50 text-transparent'}
                    transition-colors duration-300
                `}>
                    {solved ? selectedWord : "______"}
                </span>
                {currentSentence.post}
                </p>
                
                {solved && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-magic-gold font-rune text-xl"
                >
                    ✨ PROPHECY ALIGNED ✨
                </motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Rune Pool (Word Bank) */}
      <div className="mt-auto pt-8">
        <p className="text-center font-rune text-sm opacity-50 mb-4">SELECT THE MISSING RUNE</p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {wordBank.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordSelect(word)}
              disabled={solved || !!speakingQ}
              className={`
                px-4 py-3 md:px-6 md:py-4 rounded-lg font-body font-bold text-lg md:text-xl border-2 shadow-md transition-all
                bg-parchment dark:bg-obsidian 
                ${(solved || !!speakingQ)
                    ? 'opacity-50 cursor-not-allowed border-transparent' 
                    : 'border-ink/20 dark:border-parchment/20 hover:border-magic-gold hover:scale-105 active:scale-95'
                }
                text-ink dark:text-parchment
              `}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- MAIN CONTAINER ---
const AssetSorter: React.FC<AssetSorterProps> = ({ onComplete, updateLife }) => {
  const [stage, setStage] = useState<'intro' | 'treasury' | 'constellation' | 'complete'>('intro');

  // Renders
  const renderIntro = () => (
    <div 
      onClick={() => { playSound('click'); setStage('treasury'); }}
      className="flex flex-col items-center justify-center h-full text-center p-8 cursor-pointer animate-in fade-in zoom-in duration-500"
    >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-8xl mb-8"
        >
            🔮
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-ink dark:text-parchment mb-6">
            THE TRIALS OF FATE
        </h1>
        <p className="font-body text-2xl italic text-ink/70 dark:text-parchment/70 max-w-lg mx-auto">
            "First, balance the scales. Then, speak the truth."
        </p>
        <div className="mt-12 px-8 py-3 bg-magic-gold text-obsidian font-bold rounded shadow-lg animate-pulse">
            BEGIN TRIAL
        </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-paper-texture dark:bg-leather-texture transition-colors overflow-hidden">
      <AnimatePresence mode="wait">
        
        {stage === 'intro' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             {renderIntro()}
          </motion.div>
        )}

        {stage === 'treasury' && (
          <motion.div key="treasury" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             <TreasuryGame onFinish={() => setStage('constellation')} updateLife={updateLife} />
          </motion.div>
        )}

        {stage === 'constellation' && (
          <motion.div key="constellation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
             <ConstellationGame onFinish={() => setStage('complete')} updateLife={updateLife} />
          </motion.div>
        )}

        {stage === 'complete' && (
          <motion.div 
            key="complete" 
            initial={{opacity:0}} animate={{opacity:1}} 
            onAnimationComplete={() => setTimeout(onComplete, 2000)}
            className="h-full flex flex-col items-center justify-center"
          >
             <div className="text-9xl mb-8 animate-bounce">🗝️</div>
             <h1 className="text-4xl md:text-6xl font-display font-bold text-magic-gold">TRIALS COMPLETE</h1>
             <p className="font-rune text-xl opacity-60 mt-4">The path opens...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AssetSorter;