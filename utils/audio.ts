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

export const playSound = (type: 'success' | 'error' | 'click' | 'swipe' | 'tick' | 'level_complete' | 'grab') => {
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
        const start = now + (i * 0.05);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.0); 
        
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + 2.0);
      });
      break;

    case 'level_complete':
      // "Harp Glissando": A rapid sequence of notes ascending
      const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C Major
      scale.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; // Softer than sine
        osc.frequency.setValueAtTime(freq, now);
        
        gain.connect(masterGain);
        const start = now + (i * 0.1); // Slow strum
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.5);
        
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + 1.5);
      });
      break;

    case 'error':
      const errOsc = ctx.createOscillator();
      const errGain = ctx.createGain();
      const errFilter = ctx.createBiquadFilter();
      
      errOsc.type = 'triangle'; // Triangle is softer than sawtooth
      errOsc.frequency.setValueAtTime(150, now); // Lower pitch
      errOsc.frequency.exponentialRampToValueAtTime(50, now + 0.3); // Pitch drop
      
      errFilter.type = 'lowpass';
      errFilter.frequency.setValueAtTime(300, now);
      
      errGain.gain.setValueAtTime(0.2, now); // Lower volume
      errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      errOsc.connect(errFilter);
      errFilter.connect(errGain);
      errGain.connect(masterGain);
      
      errOsc.start(now);
      errOsc.stop(now + 0.3);
      break;

    case 'click':
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

    case 'grab':
      // Short high pitch blip for grabbing
      const grabOsc = ctx.createOscillator();
      const grabGain = ctx.createGain();
      
      grabOsc.type = 'sine';
      grabOsc.frequency.setValueAtTime(800, now);
      grabOsc.frequency.linearRampToValueAtTime(1200, now + 0.05);
      
      grabGain.gain.setValueAtTime(0, now);
      grabGain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      grabGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      grabOsc.connect(grabGain);
      grabGain.connect(masterGain);
      
      grabOsc.start(now);
      grabOsc.stop(now + 0.1);
      break;

    case 'swipe':
      // "Magical Pop" - A quick sine sweep + noise burst
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(400, now);
      popOsc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      
      popGain.gain.setValueAtTime(0.2, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      popOsc.connect(popGain);
      popGain.connect(masterGain);
      popOsc.start(now);
      popOsc.stop(now + 0.15);
      
      // Add a little snap texture
      const snapSrc = ctx.createBufferSource();
      snapSrc.buffer = createNoiseBuffer(ctx);
      const snapFilter = ctx.createBiquadFilter();
      const snapGain = ctx.createGain();
      
      snapFilter.type = 'highpass';
      snapFilter.frequency.value = 1000;
      
      snapGain.gain.setValueAtTime(0.1, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      snapSrc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(masterGain);
      snapSrc.start(now);
      snapSrc.stop(now + 0.05);
      break;
      
    case 'tick':
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