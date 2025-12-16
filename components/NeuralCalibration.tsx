import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralProps {
  onComplete: () => void;
}

const questions = [
  { q: "This time next week, I _____ on a beach in Dubai.", options: ["will lie", "will have lain", "will be lying", "am lying"], a: 2 },
  { q: "By 2030, scientists _____ a cure for the common cold.", options: ["will be finding", "will have found", "find", "are finding"], a: 1 },
  { q: "Don't phone me between 7 and 8. We _____ dinner.", options: ["will have had", "have", "will be having", "had"], a: 2 },
  { q: "By the time you get home, the kids _____ to sleep.", options: ["will have gone", "will be going", "go", "are going"], a: 0 },
  { q: "At 10 o'clock tomorrow, she _____ in her office.", options: ["will have worked", "will be working", "worked", "works"], a: 1 },
  { q: "I _____ all my exams by June 15th.", options: ["will be finishing", "will have finished", "finish", "am finishing"], a: 1 },
  { q: "In fifty years, people _____ on Mars.", options: ["will be living", "will have lived", "live", "lived"], a: 0 },
  { q: "By the end of this lesson, you _____ at least 5 new words.", options: ["will be learning", "will have learned", "learn", "are learning"], a: 1 },
  { q: "Will you _____ using the computer for long?", options: ["be", "have", "do", "are"], a: 0 },
  { q: "By next year, he _____ saved enough money for a car.", options: ["will be", "will have", "is", "was"], a: 1 },
  { q: "Tomorrow afternoon we _____ tennis.", options: ["will be playing", "will have played", "play", "played"], a: 0 },
  { q: "By the time the police arrive, the thief _____.", options: ["will be escaping", "will have escaped", "escapes", "is escaping"], a: 1 },
  { q: "Everyone _____ for you when you arrive at the station.", options: ["will have waited", "will be waiting", "waits", "waited"], a: 1 },
  { q: "Come visit us! We _____ anything important.", options: ["won't be doing", "won't have done", "don't do", "haven't done"], a: 0 },
  { q: "By Friday, I _____ this book.", options: ["will be reading", "will have read", "read", "am reading"], a: 1 },
  { q: "_____ (you) retired by the time you are 60?", options: ["Will you be retiring", "Will you have retired", "Do you retire", "Are you retiring"], a: 1 },
  { q: "In the future, robots _____ many human jobs.", options: ["will be doing", "will have done", "do", "did"], a: 0 },
  { q: "By 2050, the world population _____ to 9 billion.", options: ["will be growing", "will have grown", "grows", "grew"], a: 1 },
  { q: "We _____ the project by the deadline. It's impossible.", options: ["won't be finishing", "won't have finished", "don't finish", "didn't finish"], a: 1 },
  { q: "Look at the traffic! We _____ late.", options: ["are going to be", "will have been", "will be being", "be"], a: 0 },
  { q: "What _____ (you) at this time tomorrow?", options: ["will you have done", "will you be doing", "do you do", "did you do"], a: 1 },
  { q: "I _____ the report before the meeting starts.", options: ["will have typed", "will be typing", "type", "am typing"], a: 0 },
  { q: "Next month, they _____ for 25 years.", options: ["will be married", "will have been married", "are married", "marry"], a: 1 },
  { q: "Don't worry, I _____ everything by the time you wake up.", options: ["will have fixed", "will be fixing", "fix", "fixed"], a: 0 },
  { q: "At midnight on New Year's Eve, people _____ fireworks.", options: ["will have watched", "will be watching", "watch", "watched"], a: 1 },
];

const NeuralCalibration: React.FC<NeuralProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === questions[index].a;
    if (isCorrect) {
        setScore(prev => prev + 1);
    } else {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 500);
    }

    if (index + 1 < questions.length) {
        setIndex(prev => prev + 1);
    } else {
        setShowResult(true);
    }
  };

  if (showResult) {
      return (
        <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-mono">
            <h1 className="text-4xl text-neon-green mb-4">CALIBRATION COMPLETE</h1>
            <p className="text-white text-xl mb-8">SCORE: {score} / 25</p>
            <button onClick={onComplete} className="px-8 py-4 bg-white text-black font-bold rounded hover:scale-105 transition-transform">
                PROCEED TO CAPSULE
            </button>
        </div>
      );
  }

  return (
    <div className={`h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-mono relative overflow-hidden ${glitch ? 'animate-glitch' : ''}`}>
      
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-90" />
      
      <div className="z-10 w-full max-w-3xl px-6">
          <div className="flex justify-between items-center mb-12 text-neon-cyan text-xs tracking-widest">
              <span>NEURAL LINK: ACTIVE</span>
              <span>BUFFER: {index + 1} / 25</span>
          </div>

          <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                  <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 leading-snug">
                      {questions[index].q.split("_____").map((part, i) => (
                          <React.Fragment key={i}>
                              {part}
                              {i === 0 && <span className="inline-block w-24 border-b-2 border-neon-cyan mx-2"></span>}
                          </React.Fragment>
                      ))}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[index].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="bg-slate-900/50 border border-slate-700 hover:border-neon-cyan hover:bg-neon-cyan/10 p-4 text-left rounded transition-all text-sm md:text-base group"
                          >
                              <span className="text-slate-500 mr-2 group-hover:text-neon-cyan">{String.fromCharCode(65 + i)}</span>
                              {opt}
                          </button>
                      ))}
                  </div>
              </motion.div>
          </AnimatePresence>
      </div>

      {glitch && (
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center">
              <span className="text-red-500 font-black text-9xl opacity-20">ERROR</span>
          </div>
      )}
    </div>
  );
};

export default NeuralCalibration;