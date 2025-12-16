import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface KahootProps {
  onComplete: () => void;
  updateLife: (years: number) => void;
}

type Question = {
  q: string;
  options: string[];
  correct: number;
};

const topics: { id: string; title: string; icon: string; theme: string }[] = [
  { id: 'money', title: 'Money', icon: '💰', theme: 'bg-emerald-600' },
  { id: 'time', title: 'Time', icon: '⏳', theme: 'bg-blue-600' },
  { id: 'timetravel', title: 'Time Travel', icon: '🚀', theme: 'bg-purple-600' },
  { id: 'freetime', title: 'Free Time', icon: '🎮', theme: 'bg-pink-600' },
  { id: 'billie', title: 'Billie Eilish', icon: '🎤', theme: 'bg-green-400' },
  { id: 'videogames', title: 'Video Games', icon: '🕹️', theme: 'bg-indigo-600' },
  { id: 'future', title: 'Future Plans', icon: '🔮', theme: 'bg-yellow-600' },
  { id: 'stranger', title: 'Stranger Things', icon: '🚲', theme: 'bg-red-800' },
  { id: 'harry', title: 'Harry Potter', icon: '⚡', theme: 'bg-amber-700' },
  { id: 'mobile', title: 'Mobile Legends', icon: '⚔️', theme: 'bg-cyan-700' },
];

