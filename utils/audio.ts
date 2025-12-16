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

// Helper: Create a noise buffer for texture sounds (paper sliding, wind)
const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

export const playSound = (type: 'success' | 'error' | 'click' | 'swipe' | 'tick') => {
  const ctx = getContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  switch (type) {
    case 'success':
      // "Crystal Chime": A chord of pure sine waves with long release
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { // C Major 7
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.connect(masterGain);
        // Staggered entry for "strumming" effect
        const start = now + (i * 0.05);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.0); // Long tail
        
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + 2.0);
      });
      break;

    case 'error':
      // "Dull Thud": Low frequency triangle wave, heavily filtered (Book closing sound)
      const errOsc = ctx.createOscillator();
      const errGain = ctx.createGain();
      const errFilter = ctx.createBiquadFilter();
      
      errOsc.type = 'triangle';
      errOsc.frequency.setValueAtTime(80, now);
      errOsc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      
      errFilter.type = 'lowpass';
      errFilter.frequency.setValueAtTime(200, now);
      
      errGain.gain.setValueAtTime(0.5, now);
      errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      errOsc.connect(errFilter);
      errFilter.connect(errGain);
      errGain.connect(masterGain);
      
      errOsc.start(now);
      errOsc.stop(now + 0.3);
      break;

    case 'click':
      // "Quill Scratch" / "Gem Tap": Very high pitch, extremely short sine
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1200, now);
      
      clickGain.gain.setValueAtTime(0, now);
      clickGain.gain.linearRampToValueAtTime(0.05, now + 0.005);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      clickOsc.connect(clickGain);
      clickGain.connect(masterGain);
      
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);
      break;

    case 'swipe':
      // "Parchment Slide": Bandpass filtered noise
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = createNoiseBuffer(ctx);
      const swipeFilter = ctx.createBiquadFilter();
      const swipeGain = ctx.createGain();
      
      swipeFilter.type = 'bandpass';
      swipeFilter.frequency.setValueAtTime(400, now);
      swipeFilter.frequency.linearRampToValueAtTime(800, now + 0.2);
      swipeFilter.Q.value = 1;
      
      swipeGain.gain.setValueAtTime(0.05, now);
      swipeGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      swipeGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      
      noiseSrc.connect(swipeFilter);
      swipeFilter.connect(swipeGain);
      swipeGain.connect(masterGain);
      
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.3);
      break;
      
    case 'tick':
      // "Clockwork / Woodblock": High sine with instant decay
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      
      tickOsc.type = 'sine';
      tickOsc.frequency.setValueAtTime(800, now);
      
      tickGain.gain.setValueAtTime(0.1, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      tickOsc.connect(tickGain);
      tickGain.connect(masterGain);
      
      tickOsc.start(now);
      tickOsc.stop(now + 0.05);
      break;
  }
};