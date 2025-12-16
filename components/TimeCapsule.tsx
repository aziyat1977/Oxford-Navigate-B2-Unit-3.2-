import React, { useState } from 'react';
import { analyzeManifesto } from '../services/geminiService';
import { motion } from 'framer-motion';

const TimeCapsule = () => {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;
    setLoading(true);
    setFeedback("");
    
    // Call Gemini API
    const result = await analyzeManifesto(text);
    setLoading(false);
    setFeedback(result);
    
    // Simple check to "Lock" if feedback is positive
    if (result.toLowerCase().includes("billionaire") || result.toLowerCase().includes("upgrade complete")) {
      setLocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=10')] opacity-20 bg-cover bg-center" />
      
      <div className="max-w-3xl w-full z-10 grid gap-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2 tracking-tighter">
            LIFE IN <span className="text-neon-pink">2040</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm max-w-xl mx-auto">
            Describe your future. Draw it in your mind, then write it down.
          </p>
        </div>

        {/* Requirements Box */}
        <div className="bg-slate-900/80 border border-slate-700 p-4 rounded text-xs font-mono text-neon-green">
            <h3 className="font-bold mb-2 text-white">MISSION PARAMETERS:</h3>
            <ul className="list-disc pl-4 space-y-1">
                <li>Sentence 1: <span className="text-white">In 2040, I will be working...</span> (Future Continuous)</li>
                <li>Sentence 2: <span className="text-white">I will be living...</span> (Future Continuous)</li>
                <li>Sentence 3: <span className="text-white">By 2040, I will have bought...</span> (Future Perfect)</li>
                <li>Vocab: Use <span className="text-white">"Invest time"</span> or <span className="text-white">"Fritter away"</span>.</li>
            </ul>
        </div>

        {/* Terminal Input */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl relative">
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
             <div className="w-3 h-3 rounded-full bg-red-500" />
             <div className="w-3 h-3 rounded-full bg-yellow-500" />
             <div className="w-3 h-3 rounded-full bg-green-500" />
             <span className="ml-auto text-xs text-slate-400 font-mono">CONNECTION: SECURE</span>
          </div>
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || locked}
            placeholder="In 2040, I will be working as a cyber-security expert..."
            className="w-full h-48 bg-black text-neon-green p-6 font-mono text-lg focus:outline-none resize-none"
          />
          
          <div className="p-4 bg-slate-900 flex justify-end">
             <button 
                onClick={handleSubmit}
                disabled={loading || locked}
                className={`font-display font-bold px-8 py-2 rounded text-black transition-all ${locked ? 'bg-gray-500 cursor-not-allowed' : 'bg-neon-green hover:bg-white hover:shadow-[0_0_15px_#fff]'}`}
             >
                {loading ? "AUDITING..." : locked ? "CAPSULE SEALED" : "TRANSMIT"}
             </button>
          </div>
        </div>

        {/* AI Feedback Area */}
        {(feedback || loading) && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-black border border-neon-cyan p-6 rounded-lg relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 bg-neon-cyan text-black text-xs font-bold px-2 py-1">
                 AUDIT REPORT
              </div>
              
              {loading ? (
                <div className="flex gap-1 items-center h-12">
                   <span className="w-2 h-2 bg-neon-cyan animate-bounce" />
                   <span className="w-2 h-2 bg-neon-cyan animate-bounce delay-75" />
                   <span className="w-2 h-2 bg-neon-cyan animate-bounce delay-150" />
                </div>
              ) : (
                <div className="mt-4 font-mono text-white leading-relaxed">
                   <span className="text-neon-cyan mr-2">ALGORITHM:</span>
                   {feedback}
                </div>
              )}
           </motion.div>
        )}
        
        {locked && (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mt-8"
            >
                <div className="w-32 h-32 rounded-full mx-auto border-4 border-neon-green mb-4 flex items-center justify-center bg-slate-900">
                    <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-neon-green font-display text-xl">TIME CAPSULE LOCKED.</h3>
                <p className="text-xs text-slate-500 font-mono mt-2">OPENING DATE: OCT 26, 2040</p>
            </motion.div>
        )}

      </div>
    </div>
  );
};

export default TimeCapsule;