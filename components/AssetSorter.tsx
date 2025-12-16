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
  ru: string;
  uz: string;
}

const collocations: Collocation[] = [
  { id: 'c1', text: 'choose the right', category: 'TIME', ru: 'выбрать правильный (момент)', uz: "to'g'ri (paytni) tanlash" },
  { id: 'c2', text: 'fritter away', category: 'BOTH', ru: 'растрачивать по пустякам', uz: 'behuda sarflamoq' },
  { id: 'c3', text: 'get your ...\'s worth', category: 'MONEY', ru: 'окупить свои затраты', uz: 'puli arzigulik bo\'lmoq' },
  { id: 'c4', text: 'have ... to spare', category: 'BOTH', ru: 'иметь в запасе (лишнее)', uz: 'ortiqcha ... bor bo\'lmoq' },
  { id: 'c5', text: 'invest', category: 'BOTH', ru: 'инвестировать / вкладывать', uz: 'sarmoya kiritmoq' },
  { id: 'c6', text: 'kill', category: 'TIME', ru: 'убить время', uz: 'vaqt o\'tkazmoq' },
  { id: 'c7', text: 'run out of', category: 'BOTH', ru: 'заканчиваться / иссякать', uz: 'tugab qolmoq' },
  { id: 'c8', text: 'set aside', category: 'BOTH', ru: 'откладывать / выделять', uz: 'olib qo\'ymoq / ajratmoq' },
  { id: 'c9', text: 'throw your ... around', category: 'MONEY', ru: 'сорить (деньгами)', uz: '(pulni) sochmoq' },
  { id: 'c10', text: 'waste', category: 'BOTH', ru: 'тратить впустую', uz: 'sarflamoq (bekorga)' },
  { id: 'c11', text: 'while away', category: 'TIME', ru: 'коротать время', uz: 'vaqtni o\'tkazmoq (bo\'sh vaqtda)' },
];

interface Sentence {
  id: number;
  pre: string;
  post: string;
  correct: string[]; 
  ru: string;
  uz: string;
}

const sentences: Sentence[] = [
  { id: 1, pre: "Apps such as Candy Crush are a good way to", post: "the time when you're bored.", correct: ["while away", "kill"], ru: "Приложения, такие как Candy Crush — хороший способ скоротать время, когда скучно.", uz: "Candy Crush kabi ilovalar zerikkaningizda vaqt o'tkazishning yaxshi usulidir." },
  { id: 2, pre: "If you", post: "time, microwave meals are just as good as home-cooked food.", correct: ["are short of", "run out of"], ru: "Если у вас мало времени, еда из микроволновки так же хороша, как и домашняя.", uz: "Agar vaqtingiz kam bo'lsa, mikroto'lqinli pechda tayyorlangan ovqat uy taomi kabi yaxshidir." }, 
  { id: 3, pre: "Don't", post: "time worrying about what other people have.", correct: ["waste"], ru: "Не трать время на переживания о том, что есть у других.", uz: "Boshqalarda nima borligi haqida qayg'urib, vaqtni behuda sarflamang." },
  { id: 4, pre: "It's important to", post: "time for the people you care about.", correct: ["set aside", "invest", "make"], ru: "Важно выделять время для людей, которые вам дороги.", uz: "Sizga g'amxo'rlik qiladigan odamlar uchun vaqt ajratish muhimdir." },
  { id: 5, pre: "Don't", post: "money, try to save it for something really worth buying.", correct: ["fritter away", "throw your ... around", "waste"], ru: "Не растрачивай деньги, постарайся сберечь их для чего-то действительно стоящего.", uz: "Pulni behuda sarflamang, uni haqiqatan ham sotib olishga arziydigan narsaga saqlashga harakat qiling." },
  { id: 6, pre: "The best way to", post: "is in your education.", correct: ["invest"], ru: "Лучший способ инвестировать — это ваше образование.", uz: "Sarmoya kiritishning eng yaxshi usuli - bu sizning ta'limingiz." },
  { id: 7, pre: "If education is expensive, make sure you", post: "by working hard.", correct: ["get your ...'s worth"], ru: "Если образование дорогое, убедитесь, что оно того стоит, усердно работая.", uz: "Agar ta'lim qimmat bo'lsa, qattiq mehnat qilib, pulingizga arzigulik bo'lishiga ishonch hosil qiling." },
];

