import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface TimelineProps {
  onComplete: () => void;
}

const TimelineGrammar: React.FC<TimelineProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // Animations
  const p1Opacity = useTransform(smoothProgress, [0.1, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
  const p1Scale = useTransform(smoothProgress, [0.1, 0.4], [0.8, 1.1]);
  
  const p2Opacity = useTransform(smoothProgress, [0.6, 0.7, 0.9, 1], [0, 1, 1, 0]);
  const p2X = useTransform(smoothProgress, [0.6, 0.8], [100, 0]);

  return (
    <div ref={containerRef} className="h-[350vh] bg-black relative font-mono text-white">
      
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* The Track */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -translate-y-1/2" />
        <div className="absolute top-1/2 left-4 md:left-20 w-2 h-2 bg-neon-green rounded-full -translate-y-1/2 shadow-[0_0_10px_#00ff99]" />
        
        {/* Moving Background Elements (Parallax) */}
        <motion.div style={{ x: useTransform(smoothProgress, [0, 1], [0, -1000]) }} className="absolute top-1/2 left-20 -translate-y-1/2 flex items-center gap-[80vh] whitespace-nowrap opacity-50">
            <span className="text-xs text-slate-600">2024</span>
            <span className="text-xs text-slate-600">2026</span>
            <span className="text-xs text-slate-600">2028</span>
            <span className="text-xs text-neon-cyan font-bold">2030 (IN PROGRESS)</span>
            <span className="text-xs text-slate-600">2032</span>
            <span className="text-xs text-neon-pink font-bold">2035 (DEADLINE)</span>
            <span className="text-xs text-slate-600">2040</span>
        </motion.div>

        {/* SCENE 1: THE PROCESS (Future Continuous) */}
        <motion.div 
            style={{ opacity: p1Opacity, scale: p1Scale }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
             <div className="bg-black/80 border border-neon-cyan p-8 max-w-2xl backdrop-blur-md rounded-xl text-center">
                <div className="text-neon-cyan text-6xl mb-4 mx-auto w-fit">⚙️</div>
                <h2 className="text-3xl font-display font-bold mb-2">THE DRONE VIEW</h2>
                <p className="text-xl mb-6 text-slate-300">
                    "This time next year, he <span className="text-neon-cyan font-bold bg-neon-cyan/10 px-2 rounded">will be coding</span> the network."
                </p>
                <div className="text-xs text-neon-cyan border-t border-slate-700 pt-4">
                    GRAMMAR: FUTURE CONTINUOUS<br/>
                    USE: Actions in progress at a specific future time.
                </div>
             </div>
        </motion.div>

        {/* SCENE 2: THE RESULT (Future Perfect) */}
        <motion.div 
            style={{ opacity: p2Opacity, x: p2X }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
             <div className="bg-black/80 border border-neon-pink p-8 max-w-2xl backdrop-blur-md rounded-xl text-center">
                <div className="text-neon-pink text-6xl mb-4 mx-auto w-fit">🏆</div>
                <h2 className="text-3xl font-display font-bold mb-2">THE TROPHY ROOM</h2>
                <p className="text-xl mb-6 text-slate-300">
                    "By 2035, he <span className="text-neon-pink font-bold bg-neon-pink/10 px-2 rounded">will have finished</span> the code."
                </p>
                <div className="text-xs text-neon-pink border-t border-slate-700 pt-4">
                    GRAMMAR: FUTURE PERFECT<br/>
                    USE: Actions completed before a future deadline.
                </div>
             </div>
        </motion.div>

        {/* Completion Trigger */}
        <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.9, 1], [0, 1]) }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
        >
            <button 
                onClick={onComplete}
                className="bg-white hover:bg-neon-green text-black font-display font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
                ENTER SIMULATION
            </button>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 text-[10px]">SCROLL TO TIME TRAVEL</div>

      </div>
    </div>
  );
};

export default TimelineGrammar;