const questionData: Record<string, Question[]> = {
  money: [
    { q: "By age 30, I _____ my first million.", options: ["will have earned", "will be earning", "earn", "earned"], correct: 0 },
    { q: "Don't _____ your salary on useless skins.", options: ["invest", "fritter away", "save", "set aside"], correct: 1 },
    { q: "Smart players _____ their gold in better gear.", options: ["fritter", "waste", "invest", "kill"], correct: 2 },
    { q: "He bought a fake Rolex; he didn't _____.", options: ["choose the right", "run out of", "get his money's worth", "save time"], correct: 2 },
    { q: "Look at him _____! Buying rounds for everyone.", options: ["throwing his money around", "investing", "saving up", "running out"], correct: 0 },
    { q: "I _____ for a house this time next year.", options: ["will have saved", "will be saving", "saved", "am saving"], correct: 1 },
    { q: "We _____ of cash if we eat here.", options: ["will run out", "will be running", "ran out", "run"], correct: 0 },
    { q: "You should _____ some cash for the taxi.", options: ["kill", "while away", "set aside", "waste"], correct: 2 },
    { q: "Buying lottery tickets is a _____ of money.", options: ["worth", "waste", "spare", "short"], correct: 1 },
    { q: "If you _____, you can't buy the potion.", options: ["are short of money", "have money to spare", "invest", "get your worth"], correct: 0 },
  ],
  time: [
    { q: "Don't _____ watching paint dry.", options: ["invest", "kill time", "save time", "choose right"], correct: 1 },
    { q: "We _____ of time before the bomb explodes.", options: ["will be running", "will have run out", "run out", "ran out"], correct: 1 },
    { q: "At 9 PM, I _____ the movie.", options: ["will have watched", "will be watching", "watch", "watched"], correct: 1 },
    { q: "By 10 PM, I _____ the movie.", options: ["will have watched", "will be watching", "am watching", "watch"], correct: 0 },
    { q: "I have no time to _____.", options: ["spare", "save", "keep", "hold"], correct: 0 },
    { q: "He likes to _____ the hours reading comics.", options: ["run out", "while away", "throw around", "short of"], correct: 1 },
    { q: "Choose the _____ to attack!", options: ["right moment", "left time", "waste time", "spare time"], correct: 0 },
    { q: "Next week, we _____ on the beach.", options: ["will have lain", "will be lying", "lie", "lay"], correct: 1 },
    { q: "By tomorrow, the deadline _____.", options: ["will have passed", "will be passing", "passes", "passed"], correct: 0 },
    { q: "Stop _____ time and do your homework!", options: ["investing", "wasting", "saving", "sparing"], correct: 1 },
  ],
  timetravel: [
    { q: "In 2099, I _____ a flying car.", options: ["will have driven", "will be driving", "drive", "drove"], correct: 1 },
    { q: "By the time you get back, I _____ old.", options: ["will be growing", "will have grown", "grow", "grew"], correct: 1 },
    { q: "Don't _____ your jump credits on short trips.", options: ["invest", "fritter away", "save", "get worth"], correct: 1 },
    { q: "We _____ into the vortex at noon.", options: ["will have dived", "will be diving", "dive", "dove"], correct: 1 },
    { q: "By then, history _____.", options: ["will have changed", "will be changing", "changes", "changed"], correct: 0 },
    { q: "This time next century, I _____ dinosaurs.", options: ["will be fighting", "will have fought", "fight", "fought"], correct: 0 },
    { q: "If we lose fuel, we _____ of time.", options: ["will run out", "will be running", "ran", "run"], correct: 0 },
    { q: "Did you _____ from that time trip?", options: ["get your time's worth", "waste time", "kill time", "spare time"], correct: 0 },
    { q: "By 3000, humans _____ Mars.", options: ["will be colonizing", "will have colonized", "colonize", "colonized"], correct: 1 },
    { q: "Don't _____ time paradoxes!", options: ["invest in", "waste time on", "spare", "save"], correct: 1 },
  ],
  freetime: [
    { q: "I usually _____ my weekends sleeping.", options: ["run out", "while away", "invest", "spare"], correct: 1 },
    { q: "Next Saturday, I _____ soccer.", options: ["will be playing", "will have played", "play", "played"], correct: 0 },
    { q: "By Sunday evening, I _____ the whole series.", options: ["will be watching", "will have watched", "watch", "watched"], correct: 1 },
    { q: "I have some energy to _____.", options: ["spare", "waste", "kill", "run out"], correct: 0 },
    { q: "Let's _____ at the mall before the movie.", options: ["save time", "kill time", "run out", "short of"], correct: 1 },
    { q: "Don't _____ your break on TikTok.", options: ["invest", "fritter away", "choose right", "get worth"], correct: 1 },
    { q: "We _____ short of time for lunch.", options: ["are", "have", "do", "make"], correct: 0 },
    { q: "I _____ my hobby into a career soon.", options: ["will have turned", "will be turning", "turn", "turned"], correct: 1 },
    { q: "By next year, I _____ guitar perfectly.", options: ["will have mastered", "will be mastering", "master", "mastered"], correct: 0 },
    { q: "Make sure to _____ time for relaxation.", options: ["set aside", "throw around", "run out", "waste"], correct: 0 },
  ],
  billie: [
    { q: "At 8 PM, Billie _____ on stage.", options: ["will have sung", "will be singing", "sings", "sang"], correct: 1 },
    { q: "By the end of the tour, she _____ 50 cities.", options: ["will be visiting", "will have visited", "visits", "visited"], correct: 1 },
    { q: "Don't _____ money on fake tickets.", options: ["invest", "waste", "spare", "choose"], correct: 1 },
    { q: "She _____ a new album by 2026.", options: ["will be releasing", "will have released", "releases", "released"], correct: 1 },
    { q: "Fans _____ for hours to see her.", options: ["will be waiting", "will have waited", "wait", "waited"], correct: 0 },
    { q: "Did you _____ from the concert ticket?", options: ["get your money's worth", "fritter away", "run out", "waste"], correct: 0 },
    { q: "She doesn't _____ her fame around.", options: ["throw", "set", "run", "kill"], correct: 0 },
    { q: "By the time she's 30, she _____ a legend.", options: ["will have become", "will be becoming", "becomes", "became"], correct: 0 },
    { q: "She _____ writing songs all night.", options: ["will be", "will have been", "is", "was"], correct: 0 },
    { q: "She definitely has talent to _____.", options: ["spare", "waste", "kill", "run"], correct: 0 },
  ],
  videogames: [
    { q: "I _____ this level by midnight.", options: ["will have beaten", "will be beating", "beat", "beating"], correct: 0 },
    { q: "Don't _____ your ammo!", options: ["invest", "waste", "spare", "set aside"], correct: 1 },
    { q: "At this rate, we _____ of health potions.", options: ["will be running", "will run out", "ran", "run"], correct: 1 },
    { q: "I _____ COD all night long.", options: ["will have played", "will be playing", "play", "played"], correct: 1 },
    { q: "You should _____ your skill points wisely.", options: ["fritter", "invest", "kill", "waste"], correct: 1 },
    { q: "He just _____ his gold on a cosmetic hat.", options: ["saved", "frittered away", "invested", "earned"], correct: 1 },
    { q: "By tomorrow, I _____ max level.", options: ["will be reaching", "will have reached", "reach", "reached"], correct: 1 },
    { q: "We _____ the boss when you join.", options: ["will have fought", "will be fighting", "fight", "fought"], correct: 1 },
    { q: "Did you _____ from that DLC?", options: ["get your money's worth", "waste money", "run out", "spare"], correct: 0 },
    { q: "Use this item when you _____ of mana.", options: ["run out", "have spare", "waste", "invest"], correct: 0 },
  ],
  future: [
    { q: "In 2030, I _____ my own company.", options: ["will have run", "will be running", "run", "ran"], correct: 1 },
    { q: "By 2035, I _____ a millionaire.", options: ["will be becoming", "will have become", "become", "became"], correct: 1 },
    { q: "I _____ money every month for a car.", options: ["will be setting aside", "will have set", "set", "setting"], correct: 0 },
    { q: "Don't _____ your potential.", options: ["invest", "waste", "spare", "choose"], correct: 1 },
    { q: "I _____ English fluently by then.", options: ["will be learning", "will have learned", "learn", "learned"], correct: 1 },
    { q: "This time next year, I _____ in London.", options: ["will be living", "will have lived", "live", "lived"], correct: 0 },
    { q: "You must _____ the right career path.", options: ["choose", "waste", "kill", "run"], correct: 0 },
    { q: "By graduation, I _____ all my exams.", options: ["will be passing", "will have passed", "pass", "passed"], correct: 1 },
    { q: "I _____ hard for my goals.", options: ["will be working", "will have worked", "work", "worked"], correct: 0 },
    { q: "Don't _____ your youth.", options: ["invest", "fritter away", "spare", "choose"], correct: 1 },
  ],
  stranger: [
    { q: "By season 5, Eleven _____ the Upside Down.", options: ["will be destroying", "will have destroyed", "destroy", "destroyed"], correct: 1 },
    { q: "The boys _____ D&D tonight.", options: ["will have played", "will be playing", "play", "played"], correct: 1 },
    { q: "Hopper _____ as the sheriff again soon.", options: ["will have served", "will be serving", "serves", "served"], correct: 1 },
    { q: "Don't _____ time, the Demogorgon is coming!", options: ["waste", "invest", "spare", "set"], correct: 0 },
    { q: "By the end, they _____ Hawkins.", options: ["will be saving", "will have saved", "save", "saved"], correct: 1 },
    { q: "Joyce _____ about Will all night.", options: ["will be worrying", "will have worried", "worries", "worried"], correct: 0 },
    { q: "They _____ of Eggos soon.", options: ["will be running", "will run out", "ran", "run"], correct: 1 },
    { q: "Max _____ to Kate Bush on loop.", options: ["will be listening", "will have listened", "listens", "listened"], correct: 0 },
    { q: "Steve _____ his weight around.", options: ["will have thrown", "will be throwing", "throw", "throws"], correct: 1 },
    { q: "By the finale, we _____ all the answers.", options: ["will have found", "will be finding", "find", "found"], correct: 0 },
  ],
  harry: [
    { q: "Harry _____ Quidditch tomorrow.", options: ["will have played", "will be playing", "plays", "played"], correct: 1 },
    { q: "By June, Hermione _____ all the books.", options: ["will be reading", "will have read", "read", "reads"], correct: 1 },
    { q: "Don't _____ your galleons on pranks.", options: ["invest", "fritter away", "save", "spare"], correct: 1 },
    { q: "Ron _____ of spells to use.", options: ["will run out", "will be running", "ran", "run"], correct: 0 },
    { q: "They _____ Voldemort by the end.", options: ["will be defeating", "will have defeated", "defeat", "defeated"], correct: 1 },
    { q: "Malfoy likes to _____ his money around.", options: ["throw", "invest", "save", "set"], correct: 0 },
    { q: "Dumbledore _____ time for Harry.", options: ["will set aside", "will waste", "will kill", "will run"], correct: 0 },
    { q: "Hagrid _____ magical creatures all day.", options: ["will have fed", "will be feeding", "feeds", "fed"], correct: 1 },
    { q: "By the 7th year, they _____ up.", options: ["will be growing", "will have grown", "grow", "grown"], correct: 1 },
    { q: "Fred and George _____ time in the corridors.", options: ["will be killing", "will have killed", "kill", "killed"], correct: 0 },
  ],
  mobile: [
    { q: "I _____ Mid Lane in the next match.", options: ["will have taken", "will be taking", "take", "took"], correct: 1 },
    { q: "By the 10th minute, I _____ the Lord.", options: ["will be taking", "will have taken", "take", "taken"], correct: 1 },
    { q: "Don't _____ your diamonds on useless heroes.", options: ["invest", "waste", "save", "set"], correct: 1 },
    { q: "We _____ the enemy base soon.", options: ["will have pushed", "will be pushing", "push", "pushed"], correct: 1 },
    { q: "By late game, Layla _____ full build.", options: ["will be completing", "will have completed", "complete", "completed"], correct: 1 },
    { q: "You _____ of mana if you spam skills.", options: ["will run out", "will be running", "ran", "run"], correct: 0 },
    { q: "_____ gold for the resurrection item.", options: ["Waste", "Set aside", "Kill", "Throw"], correct: 1 },
    { q: "Don't _____ your ultimate on a minion!", options: ["invest", "fritter away", "save", "get worth"], correct: 1 },
    { q: "While you farm, I _____ the turret.", options: ["will have defended", "will be defending", "defend", "defended"], correct: 1 },
    { q: "By the end of the season, I _____ Mythic rank.", options: ["will have reached", "will be reaching", "reach", "reached"], correct: 0 },
  ],
};

