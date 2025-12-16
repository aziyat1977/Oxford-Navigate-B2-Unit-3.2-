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
  const p1Scale = useTransform(smoothProgress, [0.1, 0.4], [0.9, 1.1]);
  
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
            <span className="text-xs text-neon-cyan font-bold">8:00 PM (ACTION IN PROGRESS)</span>
            <span className="text-xs text-slate-600">...</span>
            <span className="text-xs text-neon-pink font-bold">2030 (ACTION COMPLETED)</span>
            <span className="text-xs text-slate-600">2040</span>
        </motion.div>

        {/* SCENE 1: FUTURE CONTINUOUS (Meaning/Form) */}
        <motion.div 
            style={{ opacity: p1Opacity, scale: p1Scale }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
             <div className="bg-black/90 border border-neon-cyan p-8 max-w-2xl backdrop-blur-md rounded-xl text-center shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                <div className="text-neon-cyan text-6xl mb-4 mx-auto w-fit">▶️</div>
                <h2 className="text-3xl font-display font-bold mb-2 text-white">FUTURE CONTINUOUS</h2>
                
                <div className="grid grid-cols-2 gap-8 text-left my-6">
                    <div>
                        <h4 className="text-xs text-slate-500 mb-1">MEANING</h4>
                        <p className="text-sm">Action in progress at a specific moment.</p>
                        <p className="text-xs text-slate-400 mt-2">"Imagine a video playing."</p>
                    </div>
                    <div>
                        <h4 className="text-xs text-slate-500 mb-1">FORM</h4>
                        <p className="text-sm font-bold text-neon-cyan">will be + verb-ing</p>
                        <p className="text-xs text-slate-400 mt-2">I will be working.</p>
                    </div>
                </div>

                <p className="text-xl mb-2 text-white italic">
                    "Don't call at 8:00. I <span className="text-neon-cyan font-bold">will be watching</span> the match."
                </p>
             </div>
        </motion.div>

        {/* SCENE 2: FUTURE PERFECT (Meaning/Form) */}
        <motion.div 
            style={{ opacity: p2Opacity, x: p2X }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
             <div className="bg-black/90 border border-neon-pink p-8 max-w-2xl backdrop-blur-md rounded-xl text-center shadow-[0_0_50px_rgba(255,0,85,0.2)]">
                <div className="text-neon-pink text-6xl mb-4 mx-auto w-fit">✅</div>
                <h2 className="text-3xl font-display font-bold mb-2 text-white">FUTURE PERFECT</h2>
                
                <div className="grid grid-cols-2 gap-8 text-left my-6">
                    <div>
                        <h4 className="text-xs text-slate-500 mb-1">MEANING</h4>
                        <p className="text-sm">Action finished before a deadline.</p>
                        <p className="text-xs text-slate-400 mt-2">"Imagine a completed checklist."</p>
                    </div>
                    <div>
                        <h4 className="text-xs text-slate-500 mb-1">FORM</h4>
                        <p className="text-sm font-bold text-neon-pink">will have + past participle</p>
                        <p className="text-xs text-slate-400 mt-2">I will have finished.</p>
                    </div>
                </div>

                <p className="text-xl mb-2 text-white italic">
                    "By 2030, we <span className="text-neon-pink font-bold">will have found</span> a cure."
                </p>
                <div className="text-xs text-neon-pink mt-4">MARKERS: By... / By the time...</div>
             </div>
        </motion.div>

        {/* Completion Trigger */}
        <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.95, 1], [0, 1]) }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
        >
            <button 
                onClick={onComplete}
                className="bg-white hover:bg-neon-green text-black font-display font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
                START THE BIG TEST
            </button>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 text-[10px]">SCROLL TO DOWNLOAD GRAMMAR</div>

      </div>
    </div>
  );
};

export default TimelineGrammar;