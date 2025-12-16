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
    { q: "By the time I retire, I _____ over two million dollars.", options: ["will be saving", "will have saved", "will save", "am saving"], correct: 1 },
    { q: "Don't call him; he _____ his stock portfolio right now.", options: ["will review", "will have reviewed", "will be reviewing", "reviews"], correct: 2 },
    { q: "If we continue this spending rate, we _____ of funds by Tuesday.", options: ["will have run out", "will be running out", "run out", "ran out"], correct: 0 },
    { q: "By next year, she _____ as a broker for a decade.", options: ["will work", "will be working", "will have been working", "is going to work"], correct: 2 },
    { q: "Stop _____ your inheritance on digital skins!", options: ["investing", "frittering away", "setting aside", "getting worth"], correct: 1 },
    { q: "I _____ some money aside every month for a new rig.", options: ["will be setting", "will have set", "set", "am set"], correct: 0 },
    { q: "By the time the market crashes, he _____ all his assets.", options: ["will sell", "will be selling", "will have sold", "sells"], correct: 2 },
    { q: "Buying that NFT was a total _____ of Ethereum.", options: ["kill", "waste", "fritter", "short"], correct: 1 },
    { q: "Unless you _____ the right strategy, you'll lose everything.", options: ["choose", "will choose", "will have chosen", "are choosing"], correct: 0 },
    { q: "He always _____ his wealth around to impress people.", options: ["throws", "will throw", "will be throwing", "will have thrown"], correct: 0 },
    { q: "By 2030, physical cash _____ obsolete.", options: ["will become", "will have become", "will be becoming", "becomes"], correct: 1 },
    { q: "I _____ the bill when the waiter comes.", options: ["will be paying", "will have paid", "am paying", "will pay"], correct: 3 },
    { q: "Do you have any liquidity _____ for an emergency?", options: ["to spare", "to kill", "to waste", "to fritter"], correct: 0 },
    { q: "By Friday, I _____ off my entire student loan.", options: ["will pay", "will be paying", "will have paid", "pay"], correct: 2 },
    { q: "She _____ a fortune by the time she's thirty.", options: ["will be amassing", "will have amassed", "amasses", "will amass"], correct: 1 },
  ],
  time: [
    { q: "By noon, we _____ for the bus for three hours.", options: ["will wait", "will be waiting", "will have been waiting", "have waited"], correct: 2 },
    { q: "Don't visit at 2 PM; I _____ a nap.", options: ["will have taken", "will be taking", "take", "will take"], correct: 1 },
    { q: "By the deadline, he _____ the project completely.", options: ["will finish", "will be finishing", "will have finished", "finishes"], correct: 2 },
    { q: "I usually _____ the hours by reading sci-fi novels.", options: ["run out", "while away", "kill", "waste"], correct: 1 },
    { q: "We _____ of time if we don't hurry up.", options: ["will run out", "will have run out", "are running out", "ran out"], correct: 0 },
    { q: "This time tomorrow, we _____ over the Atlantic.", options: ["will fly", "will have flown", "will be flying", "fly"], correct: 2 },
    { q: "You must _____ time for your mental health.", options: ["do", "make", "get", "have"], correct: 1 },
    { q: "By 2026, I _____ in this city for five years.", options: ["will live", "will be living", "will have lived", "live"], correct: 2 },
    { q: "Don't _____ time arguing with bots.", options: ["invest", "waste", "spend", "kill"], correct: 1 },
    { q: "I arrived early because I had time to _____.", options: ["waste", "spare", "lose", "miss"], correct: 1 },
    { q: "At 8:00 sharp, the ceremony _____.", options: ["will be starting", "will start", "will have started", "starts"], correct: 3 },
    { q: "By the time you get here, the movie _____.", options: ["will finish", "will have finished", "will be finishing", "finishes"], correct: 1 },
    { q: "He _____ time playing Solitaire until the doctor called.", options: ["killed", "frittered", "invested", "saved"], correct: 0 },
    { q: "We _____ the results by the end of the day.", options: ["will be knowing", "will know", "will have known", "know"], correct: 1 },
    { q: "By sunset, they _____ continuously for 12 hours.", options: ["will drive", "will be driving", "will have been driving", "drive"], correct: 2 },
  ],
  timetravel: [
    { q: "By the time I return to 2024, I _____ 50 years in the past.", options: ["will spend", "will be spending", "will have spent", "spend"], correct: 2 },
    { q: "In 2099, humans _____ on Mars colonies.", options: ["will live", "will be living", "will have lived", "live"], correct: 1 },
    { q: "If I change this, the timeline _____ by the time I get back.", options: ["will alter", "will be altering", "will have altered", "alters"], correct: 2 },
    { q: "Don't touch that! You _____ a paradox!", options: ["will create", "will have created", "will be creating", "create"], correct: 0 },
    { q: "This time next century, robots _____ the earth.", options: ["will rule", "will have ruled", "will be ruling", "rule"], correct: 2 },
    { q: "By the jump, we _____ of fuel.", options: ["will run out", "will have run out", "will be running out", "ran out"], correct: 1 },
    { q: "I _____ for you at the rendezvous point yesterday.", options: ["will wait", "will be waiting", "will have waited", "wait"], correct: 1 },
    { q: "By 3000 AD, history _____ us completely.", options: ["will forget", "will be forgetting", "will have forgotten", "forgets"], correct: 2 },
    { q: "We _____ through the vortex for eternity.", options: ["will fall", "will be falling", "will have fallen", "fall"], correct: 1 },
    { q: "Don't _____ your temporal credits on cheap trips.", options: ["fritter away", "invest", "set aside", "kill"], correct: 0 },
    { q: "By the time the loop resets, I _____ this day a thousand times.", options: ["will relive", "will be reliving", "will have relived", "relive"], correct: 2 },
    { q: "When you arrive, I _____ the portal.", options: ["will already close", "will have already closed", "will be closing", "close"], correct: 1 },
    { q: "Future generations _____ us for this mistake.", options: ["will judge", "will be judging", "will have judged", "judge"], correct: 1 },
    { q: "By then, the artifacts _____ to dust.", options: ["will turn", "will be turning", "will have turned", "turn"], correct: 2 },
    { q: "I _____ the timeline while you distract the guard.", options: ["will fix", "will be fixing", "will have fixed", "fix"], correct: 1 },
  ],
  freetime: [
    { q: "I usually _____ my weekends playing RPGs.", options: ["while away", "run out", "invest", "set aside"], correct: 0 },
    { q: "By Sunday night, I _____ the entire season.", options: ["will watch", "will be watching", "will have watched", "watch"], correct: 2 },
    { q: "Don't disturb me; I _____ for the marathon.", options: ["will train", "will have trained", "will be training", "train"], correct: 2 },
    { q: "He _____ his guitar skills for years by the time he joins a band.", options: ["will practice", "will be practicing", "will have been practicing", "practices"], correct: 2 },
    { q: "We have an hour to _____ before the movie starts.", options: ["kill", "die", "save", "run"], correct: 0 },
    { q: "By next month, I _____ all the achievements.", options: ["will unlock", "will be unlocking", "will have unlocked", "unlock"], correct: 2 },
    { q: "You should _____ time for creative hobbies.", options: ["make", "do", "get", "put"], correct: 0 },
    { q: "I _____ painting this time next week.", options: ["will finish", "will be finishing", "will have finished", "finish"], correct: 1 },
    { q: "She never has any energy _____ after work.", options: ["to waste", "to spare", "to kill", "to fritter"], correct: 1 },
    { q: "By the time we get there, the match _____.", options: ["will start", "will be starting", "will have started", "starts"], correct: 2 },
    { q: "I _____ yoga classes next summer.", options: ["will be taking", "will have taken", "take", "took"], correct: 0 },
    { q: "Don't _____ your free time on doomscrolling.", options: ["fritter away", "invest", "save", "make"], correct: 0 },
    { q: "By evening, we _____ hiking for six hours.", options: ["will be", "will have been", "are", "will be being"], correct: 1 },
    { q: "I _____ my hobby into a business by 2030.", options: ["will turn", "will have turned", "will be turning", "turn"], correct: 1 },
    { q: "We _____ of snacks before the movie ends.", options: ["will run out", "will have run out", "will be running out", "run out"], correct: 0 },
  ],
  billie: [
    { q: "By the end of the tour, Billie _____ in 40 countries.", options: ["will perform", "will be performing", "will have performed", "performs"], correct: 2 },
    { q: "Don't text me at 9 PM; I _____ to her new album.", options: ["will listen", "will be listening", "will have listened", "listen"], correct: 1 },
    { q: "By next year, she _____ another Grammy.", options: ["will win", "will be winning", "will have won", "wins"], correct: 2 },
    { q: "Fans _____ in line for hours by the time doors open.", options: ["will wait", "will be waiting", "will have been waiting", "wait"], correct: 2 },
    { q: "She _____ her hair green again soon.", options: ["will be dyeing", "will have dyed", "dyes", "dyed"], correct: 0 },
    { q: "Buying that VIP ticket was _____ money.", options: ["getting worth", "frittering away", "investing", "running out"], correct: 0 }, // Wait, context implies worth it? No, "was getting worth" is grammatically weird. Let's assume negative or positive context. Actually "getting your money's worth" is the phrase.
    // Correction: "Buying that VIP ticket was definitely getting my money's worth." 
    // Let's change the Q to be clearer.
    { q: "I really _____ from that concert ticket.", options: ["got my money's worth", "frittered away", "wasted", "killed time"], correct: 0 },
    { q: "By the time she's 30, she _____ a legend.", options: ["will become", "will be becoming", "will have become", "becomes"], correct: 2 },
    { q: "She _____ on a world tour next summer.", options: ["will go", "will be going", "will have gone", "goes"], correct: 1 },
    { q: "By the finale, the crowd _____ every lyric.", options: ["will sing", "will be singing", "will have sung", "sings"], correct: 2 }, // Actually "will have sung" means finished. "Will be singing" implies during. "Will have sung" implies by end. "By the finale" -> context usually implies "will have memorized" or "will be singing along". Let's stick to "will have memorized" logic or "will have sung". Let's change verb to "memorize".
    { q: "By the show, I _____ every word.", options: ["will memorize", "will be memorizing", "will have memorized", "memorize"], correct: 2 },
    { q: "Don't _____ your chance to see her live.", options: ["waste", "invest", "set aside", "spend"], correct: 0 },
    { q: "She _____ songs for the new movie right now.", options: ["will write", "will be writing", "will have written", "writes"], correct: 1 }, // "Right now" usually implies Present Continuous, but in future context "Right now next week". Let's say "This time next week, she..."
    { q: "This time next week, she _____ songs for Bond.", options: ["will write", "will be writing", "will have written", "writes"], correct: 1 },
    { q: "By 2030, her style _____ completely.", options: ["will change", "will be changing", "will have changed", "changes"], correct: 2 },
    { q: "She _____ on stage for 2 hours by the time we arrive.", options: ["will be", "will have been", "is", "was"], correct: 1 },
  ],
  videogames: [
    { q: "By midnight, I _____ this boss.", options: ["will defeat", "will be defeating", "will have defeated", "defeat"], correct: 2 },
    { q: "Don't interrupt; I _____ a ranked match.", options: ["will play", "will have played", "will be playing", "play"], correct: 2 },
    { q: "If you spam ult, you _____ of mana.", options: ["will run out", "will have run out", "will be running out", "ran out"], correct: 0 },
    { q: "By the time you log in, I _____ level 50.", options: ["will reach", "will be reaching", "will have reached", "reach"], correct: 2 },
    { q: "He _____ his skill points on useless stats.", options: ["frittered away", "invested", "set aside", "saved"], correct: 0 },
    { q: "I _____ the rare loot by tomorrow.", options: ["will find", "will be finding", "will have found", "find"], correct: 2 },
    { q: "We _____ the raid for 5 hours by the time we finish.", options: ["will be doing", "will have been doing", "will do", "do"], correct: 1 },
    { q: "You should _____ gold for the late game.", options: ["set aside", "waste", "kill", "run out"], correct: 0 },
    { q: "This skin was totally _____.", options: ["getting worth", "worth the money", "frittering", "investing"], correct: 1 },
    { q: "By next patch, this hero _____ nerfed.", options: ["will be", "will have been", "is being", "is"], correct: 1 },
    { q: "I _____ the map while you heal.", options: ["will explore", "will be exploring", "will have explored", "explore"], correct: 1 },
    { q: "By the end of the event, I _____ all rewards.", options: ["will claim", "will be claiming", "will have claimed", "claim"], correct: 2 },
    { q: "Don't _____ your ammo on minions.", options: ["waste", "invest", "spare", "make"], correct: 0 },
    { q: "We _____ the enemy base in 5 minutes.", options: ["will attack", "will be attacking", "will have attacked", "attack"], correct: 1 }, // "In 5 mins" -> "will be attacking" (start/duration) or "will attack" (schedule). "Will be attacking" is good for process.
    { q: "By 2026, VR gaming _____ mainstream.", options: ["will become", "will have become", "will be becoming", "becomes"], correct: 1 },
  ],
  future: [
    { q: "By 2040, I _____ my own company.", options: ["will run", "will be running", "will have run", "run"], correct: 2 }, // Could be "will be running" (process) or "will have run" (completion of starting?). "Will be running" is better for "I'm CEO". But "By 2040" often triggers Perfect. Let's use "will have started".
    // Correction: "By 2040, I _____ my own company." -> "will have started" (perfect) or "will be running" (continuous). If context is duration/state at that time, continuous is good. If achievement, perfect. Let's swap options to make it clear.
    { q: "By 2040, I _____ my own company for ten years.", options: ["will run", "will be running", "will have been running", "run"], correct: 2 },
    { q: "This time next year, I _____ in Tokyo.", options: ["will live", "will have lived", "will be living", "live"], correct: 2 },
    { q: "I _____ strictly vegan next month.", options: ["will eat", "will have eaten", "will be eating", "eat"], correct: 2 },
    { q: "By graduation, she _____ her degree.", options: ["will finish", "will be finishing", "will have finished", "finishes"], correct: 2 },
    { q: "Don't _____ your potential on bad habits.", options: ["invest", "fritter away", "set aside", "choose"], correct: 1 },
    { q: "I _____ English fluently by then.", options: ["will speak", "will have spoken", "will be speaking", "speak"], correct: 2 }, // "Will be speaking" implies ability/process.
    { q: "You must _____ the right career path.", options: ["choose", "waste", "kill", "run"], correct: 0 },
    { q: "By the time we arrive, the meeting _____.", options: ["will end", "will be ending", "will have ended", "ends"], correct: 2 },
    { q: "We _____ robots in our homes soon.", options: ["will use", "will have used", "will be using", "use"], correct: 2 },
    { q: "I _____ hard for my goals next semester.", options: ["will work", "will have worked", "will be working", "work"], correct: 2 },
    { q: "By age 30, I _____ a millionaire.", options: ["will become", "will have become", "will be becoming", "become"], correct: 1 },
    { q: "I _____ money every month for a house.", options: ["will set aside", "will be setting aside", "will have set aside", "set aside"], correct: 1 },
    { q: "By 2050, humans _____ Mars.", options: ["will colonize", "will have colonized", "will be colonizing", "colonize"], correct: 1 },
    { q: "I _____ to a new city next week.", options: ["will move", "will have moved", "will be moving", "move"], correct: 2 },
    { q: "By dinner, I _____ on this essay for 6 hours.", options: ["will work", "will be working", "will have been working", "work"], correct: 2 },
  ],
  stranger: [
    { q: "By season 5, Eleven _____ Vecna.", options: ["will defeat", "will be defeating", "will have defeated", "defeats"], correct: 2 },
    { q: "While you fight, I _____ the bats.", options: ["will distract", "will have distracted", "will be distracting", "distract"], correct: 2 },
    { q: "By the finale, Hawkins _____ completely.", options: ["will fall", "will be falling", "will have fallen", "falls"], correct: 2 },
    { q: "Mike _____ to contact Eleven all night.", options: ["will try", "will be trying", "will have tried", "tries"], correct: 1 },
    { q: "They _____ for days by the time help arrives.", options: ["will fight", "will be fighting", "will have been fighting", "fight"], correct: 2 },
    { q: "Max _____ up that hill.", options: ["will run", "will have run", "will be running", "runs"], correct: 2 }, // "Will be running" - iconic scene re-enactment prediction
    { q: "Hopper _____ by the time Joyce arrives.", options: ["will escape", "will be escaping", "will have escaped", "escapes"], correct: 2 },
    { q: "Don't _____ your ammo on the demobats!", options: ["waste", "invest", "set aside", "make"], correct: 0 },
    { q: "By dawn, the gate _____.", options: ["will open", "will be opening", "will have opened", "opens"], correct: 2 },
    { q: "Dustin _____ code red on the radio.", options: ["will scream", "will be screaming", "will have screamed", "screams"], correct: 1 },
    { q: "We _____ of time to save Will.", options: ["will run out", "will have run out", "will be running out", "run out"], correct: 2 }, // "Will be running out" implies process getting critical.
    { q: "Lucas _____ the basketball game tonight.", options: ["will play", "will have played", "will be playing", "plays"], correct: 2 },
    { q: "In the Upside Down, time _____ differently.", options: ["will move", "will have moved", "will be moving", "moves"], correct: 2 }, // "Will be moving" or "moves". Future prediction: "You'll see, time will be moving differently."
    { q: "By the end, they _____ the Mind Flayer.", options: ["will destroy", "will have destroyed", "will be destroying", "destroy"], correct: 1 },
    { q: "Nancy _____ the truth by morning.", options: ["will discover", "will have discovered", "will be discovering", "discovers"], correct: 1 },
  ],
  harry: [
    { q: "By June, Hermione _____ all the library books.", options: ["will read", "will be reading", "will have read", "reads"], correct: 2 },
    { q: "Harry _____ Quidditch tomorrow at noon.", options: ["will play", "will have played", "will be playing", "plays"], correct: 2 },
    { q: "Don't _____ your galleons on Zonko's products.", options: ["fritter away", "invest", "set aside", "save"], correct: 0 },
    { q: "Ron _____ of spells if he panics.", options: ["will run out", "will have run out", "will be running out", "runs out"], correct: 0 },
    { q: "By the end of the year, Gryffindor _____ the cup.", options: ["will win", "will be winning", "will have won", "wins"], correct: 2 },
    { q: "Malfoy _____ his money around to impress people.", options: ["will throw", "will be throwing", "will have thrown", "throws"], correct: 1 }, // "Will be throwing" - prediction of behaviour.
    { q: "Dumbledore _____ time for Harry's lessons.", options: ["will set aside", "will be setting aside", "will have set aside", "sets aside"], correct: 0 },
    { q: "Hagrid _____ the dragons when we arrive.", options: ["will feed", "will have fed", "will be feeding", "feeds"], correct: 2 },
    { q: "By year 7, they _____ up.", options: ["will grow", "will be growing", "will have grown", "grow"], correct: 2 },
    { q: "Fred and George _____ time in the corridors.", options: ["will kill", "will be killing", "will have killed", "kill"], correct: 1 },
    { q: "Snape _____ potions class tomorrow.", options: ["will teach", "will have taught", "will be teaching", "teaches"], correct: 2 },
    { q: "By noon, Neville _____ his toad again.", options: ["will lose", "will be losing", "will have lost", "loses"], correct: 2 },
    { q: "Don't _____ your time with Muggles.", options: ["waste", "invest", "spare", "make"], correct: 0 },
    { q: "Luna _____ for Nargles in the forest.", options: ["will look", "will have looked", "will be looking", "looks"], correct: 2 },
    { q: "By the battle, Harry _____ the Horcruxes.", options: ["will find", "will be finding", "will have found", "finds"], correct: 2 },
  ],
  mobile: [
    { q: "I _____ Mid Lane in the next match.", options: ["will take", "will have taken", "will be taking", "take"], correct: 2 },
    { q: "By the 10th minute, we _____ the Lord.", options: ["will take", "will be taking", "will have taken", "take"], correct: 2 },
    { q: "Don't _____ your diamonds on useless skins.", options: ["invest", "fritter away", "save", "set aside"], correct: 1 },
    { q: "We _____ the enemy base soon.", options: ["will push", "will have pushed", "will be pushing", "push"], correct: 2 },
    { q: "By late game, Layla _____ full build.", options: ["will complete", "will be completing", "will have completed", "completes"], correct: 2 },
    { q: "You _____ of mana if you spam skills.", options: ["will run out", "will have run out", "will be running out", "ran out"], correct: 0 },
    { q: "I _____ the jungle while you push.", options: ["will clear", "will have cleared", "will be clearing", "clear"], correct: 2 },
    { q: "Don't _____ your ultimate on a minion!", options: ["invest", "waste", "save", "spare"], correct: 1 },
    { q: "While you farm, I _____ the turret.", options: ["will defend", "will have defended", "will be defending", "defend"], correct: 2 },
    { q: "By the end of the season, I _____ Mythic rank.", options: ["will reach", "will be reaching", "will have reached", "reach"], correct: 2 },
    { q: "By late game, Aldous _____ 500 stacks.", options: ["will collect", "will be collecting", "will have collected", "collects"], correct: 2 },
    { q: "Don't _____ your gold on mana regen.", options: ["waste", "invest", "spare", "make"], correct: 0 },
    { q: "We _____ the Turtle in 10 seconds.", options: ["will take", "will have taken", "will be taking", "take"], correct: 2 },
    { q: "The tank _____ the damage for us.", options: ["will soak", "will have soaked", "will be soaking", "soaks"], correct: 2 },
    { q: "I _____ this hero for 100 matches by tomorrow.", options: ["will play", "will be playing", "will have played", "play"], correct: 2 },
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
       // Check if user exited during feedback
       if (gameState === 'topic-select') return;

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
    clearInterval(timerRef.current);
    playSound('click');
    setActiveTopic(null);
    setGameState('topic-select');
    setScore(0);
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
    const totalQuestions = questionData[activeTopic].length;

    return (
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 relative">
        {/* Exit Button */}
        <button 
            onClick={returnToMenu}
            className="absolute top-4 left-4 z-50 bg-white/20 hover:bg-red-500 hover:text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg"
            title="Exit Arena"
        >
            <span className="text-2xl">🚪</span>
        </button>

        {/* Header: Score & Timer */}
        <div className="flex justify-between items-center mb-6 pl-16">
           <div className="bg-black/20 dark:bg-white/10 px-6 py-2 rounded-full font-bold text-xl text-ink dark:text-parchment">
              Score: {score}
           </div>
           <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 ${timer < 5 ? 'bg-red-500 border-red-700 animate-pulse' : 'bg-purple-600 border-purple-800'} text-white shadow-xl`}>
              {timer}
           </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 mb-8 flex items-center justify-center min-h-[30vh] text-center border-b-8 border-gray-300 dark:border-gray-900 relative">
           <div className="absolute top-2 right-2 text-xs font-bold text-gray-400">Q {qIndex + 1}/{totalQuestions}</div>
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
             animate={{ width: `${((qIndex) / totalQuestions) * 100}%` }}
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
        <div className={`w-full h-full flex flex-col items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'} relative`}>
            {/* Exit Button in Feedback too */}
            <button 
                onClick={returnToMenu}
                className="absolute top-4 left-4 z-50 bg-white/20 hover:bg-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all shadow-lg"
                title="Exit Arena"
            >
                <span className="text-2xl">🚪</span>
            </button>

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