const wordBank = [
  "while away", "are short of", "waste", "set aside", "fritter away", "invest", "get your ...'s worth", "kill", "throw your ... around"
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
                        className="text-sm font-body italic text-ink dark:text-parchment bg-parchment/80 dark:bg-obsidian/80 px-3 py-1 rounded shadow-sm"
                    >
                        {lang === 'ru' ? ru : uz}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SPEAKING DATA (Simplified for brevity, logic remains) ---
const getQuestionsForWord = (phrase: string): string[] => {
    return [
        `How does "${phrase}" relate to your daily life?`,
        `Can using "${phrase}" change your future plans?`,
        `Describe a situation where you might "${phrase}".`
    ];
};

// --- SUB-COMPONENTS ---

const SpeakingOverlay = ({ word, questions, idx, onNext }: { word: string, questions: string[], idx: number, onNext: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-obsidian/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
        >
            <div className="text-magic-gold font-rune text-xl mb-8 tracking-widest uppercase">
                Oracle Interrogation {idx + 1} / {questions.length}
            </div>
            <motion.h3 className="text-parchment text-3xl md:text-5xl font-display font-bold mb-8 leading-snug max-w-4xl">
                "{questions[idx]}"
            </motion.h3>
            <div className="text-parchment/60 italic mb-12 font-body text-xl">
                Speak aloud. Use the phrase <span className="text-magic-gold font-bold border-b border-magic-gold">"{word}"</span>.
            </div>
            <button onClick={() => { playSound('click'); onNext(); }} className="px-10 py-4 bg-crimson text-parchment font-bold text-xl font-display rounded shadow-[0_0_20px_rgba(220,20,60,0.4)]">
                CONFIRM TRANSMISSION
            </button>
        </motion.div>
    );
};

// 1. THE TREASURY (Sorting Game)
const TreasuryGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [speakingQ, setSpeakingQ] = useState<string[] | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState(0);

  const currentItem = collocations[index];
  const isFinished = index >= collocations.length;

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
          setSpeakingQ(null);
          setSpeakingIdx(0);
          if (index < collocations.length) setIndex(prev => prev + 1);
      }
  };

  if (isFinished && !speakingQ) return <div className="flex flex-col items-center justify-center h-full animate-pulse"><div className="text-8xl mb-4">⚖️</div><h2 className="text-4xl font-display font-bold text-magic-gold">BALANCE RESTORED</h2></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 relative">
      <AnimatePresence>
        {speakingQ && currentItem && <SpeakingOverlay word={currentItem.text} questions={speakingQ} idx={speakingIdx} onNext={handleSpeakingNext} />}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">The Treasury of Fate</h2>
        <div className="font-rune text-xl text-magic-gold">{index + 1} / {collocations.length}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
                key={currentItem.id}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.2, opacity: 0, y: -50 }}
                className={`relative w-full max-w-lg flex flex-col items-center justify-center p-8 rounded-xl shadow-2xl border-4 ${feedback === 'idle' ? 'bg-parchment dark:bg-obsidian border-magic-gold' : ''} ${feedback === 'correct' ? 'bg-emerald-rune border-emerald-rune text-obsidian' : ''} ${feedback === 'wrong' ? 'bg-crimson border-crimson text-parchment' : ''} transition-colors duration-300`}
            >
                <h3 className="text-4xl md:text-6xl font-display font-bold text-center leading-tight">{currentItem.text}</h3>
                <TranslationControl ru={currentItem.ru} uz={currentItem.uz} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8 min-h-[150px]">
        <button onClick={() => handleChoice('MONEY')} className="group relative flex flex-col items-center justify-end pb-4 bg-mystic-blue/10 border-2 border-mystic-blue/30 rounded-t-full rounded-b-lg hover:bg-mystic-blue/30 active:scale-95 transition-all">
          <span className="font-display font-bold text-xl md:text-2xl text-mystic-blue z-10">MONEY</span>
        </button>
        <button onClick={() => handleChoice('BOTH')} className="group relative flex flex-col items-center justify-end pb-4 bg-magic-gold/10 border-2 border-magic-gold/30 rounded-t-full rounded-b-lg hover:bg-magic-gold/30 active:scale-95 transition-all -translate-y-4">
          <span className="font-display font-bold text-xl md:text-2xl text-magic-gold z-10">BOTH</span>
        </button>
        <button onClick={() => handleChoice('TIME')} className="group relative flex flex-col items-center justify-end pb-4 bg-emerald-rune/10 border-2 border-emerald-rune/30 rounded-t-full rounded-b-lg hover:bg-emerald-rune/30 active:scale-95 transition-all">
          <span className="font-display font-bold text-xl md:text-2xl text-emerald-rune z-10">TIME</span>
        </button>
      </div>
    </div>
  );
};