const KahootQuiz: React.FC<KahootProps> = ({ onComplete, updateLife }) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [gameState, setGameState] = useState<'topic-select' | 'question' | 'feedback' | 'finished'>('topic-select');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  
  const timerRef = useRef<any>(null);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'question') {
      setTimer(15);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
             clearInterval(timerRef.current);
             handleAnswer(-1); // Timeout
             return 0;
          }
          if (prev <= 4) playSound('tick');
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, qIndex]);

  const handleTopicSelect = (id: string) => {
    playSound('click');
    setActiveTopic(id);
    setQIndex(0);
    setScore(0);
    setGameState('question');
  };

  const handleAnswer = (optionIndex: number) => {
    clearInterval(timerRef.current);
    if (!activeTopic) return;
    
    const currentQ = questionData[activeTopic][qIndex];
    const isCorrect = optionIndex === currentQ.correct;

    if (isCorrect) {
      const timeBonus = Math.floor(timer * 10);
      setScore(prev => prev + 100 + timeBonus);
      setFeedback('correct');
      playSound('success');
      updateLife(1);
    } else {
      setFeedback('wrong');
      playSound('error');
      updateLife(-2);
    }

    setGameState('feedback');

    setTimeout(() => {
       if (qIndex + 1 < questionData[activeTopic].length) {
         setQIndex(prev => prev + 1);
         setGameState('question');
       } else {
         setGameState('finished');
         playSound('level_complete');
         setCompletedTopics(prev => [...prev, activeTopic]);
       }
    }, 2000);
  };

  const returnToMenu = () => {
    setActiveTopic(null);
    setGameState('topic-select');
  };

  // --- RENDERERS ---

  const renderTopicSelect = () => (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-6xl font-display font-black text-ink dark:text-parchment mb-8 text-center drop-shadow-md">
        CHOOSE YOUR ARENA
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {topics.map(t => {
          const isDone = completedTopics.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => !isDone && handleTopicSelect(t.id)}
              disabled={isDone}
              className={`aspect-square rounded-xl shadow-lg flex flex-col items-center justify-center p-4 transition-all hover:scale-105 active:scale-95 ${isDone ? 'bg-gray-500 opacity-50 cursor-not-allowed' : t.theme}`}
            >
              <span className="text-5xl mb-2 filter drop-shadow-lg">{t.icon}</span>
              <span className="font-bold text-white font-display text-center leading-tight drop-shadow-md">{t.title}</span>
              {isDone && <span className="text-white font-bold mt-2">COMPLETE</span>}
            </button>
          )
        })}
      </div>
      <button onClick={onComplete} className="mt-12 text-ink dark:text-parchment font-rune underline opacity-50 hover:opacity-100">
          Leave the Arena
      </button>
    </div>
  );

  const renderQuestion = () => {
    if (!activeTopic) return null;
    const currentQ = questionData[activeTopic][qIndex];
    const themeColor = topics.find(t => t.id === activeTopic)?.theme || 'bg-blue-600';

    return (
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 relative">
        {/* Header: Score & Timer */}
        <div className="flex justify-between items-center mb-6">
           <div className="bg-black/20 dark:bg-white/10 px-6 py-2 rounded-full font-bold text-xl text-ink dark:text-parchment">
              Score: {score}
           </div>
           <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 ${timer < 5 ? 'bg-red-500 border-red-700 animate-pulse' : 'bg-purple-600 border-purple-800'} text-white shadow-xl`}>
              {timer}
           </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 mb-8 flex items-center justify-center min-h-[30vh] text-center border-b-8 border-gray-300 dark:border-gray-900">
           <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white leading-snug">
              {currentQ.q.includes("_____") ? (
                  currentQ.q.split("_____").map((part, i) => (
                      <React.Fragment key={i}>
                          {part}
                          {i === 0 && <span className="inline-block w-32 border-b-4 border-gray-400 mx-2"></span>}
                      </React.Fragment>
                  ))
              ) : currentQ.q}
           </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
           {currentQ.options.map((opt, i) => {
             const colors = [
                'bg-red-600 border-red-800 hover:bg-red-500', 
                'bg-blue-600 border-blue-800 hover:bg-blue-500', 
                'bg-yellow-500 border-yellow-700 hover:bg-yellow-400', 
                'bg-green-600 border-green-800 hover:bg-green-500'
             ];
             const shapes = ['▲', '◆', '●', '■'];
             
             return (
               <button
                 key={i}
                 onClick={() => handleAnswer(i)}
                 className={`${colors[i]} border-b-8 rounded-lg p-6 flex items-center shadow-lg transition-transform active:translate-y-1 active:border-b-0`}
               >
                 <span className="text-4xl text-white mr-6 opacity-80">{shapes[i]}</span>
                 <span className="text-white font-bold text-xl md:text-2xl text-left leading-tight">{opt}</span>
               </button>
             )
           })}
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300">
           <motion.div 
             className={themeColor}
             initial={{ width: 0 }}
             animate={{ width: `${((qIndex) / 10) * 100}%` }}
             style={{ height: '100%' }}
           />
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    if (!activeTopic) return null;
    const currentQ = questionData[activeTopic][qIndex];
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-lg">
                {feedback === 'correct' ? "CORRECT" : "INCORRECT"}
            </h1>
            <div className="text-3xl text-white font-bold bg-black/20 px-8 py-4 rounded-lg">
               + {feedback === 'correct' ? score - (score % 100) /* Rough logic for display */ : 0} pts
            </div>
            {feedback === 'wrong' && (
                <div className="mt-8 bg-white/90 p-6 rounded-lg text-center">
                    <div className="text-gray-500 font-bold mb-2">Correct Answer:</div>
                    <div className="text-2xl font-bold text-gray-800">{currentQ.options[currentQ.correct]}</div>
                </div>
            )}
        </div>
    )
  };

  const renderFinished = () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900 text-white p-4">
          <h1 className="text-5xl font-black mb-4">PODIUM</h1>
          <div className="bg-white/10 p-8 rounded-xl backdrop-blur-md text-center border-4 border-yellow-400 mb-8">
              <div className="text-yellow-400 text-6xl mb-4">🏆</div>
              <div className="text-2xl font-bold opacity-80">Final Score</div>
              <div className="text-6xl font-black">{score}</div>
          </div>
          <button 
            onClick={returnToMenu}
            className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-xl"
          >
              Choose Another Arena
          </button>
      </div>
  );

  return (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
        {gameState === 'topic-select' && renderTopicSelect()}
        {gameState === 'question' && renderQuestion()}
        {gameState === 'feedback' && renderFeedback()}
        {gameState === 'finished' && renderFinished()}
    </div>
  );
};

export default KahootQuiz;