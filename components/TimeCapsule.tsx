import React, { useState } from 'react';
import { analyzeManifesto } from '../services/geminiService';
import { motion } from 'framer-motion';

interface CapsuleProps {
    lifeExpectancy: number;
}

const TimeCapsule: React.FC<CapsuleProps> = ({ lifeExpectancy }) => {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;
    setLoading(true);
    setFeedback("");
    
    const result = await analyzeManifesto(text);
    setLoading(false);
    setFeedback(result);
    
    if (result.toLowerCase().includes("billionaire") || result.toLowerCase().includes("upgrade complete")) {
      setLocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('https://picsum.photos/1920/1080?grayscale&blur=10')] bg-cover bg-center" />
      
      <div className="max-w-4xl w-full z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        
        {/* Sidebar Status */}
        <div className="border-r border-slate-800 pr-8 hidden md:block">
            <div className="mb-8">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Final Projection</div>
                <div className={`text-4xl font-display font-black ${lifeExpectancy < 30 ? 'text-red-500' : 'text-neon-green'}`}>
                    {lifeExpectancy} YRS
                </div>
            </div>
            <div className="space-y-4 text-xs text-slate-400">
                <p>STATUS: <span className="text-white">PENDING SUBMISSION</span></p>
                <p>TARGET DATE: <span className="text-white">OCT 26, 2040</span></p>
                <p>ENCRYPTION: <span className="text-white">AES-256</span></p>
            </div>
        </div>

        {/* Main Terminal */}
        <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    PROJECT <span className="text-neon-pink">2040</span>
                </h1>
                <p className="text-xs text-slate-500 uppercase">
                    Construct your future reality. Grammar syntax must be precise.
                </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-neon-cyan">
                <div className="border border-slate-800 p-2 bg-slate-900/50">REQ: FUTURE CONTINUOUS</div>
                <div className="border border-slate-800 p-2 bg-slate-900/50">REQ: FUTURE PERFECT</div>
                <div className="border border-slate-800 p-2 bg-slate-900/50">REQ: "FRITTER" / "INVEST"</div>
                <div className="border border-slate-800 p-2 bg-slate-900/50">REQ: 50+ WORDS</div>
            </div>

            <div className="relative">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading || locked}
                    placeholder="// Initialize manifesto sequence..."
                    className="w-full h-64 bg-black border border-slate-700 p-6 text-neon-green focus:border-white focus:outline-none resize-none font-mono text-sm leading-relaxed shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600">
                    {text.length} CHARS
                </div>
            </div>
            
            <button 
                onClick={handleSubmit}
                disabled={loading || locked}
                className={`w-full py-4 font-bold tracking-widest text-sm uppercase transition-all ${locked ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-neon-green hover:shadow-[0_0_20px_#00ff99]'}`}
            >
                {loading ? "ANALYZING SYNTAX..." : locked ? "CAPSULE SEALED" : "UPLOAD TO TIMELINE"}
            </button>

            {/* AI Feedback */}
            {(feedback || loading) && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-900 border-l-4 border-neon-cyan p-4 mt-4"
            >
                <div className="text-[10px] text-neon-cyan mb-2 font-bold">SYSTEM AUDIT</div>
                {loading ? (
                    <div className="h-4 w-24 bg-slate-800 animate-pulse rounded"/>
                ) : (
                    <p className="text-sm text-slate-300 leading-relaxed">{feedback}</p>
                )}
            </motion.div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TimeCapsule;