// 2. CONSTELLATION WEAVING (Sentence Game)
const ConstellationGame = ({ onFinish, updateLife }: { onFinish: () => void, updateLife: (n: number) => void }) => {
  const [qIndex, setQIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [speakingQ, setSpeakingQ] = useState<string[] | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState("");
  
  const currentSentence = sentences[qIndex];
  const isComplete = qIndex >= sentences.length;

  const handleWordSelect = (word: string) => {
    if (solved || speakingQ) return;
    if (currentSentence.correct.includes(word)) {
      setSolved(true);
      setSelectedWord(word);
      playSound('success');
      updateLife(3);
      setTimeout(() => {
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
        setSpeakingQ(null);
        setSpeakingIdx(0);
        setSolved(false);
        if (qIndex + 1 < sentences.length) setQIndex(prev => prev + 1);
        else onFinish();
    }
  };

  if (isComplete) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-8 relative">
      <AnimatePresence>
        {speakingQ && <SpeakingOverlay word={selectedWord} questions={speakingQ} idx={speakingIdx} onNext={handleSpeakingNext} />}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 border-b-2 border-ink/10 dark:border-parchment/10 pb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-ink dark:text-parchment uppercase tracking-widest">Weaving the Prophecy</h2>
        <div className="flex gap-1">
           {sentences.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i <= qIndex ? 'bg-magic-gold' : 'bg-gray-500'}`} />)}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative">
        <AnimatePresence mode="wait">
          {!speakingQ && (
            <motion.div
                key={currentSentence.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="w-full text-center flex flex-col items-center"
            >
                <p className="text-3xl md:text-5xl font-display leading-normal text-ink dark:text-parchment drop-shadow-lg">
                {currentSentence.pre}
                <span className={`inline-flex items-center justify-center min-w-[150px] mx-3 border-b-4 border-dashed ${solved ? 'border-magic-gold text-magic-gold' : 'border-ink/50 dark:border-parchment/50 text-transparent'} transition-colors duration-300`}>
                    {solved ? selectedWord : "______"}
                </span>
                {currentSentence.post}
                </p>
                <TranslationControl ru={currentSentence.ru} uz={currentSentence.uz} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-8">
        <p className="text-center font-rune text-sm opacity-50 mb-4">SELECT THE MISSING RUNE</p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {wordBank.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordSelect(word)}
              disabled={solved || !!speakingQ}
              className={`px-4 py-3 md:px-6 md:py-4 rounded-lg font-body font-bold text-lg md:text-xl border-2 shadow-md transition-all bg-parchment dark:bg-obsidian ${(solved || !!speakingQ) ? 'opacity-50 cursor-not-allowed border-transparent' : 'border-ink/20 dark:border-parchment/20 hover:border-magic-gold hover:scale-105 active:scale-95'} text-ink dark:text-parchment`}
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
  return (
    <div className="h-full w-full bg-paper-texture dark:bg-leather-texture transition-colors overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
            <div onClick={() => { playSound('click'); setStage('treasury'); }} className="flex flex-col items-center justify-center h-full text-center p-8 cursor-pointer animate-in fade-in zoom-in duration-500">
                <div className="text-8xl mb-8">🔮</div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-ink dark:text-parchment mb-6">THE TRIALS OF FATE</h1>
                <div className="mt-12 px-8 py-3 bg-magic-gold text-obsidian font-bold rounded shadow-lg animate-pulse">BEGIN TRIAL</div>
            </div>
          </motion.div>
        )}
        {stage === 'treasury' && <motion.div key="treasury" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full"><TreasuryGame onFinish={() => setStage('constellation')} updateLife={updateLife} /></motion.div>}
        {stage === 'constellation' && <motion.div key="constellation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full"><ConstellationGame onFinish={() => setStage('complete')} updateLife={updateLife} /></motion.div>}
        {stage === 'complete' && <motion.div key="complete" initial={{opacity:0}} animate={{opacity:1}} onAnimationComplete={() => setTimeout(onComplete, 2000)} className="h-full flex flex-col items-center justify-center"><div className="text-9xl mb-8 animate-bounce">🗝️</div><h1 className="text-4xl md:text-6xl font-display font-bold text-magic-gold">TRIALS COMPLETE</h1></motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default AssetSorter;