import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';
import { generateBamboozleQuestions } from '../services/geminiService';

interface BamboozleProps {
  onComplete: () => void;
}

type CardType = 'question' | 'trap' | 'perk';

interface Card {
  id: number;
  type: CardType;
  value: number;
  content?: string; // Question text or Action name
  answer?: string;
  isRevealed: boolean;
  actionType?: 'swap' | 'reset' | 'steal' | 'gift' | 'double' | 'bomb';
}

interface Team {
  id: number;
  name: string;
  score: number;
  avatar: string;
  color: string;
}

const INITIAL_TEAMS: Team[] = [
  { id: 0, name: "Chronos", score: 0, avatar: "⏳", color: "bg-blue-600 border-blue-400" },
  { id: 1, name: "Kairos", score: 0, avatar: "⚖️", color: "bg-crimson border-red-400" },
  { id: 2, name: "Aion", score: 0, avatar: "🌌", color: "bg-purple-600 border-purple-400" },
  { id: 3, name: "Fate", score: 0, avatar: "🔮", color: "bg-emerald-rune border-emerald-300" },
];

const DEFAULT_QUESTIONS = [
  { q: "By 8 PM, I _____ (stream) for 5 hours straight.", a: "will have been streaming" },
  { q: "Don't disturb me. I _____ (grind) XP in Minecraft.", a: "will be grinding" },
  { q: "By 2026, Taylor Swift _____ (release) another era.", a: "will have released" },
  { q: "Stop _____ away your time on Reels!", a: "frittering" },
  { q: "We _____ (run out) of snacks before the movie ends.", a: "will have run out" },
  { q: "This time tomorrow, I _____ (fly) to Korea.", a: "will be flying" },
  { q: "He always _____ his money around on skins.", a: "throws" },
  { q: "By the time you reply, I _____ (delete) the message.", a: "will have deleted" },
  { q: "You should _____ aside time for mental health.", a: "set" },
  { q: "By next season, Mbappe _____ (score) 50 goals.", a: "will have scored" },
  { q: "I _____ (sleep) when you arrive. Use the key.", a: "will be sleeping" },
  { q: "Did you _____ your money's worth from that battle pass?", a: "get" },
  { q: "By 2050, AI _____ (take) over the internet.", a: "will have taken" },
  { q: "We _____ (wait) here for ages by the time he comes.", a: "will have been waiting" },
  { q: "Don't _____ time. The exam starts in 5 mins.", a: "kill / waste" },
  { q: "Next year, I _____ (study) at Hogwarts (I wish).", a: "will be studying" },
];

const ACTIONS = [
  { type: 'bomb', label: "TIMELINE COLLAPSE", desc: "Your score resets to 0.", value: 0 },
  { type: 'swap', label: "REALM SHIFT", desc: "Swap scores with the leading team.", value: 0 },
  { type: 'steal', label: "TIME THIEF", desc: "Steal 50 points from an opponent.", value: 50 },
  { type: 'gift', label: "CHARITY", desc: "Give 25 points to the lowest team.", value: -25 },
  { type: 'double', label: "TEMPORAL SURGE", desc: "Double your current score!", value: 0 },
  { type: 'bomb', label: "GLITCH", desc: "Lose 50 Points.", value: -50 },
  { type: 'swap', label: "CHAOS", desc: "Swap scores with the team to your right.", value: 0 },
  { type: 'steal', label: "VAMPIRISM", desc: "Steal 25 points from everyone.", value: 75 },
];

