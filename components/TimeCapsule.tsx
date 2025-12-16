import React, { useState } from 'react';
import { analyzeManifesto } from '../services/geminiService';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

interface CapsuleProps {
    lifeExpectancy: number;
    onComplete: () => void;
}

const TimeCapsule: React.FC<CapsuleProps> = ({ lifeExpectancy, onComplete }) => {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;
    playSound('click');
    setLoading(true);
    setFeedback("");
    
    const result = await analyzeManifesto(text);
    setLoading(false);
    setFeedback(result);
    
    if (result.toLowerCase().includes("favor") || result.toLowerCase().includes("bless")) {
      playSound('success');
      setLocked(true);
    } else {
      playSound('error');
    }
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-obsidian flex items-center justify-center p-4 relative font-body transition-colors bg-paper-texture dark:bg-leather-texture">
      
      <div className="max-w-5xl w-full z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
        
        {/* Sidebar Status (Wax Tablet style) */}
        <div className="border-4 border-ink dark:border-magic-gold bg-parchment-dark dark:bg-black p-6 rounded shadow-xl rotate-1">
            <div className="mb-8 text-center">
                <div className="text-xs font-rune text-ink/70 dark:text-parchment/70 mb-2">Sands of Time Remaining</div>
                <div className={`text-5xl font-display font-bold ${lifeExpectancy < 30 ? 'text-crimson' : 'text-emerald-rune'}`}>
                    {lifeExpectancy} Yrs
                </div>
            </div>
            <div className="space-y-4 text-sm text-ink dark:text-parchment italic border-t border-ink/20 pt-4">
                <p>QUEST: <span className="font-bold">The Legacy</span></p>
                <p>ERA: <span className="font-bold">2040 AD</span></p>
                <p>SEAL: <span className="font-bold">Unbroken</span></p>
            </div>
        </div>

        {/* Main Book */}
        <div className="bg-parchment shadow-[0_0_40px_rgba(0,0,0,0.5)] p-10 md:p-16 relative rounded-sm">
            {/* Book Spine Shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent rounded-l-sm pointer-events-none"></div>

            <div className="border-b-2 border-ink pb-4 mb-6">
                <h1 className="text-4xl font-display font-bold text-ink mb-2">
                    The Prophecy of <span className="text-crimson">2040</span>
                </h1>
                <p className="text-sm font-rune text-ink/60">
                    Inscribe your vision. The Oracle watches.
                </p>
            </div>

            {/* Magic Requirements */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-ink/70 mb-6 font-display">
                <div className="flex items-center gap-2"><span className="text-mystic-blue">✦</span> USE FUTURE CONTINUOUS</div>
                <div className="flex items-center gap-2"><span className="text-crimson">✦</span> USE FUTURE PERFECT</div>
                <div className="flex items-center gap-2"><span className="text-emerald-rune">✦</span> USE "INVEST" / "FRITTER"</div>
            </div>

            <div className="relative">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading || locked}
                    placeholder="In the year 2040, I will be casting..."
                    className="w-full h-80 bg-transparent border-none p-0 text-xl text-ink focus:ring-0 resize-none font-body leading-loose placeholder:italic placeholder:text-ink/30"
                    style={{ backgroundImage: 'linear-gradient(transparent, transparent 31px, #ccc 31px)', backgroundSize: '100% 32px', lineHeight: '32px' }}
                />
            </div>
            
            {/* Action Buttons */}
            {!locked ? (
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 mt-8 font-display font-bold text-lg uppercase transition-all border-2 border-ink bg-crimson text-parchment hover:bg-ink hover:text-magic-gold shadow-lg"
                >
                    {loading ? "COMMUNING WITH ORACLE..." : "SEAL PROPHECY"}
                </button>
            ) : (
                <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onComplete}
                    className="w-full py-4 mt-8 font-display font-bold text-lg uppercase transition-all border-2 border-magic-gold bg-magic-gold text-obsidian hover:bg-white hover:text-black shadow-[0_0_20px_gold] animate-pulse"
                >
                    PROCEED TO THE ARENA →
                </motion.button>
            )}

            {/* Oracle Feedback */}
            {(feedback || loading) && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/90 p-6 mt-8 rounded text-center border-4 border-double border-magic-gold shadow-xl"
            >
                <div className="text-xs text-magic-gold mb-2 font-display uppercase tracking-widest">The Oracle Speaks</div>
                {loading ? (
                    <div className="text-2xl animate-pulse">🔮</div>
                ) : (
                    <p className="text-lg text-parchment font-body italic leading-relaxed">"{feedback}"</p>
                )}
            </motion.div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TimeCapsule;