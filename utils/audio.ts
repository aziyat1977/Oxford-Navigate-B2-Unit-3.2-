let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const playSound = (type: 'success' | 'error' | 'click' | 'hover' | 'swipe' | 'tick') => {
  const ctx = getContext();
  if (!ctx) return;
  
  // Try to resume if suspended (though usually needs user gesture event)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch (type) {
    case 'success':
      // Magical Major Arpeggio (C -> E -> G -> C)
      const successOsc2 = ctx.createOscillator();
      const successGain2 = ctx.createGain();
      successOsc2.connect(successGain2);
      successGain2.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.linearRampToValueAtTime(659.25, now + 0.1); // E5
      
      successOsc2.type = 'triangle';
      successOsc2.frequency.setValueAtTime(783.99, now + 0.1); // G5
      successOsc2.frequency.linearRampToValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      
      successGain2.gain.setValueAtTime(0, now);
      successGain2.gain.linearRampToValueAtTime(0.1, now + 0.1);
      successGain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.start(now);
      osc.stop(now + 1.0);
      successOsc2.start(now);
      successOsc2.stop(now + 1.2);
      break;

    case 'error':
      // Discordant 'Thud'
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
      break;

    case 'click':
      // Parchment/Ink Sound (High tick)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'hover':
      // Very subtle magical shimmer
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'swipe':
      // Card friction (Noise-like FM)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.2);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
      break;
      
    case 'tick':
      // Clock tick
      osc.type = 'square';
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
  }
};