const BamboozleGame: React.FC<BamboozleProps> = ({ onComplete }) => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [grid, setGrid] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionEffect, setActionEffect] = useState<string>("");

  // Initialize Grid
  useEffect(() => {
    generateGrid(DEFAULT_QUESTIONS);
  }, []);

  const generateGrid = (questions: {q: string, a: string}[]) => {
    let cards: Card[] = [];
    const questionPool = [...questions];
    const actionPool = [...ACTIONS];

    for (let i = 1; i <= 24; i++) {
      // 16 Questions, 8 Actions
      if (i % 3 === 0 && actionPool.length > 0) {
        const action = actionPool.splice(Math.floor(Math.random() * actionPool.length), 1)[0];
        cards.push({
          id: i,
          type: action.type === 'double' || action.type === 'steal' ? 'perk' : 'trap',
          value: action.value,
          content: action.label,
          answer: action.desc,
          actionType: action.type as any,
          isRevealed: false
        });
      } else if (questionPool.length > 0) {
        const q = questionPool.splice(Math.floor(Math.random() * questionPool.length), 1)[0];
        cards.push({
          id: i,
          type: 'question',
          value: 25, // Standard points
          content: q.q,
          answer: q.a,
          isRevealed: false
        });
      } else {
        // Fallback filler
        cards.push({ id: i, type: 'perk', value: 10, content: "LUCKY FIND", answer: "Free 10 Points", isRevealed: false });
      }
    }
    setGrid(cards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, id: i + 1 })));
  };

  const handleAIMagic = async () => {
    setIsGenerating(true);
    playSound('grab'); // Magic sound
    const newQs = await generateBamboozleQuestions();
    if (newQs && newQs.length > 0) {
      generateGrid(newQs);
      playSound('success');
    } else {
      playSound('error');
    }
    setIsGenerating(false);
  };

  const handleCardClick = (card: Card) => {
    if (card.isRevealed || currentCard) return;
    playSound('click');
    setCurrentCard(card);
    
    // Auto-reveal trap/perk effects immediately, questions wait for user
    if (card.type !== 'question') {
        setTimeout(() => handleActionEffect(card), 1000);
    }
  };

  const handleActionEffect = (card: Card) => {
      if (card.type === 'question') return;
      playSound(card.type === 'trap' ? 'error' : 'success');
      
      let msg = "";
      const currentTeam = teams[activeTeamIdx];
      let newTeams = [...teams];

      switch(card.actionType) {
          case 'bomb':
              if (card.value === 0) {
                  newTeams[activeTeamIdx].score = 0;
                  msg = "SCORE WIPED!";
              } else {
                  newTeams[activeTeamIdx].score += card.value;
                  msg = `LOST ${Math.abs(card.value)} PTS!`;
              }
              break;
          case 'double':
              newTeams[activeTeamIdx].score *= 2;
              msg = "SCORE DOUBLED!";
              break;
          case 'swap':
              const leader = [...newTeams].sort((a,b) => b.score - a.score)[0];
              if (leader.id !== currentTeam.id) {
                  const temp = newTeams[activeTeamIdx].score;
                  newTeams[activeTeamIdx].score = leader.score;
                  const leaderIdx = newTeams.findIndex(t => t.id === leader.id);
                  newTeams[leaderIdx].score = temp;
                  msg = `SWAPPED WITH ${leader.name}!`;
              } else {
                  msg = "YOU ARE ALREADY IN THE LEAD!";
              }
              break;
          case 'steal':
              newTeams.forEach((t, i) => {
                  if (i !== activeTeamIdx) {
                       const stealAmount = Math.min(t.score, 25);
                       newTeams[i].score -= stealAmount;
                       newTeams[activeTeamIdx].score += stealAmount;
                  }
              });
              msg = "DRAINED LIFE FROM ENEMIES!";
              break;
           default:
               newTeams[activeTeamIdx].score += card.value;
               msg = `POINTS ADJUSTED: ${card.value > 0 ? '+' : ''}${card.value}`;
      }
      setTeams(newTeams);
      setActionEffect(msg);
      setShowAnswer(true); // Show the "Answer" which is the description
  };

  const resolveQuestion = (correct: boolean) => {
    if (!currentCard) return;
    
    if (correct) {
        playSound('success');
        const newTeams = [...teams];
        newTeams[activeTeamIdx].score += currentCard.value;
        setTeams(newTeams);
    } else {
        playSound('error');
    }

    // Mark as revealed in grid
    setGrid(prev => prev.map(c => c.id === currentCard.id ? { ...c, isRevealed: true } : c));
    
    // Close modal and switch turn
    setTimeout(() => {
        setShowAnswer(false);
        setCurrentCard(null);
        setActionEffect("");
        setActiveTeamIdx((prev) => (prev + 1) % 4);
    }, 1500);
  };
  
  const closeActionModal = () => {
      if (!currentCard) return;
      setGrid(prev => prev.map(c => c.id === currentCard.id ? { ...c, isRevealed: true } : c));
      setShowAnswer(false);
      setCurrentCard(null);
      setActionEffect("");
      setActiveTeamIdx((prev) => (prev + 1) % 4);
  };

  const isGameOver = grid.length > 0 && grid.every(c => c.isRevealed);

  return (
    <div className="h-full w-full bg-obsidian text-parchment relative overflow-hidden flex flex-col p-2 md:p-4 bg-leather-texture">
      
      {/* HEADER & CONTROLS */}
      <div className="flex justify-between items-center mb-4 bg-black/40 p-3 rounded-xl border border-white/10 backdrop-blur-md z-10">
         <div className="flex items-center gap-4">
             <h1 className="text-3xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-crimson to-magic-gold drop-shadow-sm">
                 BAMBOOZLE
             </h1>
             <button 
                onClick={handleAIMagic} 
                disabled={isGenerating}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors disabled:opacity-50"
             >
                <span className={`text-xl ${isGenerating ? 'animate-spin' : ''}`}>🤖</span>
                <span className="font-bold text-xs uppercase tracking-widest">AI Remix</span>
             </button>
         </div>
         <div className="flex gap-2 md:gap-4 overflow-x-auto">
             {teams.map((team, idx) => (
                 <motion.div 
                    key={team.id}
                    animate={{ scale: activeTeamIdx === idx ? 1.1 : 1, opacity: activeTeamIdx === idx ? 1 : 0.7 }}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 min-w-[80px] ${team.color} ${activeTeamIdx === idx ? 'shadow-[0_0_15px_currentColor] z-20' : 'bg-opacity-20 border-opacity-30'}`}
                 >
                     <span className="text-2xl">{team.avatar}</span>
                     <span className="font-bold text-xs uppercase">{team.name}</span>
                     <span className="font-mono text-xl font-bold">{team.score}</span>
                 </motion.div>
             ))}
         </div>
      </div>

      {/* GAME GRID */}
      <div className="flex-1 grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 overflow-y-auto pb-20 p-2">
          {grid.map((card) => (
              <motion.button
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  onClick={() => handleCardClick(card)}
                  disabled={card.isRevealed}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: card.isRevealed ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`relative aspect-[3/4] rounded-lg shadow-lg flex items-center justify-center text-3xl font-black font-display border-2 transition-transform hover:scale-105 active:scale-95
                    ${card.isRevealed 
                        ? 'bg-black/50 border-gray-700 opacity-50 cursor-default' 
                        : 'bg-parchment text-ink border-magic-gold cursor-pointer bg-paper-texture'
                    }
                  `}
              >
                  {/* Front of Card */}
                  <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center">
                       <span className="text-4xl md:text-5xl opacity-80">{card.id}</span>
                       <div className="absolute top-1 right-1 text-[10px] font-rune opacity-50">VIII</div>
                  </div>
                  
                  {/* Back of Card (Revealed State in Grid) */}
                  <div className="absolute inset-0 h-full w-full bg-gray-800 rounded-lg [transform:rotateY(180deg)] backface-hidden flex items-center justify-center">
                        {card.type === 'question' ? '❓' : card.type === 'trap' ? '💣' : '💎'}
                  </div>
              </motion.button>
          ))}
      </div>

      {/* MODAL / CARD VIEW */}
      <AnimatePresence>
          {currentCard && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              >
                  <motion.div 
                    layoutId={`card-${currentCard.id}`}
                    className={`w-full max-w-2xl bg-parchment text-ink rounded-xl border-8 border-double ${currentCard.type === 'trap' ? 'border-crimson' : currentCard.type === 'perk' ? 'border-emerald-500' : 'border-magic-gold'} p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden`}
                  >
                      {/* Background Effects */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      
                      {currentCard.type === 'question' ? (
                          <div className="text-center">
                              <h2 className="text-xl font-rune text-gray-500 uppercase tracking-widest mb-4">Question {currentCard.id}</h2>
                              <div className="text-3xl md:text-5xl font-display font-bold leading-tight mb-12">
                                  {currentCard.content?.split("_____").map((part, i) => (
                                      <React.Fragment key={i}>
                                          {part}
                                          {i === 0 && <span className="inline-block w-24 border-b-4 border-dashed border-ink mx-2"></span>}
                                      </React.Fragment>
                                  ))}
                              </div>

                              {showAnswer ? (
                                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                      <div className="bg-emerald-100 text-emerald-900 px-6 py-3 rounded-lg font-bold text-2xl mb-8 inline-block border-2 border-emerald-500">
                                          {currentCard.answer}
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <button onClick={() => resolveQuestion(false)} className="bg-crimson text-white py-4 rounded-lg font-bold text-xl hover:bg-red-800">OOPS (0 Pts)</button>
                                          <button onClick={() => resolveQuestion(true)} className="bg-emerald-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-emerald-700">NAILED IT (+{currentCard.value})</button>
                                      </div>
                                  </motion.div>
                              ) : (
                                  <button onClick={() => { playSound('click'); setShowAnswer(true); }} className="px-8 py-3 bg-ink text-parchment font-bold text-xl rounded hover:scale-105 transition-transform shadow-lg">
                                      REVEAL TRUTH
                                  </button>
                              )}
                          </div>
                      ) : (
                          // ACTION CARD
                          <div className="text-center flex flex-col items-center">
                               <div className="text-8xl mb-6 animate-bounce">
                                   {currentCard.type === 'trap' ? '💣' : '💎'}
                               </div>
                               <h2 className={`text-4xl md:text-6xl font-black mb-4 ${currentCard.type === 'trap' ? 'text-crimson' : 'text-emerald-600'}`}>
                                   {currentCard.content}
                               </h2>
                               <p className="text-2xl font-body italic opacity-80 mb-8">{currentCard.answer}</p>
                               
                               {actionEffect && (
                                   <motion.div 
                                      initial={{ scale: 0 }} animate={{ scale: 1.2 }} 
                                      className="bg-black text-white px-6 py-2 rounded font-mono font-bold text-xl mb-8 -rotate-2"
                                   >
                                       {actionEffect}
                                   </motion.div>
                               )}

                               <button onClick={closeActionModal} className="px-8 py-3 border-2 border-ink font-bold text-xl rounded hover:bg-ink hover:text-white transition-colors">
                                   CONTINUE
                               </button>
                          </div>
                      )}
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* GAME OVER */}
      {isGameOver && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-6xl md:text-8xl font-black text-magic-gold mb-8">GAME OVER</h1>
              <div className="flex gap-4 items-end mb-12">
                  {[...teams].sort((a,b) => b.score - a.score).map((t, i) => (
                      <motion.div 
                        key={t.id}
                        initial={{ height: 0 }}
                        animate={{ height: Math.max(100, t.score * 2) }} // Scale bar by score
                        className={`w-20 md:w-32 rounded-t-lg ${t.color} flex flex-col justify-end pb-4 border-t-4 border-white/50 relative`}
                      >
                          <div className="absolute -top-12 left-0 w-full text-center text-4xl">{i === 0 ? '👑' : ''}</div>
                          <span className="text-3xl mb-2">{t.avatar}</span>
                          <span className="font-bold">{t.score}</span>
                      </motion.div>
                  ))}
              </div>
              <button onClick={onComplete} className="px-10 py-5 bg-white text-black font-black text-2xl rounded-full hover:scale-110 transition-transform">
                  RETURN TO CODEX
              </button>
          </div>
      )}
    </div>
  );
};

export default BamboozleGame;