import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PangeaProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    context: "OBSERVATION: Australia is drifting North right now. It won't stop.",
    prompt: "In 2050, Australia ____________ (continue) to move north.",
    answer: "will be continuing",
    hint: "Use Future Continuous for a process in progress.",
    mapState: "drifting"
  },
  {
    id: 2,
    context: "DEADLINE: The crash happens before 2050. It's done by then.",
    prompt: "By 2050, Africa ____________ (collide) with Europe.",
    answer: "will have collided",
    hint: "Use Future Perfect for a completed action before a time.",
    mapState: "crashed"
  }
];

const PangeaSim: React.FC<PangeaProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const currentStep = steps[stepIndex];

  const checkAnswer = () => {
    const cleanInput = input.toLowerCase().trim();
    if (cleanInput === currentStep.answer) {
      setStatus("success");
      setTimeout(() => {
        if (stepIndex + 1 < steps.length) {
            setStepIndex(prev => prev + 1);
            setInput("");
            setStatus("idle");
        } else {
            onComplete();
        }
      }, 2000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 3D Planet Simulation Visual */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 mb-12 flex items-center justify-center">
        {/* Wireframe Globe */}
        <div className={`absolute inset-0 rounded-full border border-slate-700 opacity-50 ${status === 'error' ? 'animate-glitch' : 'animate-[spin_20s_linear_infinite]'}`}>
            {/* Latitude/Longitude Lines mockup using gradients */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent)]"></div>
        </div>

        {/* Continents Logic */}
        {/* Australia */}
        <motion.div 
            className="absolute w-16 h-12 bg-purple-600/60 rounded-full blur-md"
            initial={{ x: 60, y: 60 }}
            animate={currentStep.id === 1 && status === 'success' ? { x: 60, y: 30 } : { x: 60, y: 60 }}
            transition={{ duration: 2 }}
        />
        
        {/* Africa & Europe */}
        <motion.div 
            className="absolute w-24 h-24 bg-emerald-600/60 rounded-full blur-md"
            animate={currentStep.id === 2 && status === 'success' ? { x: -10, y: 0 } : { x: -30, y: 10 }}
            transition={{ duration: 1 }}
        />
         <motion.div 
            className="absolute w-20 h-16 bg-blue-600/60 rounded-full blur-md"
            animate={currentStep.id === 2 && status === 'success' ? { x: -10, y: -40 } : { x: -10, y: -60 }}
            transition={{ duration: 1 }}
        />

        {status === 'success' && (
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute w-full h-full border-4 border-white rounded-full"
            />
        )}
      </div>

      {/* Interface */}
      <div className="z-10 bg-slate-900/80 p-8 rounded-xl border border-slate-700 backdrop-blur-md max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-neon-cyan font-mono text-sm">TIMELINE REPAIR: {stepIndex + 1}/{steps.length}</h2>
        </div>
        
        <p className="text-slate-400 font-mono text-xs mb-2">{currentStep.context}</p>
        
        <p className="text-white text-xl mb-6 font-display leading-relaxed">
             {currentStep.prompt.split("____________").map((part, i) => (
                 <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span className="inline-block w-32 border-b-2 border-slate-500 mx-1"></span>}
                 </React.Fragment>
             ))}
        </p>

        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type the verb form..."
                className={`flex-1 bg-black border-2 rounded px-4 py-3 text-white font-mono focus:outline-none ${status === 'error' ? 'border-red-500' : 'border-slate-600 focus:border-neon-green'}`}
            />
            <button 
                onClick={checkAnswer}
                className="bg-white hover:bg-neon-green text-black font-bold px-6 py-3 rounded transition-colors font-display"
            >
                REPAIR
            </button>
        </div>

        {status === 'error' && (
            <div className="mt-4 text-red-500 font-mono text-sm animate-pulse">
                ERROR: TEMPORAL DISSONANCE. {currentStep.hint}
            </div>
        )}
        {status === 'success' && (
            <div className="mt-4 text-neon-green font-mono text-sm">
                SEQUENCE STABILIZED.
            </div>
        )}
      </div>
    </div>
  );
};

export default PangeaSim;