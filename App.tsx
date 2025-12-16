import React, { useState, useEffect, PropsWithChildren, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import AssetSorter from './components/AssetSorter';
import TimelineGrammar from './components/TimelineGrammar';
import NeuralCalibration from './components/NeuralCalibration';
import TimeCapsule from './components/TimeCapsule';
import PangeaSim from './components/PangeaSim';
import Menu from './components/Menu';
import CelebrationScreen from './components/CelebrationScreen';
import KahootQuiz from './components/KahootQuiz';

/**
 * --- QUANTUM RESPONSIVE LAYOUT ENGINE V3.0 ---
 * Ultra-precise, device-agnostic scaling algorithm.
 * Adapts to: 4K Projectors, Smart Boards (4:3), Ultrawide Monitors,
 * iPhones (SE to Max), iPads, and Laptops.
 */
const useQuantumResponsiveLayout = () => {
  // Use a ref to store the ResizeObserver so we can disconnect it later
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const calibrate = () => {
      // 1. Get exact hardware dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      // 2. Define Ideal Reference Frames
      const REF_DESKTOP = { w: 1920, h: 1080 }; // Standard 1080p
      const REF_MOBILE = { w: 390, h: 844 };   // Modern iPhone Base

      let scaleFactor = 1;
      let baseFontSize = 16;
      let layoutMode = 'desktop';

      // 3. The Algorithm
      if (width > height) {
        // --- LANDSCAPE MODE (Desktop, Laptop, Projector, Smart Board) ---
        layoutMode = 'landscape';
        
        // Calculate scale based on both dimensions to ensure "Contain" fit
        const scaleW = width / REF_DESKTOP.w;
        const scaleH = height / REF_DESKTOP.h;
        
        // Use the smaller scale to prevent cutting off content
        scaleFactor = Math.min(scaleW, scaleH);

        // A. Smart Board / Projector Correction (4:3 Aspect Ratio)
        // These screens are "taller" relative to width than 16:9.
        if (aspect < 1.6) { 
           // Slightly reduce scale to create breathing room on sides
           scaleFactor *= 0.95; 
        }

        // B. 4K/Retina Projector Boost
        // If pixels are dense, boost slightly for legibility at distance
        if (width > 2500) {
            scaleFactor *= 1.15; 
        }

        // Base calculation: 1920x1080 -> 18px base font
        baseFontSize = 18 * scaleFactor;

      } else {
        // --- PORTRAIT MODE (Phone, Tablet) ---
        layoutMode = 'portrait';

        const scaleW = width / REF_MOBILE.w;
        
        // iPad / Tablet Correction
        // Tablets have aspect ratios closer to 3:4 (0.75) vs Phones (0.45)
        if (aspect > 0.6) {
             // It's a tablet. Scale is usually too aggressive based on width alone.
             // Dampen the scale factor.
             scaleFactor = scaleW * 0.85;
        } else {
             // It's a phone. Scale linearly with width.
             scaleFactor = scaleW;
        }

        // iPhone SE (Tiny Screen) Protection
        if (width < 350) {
            scaleFactor = Math.max(scaleFactor, 0.85); // Floor it so text doesn't vanish
        }

        baseFontSize = 16 * scaleFactor;
      }

      // 4. Clamping & Precision Rounding
      // We limit font size range to prevent absurdity (e.g. 200px text on 8K)
      const clampedFontSize = Math.max(12, Math.min(100, baseFontSize));
      
      // 5. Apply to DOM
      const doc = document.documentElement;
      
      // Font Size drives 'rem' units
      doc.style.fontSize = `${clampedFontSize.toFixed(2)}px`;
      
      // CSS Variables for fine-tuning in components
      doc.style.setProperty('--app-scale', scaleFactor.toFixed(3));
      doc.style.setProperty('--app-width', `${width}px`);
      doc.style.setProperty('--app-height', `${height}px`);
      
      // The "Mobile Address Bar" Fix: calculates true 1vh
      doc.style.setProperty('--vh', `${height * 0.01}px`);
    };

    // 6. Observation Strategy
    // ResizeObserver is more performant and accurate than window.resize
    observerRef.current = new ResizeObserver(() => {
        // Debounce slightly with RequestAnimationFrame for smooth resizing
        window.requestAnimationFrame(calibrate);
    });

    observerRef.current.observe(document.body);
    
    // Initial Call
    calibrate();

    // Also listen to orientation change specifically for iOS
    window.addEventListener('orientationchange', calibrate);

    return () => {
        if (observerRef.current) observerRef.current.disconnect();
        window.removeEventListener('orientationchange', calibrate);
    };
  }, []);
};


const pageVariants = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.05, filter: "blur(5px)", transition: { duration: 0.3, ease: "easeIn" } }
};

const ViewWrapper = ({ children, k }: PropsWithChildren<{ k: string }>) => (
    <motion.div 
        key={k} 
        variants={pageVariants} 
        initial="initial" 
        animate="animate" 
        exit="exit" 
        className="absolute inset-0 w-full h-full overflow-hidden flex flex-col"
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }} // Applies the fix
    >
        {children}
    </motion.div>
);

const App = () => {
  // Initialize the Quantum Algorithm
  useQuantumResponsiveLayout();

  const [currentView, setCurrentView] = useState('home');
  const [lifeExpectancy, setLifeExpectancy] = useState(40); 
  const [darkMode, setDarkMode] = useState(true);
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ badge: '', title: '', subtitle: '', nextView: '' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const updateLife = (years: number) => {
    setLifeExpectancy(prev => Math.max(0, Math.min(100, prev + years)));
  };

  const handleLevelComplete = (nextViewId: string, customScore?: number) => {
    let data = { badge: '✨', title: 'Complete', subtitle: 'You have advanced.', nextView: nextViewId };

    switch(currentView) {
        case 'diagnostic':
            let title = "Novice Apprentice";
            let sub = "Dangerous instability detected.";
            let badge = "⚡";
            
            if (customScore !== undefined) {
               if (customScore >= 5) {
                   title = "Grand Archmage";
                   sub = "Your mastery of time is absolute.";
                   badge = "🧙‍♂️";
               } else if (customScore >= 3) {
                   title = "Chrono-Adept";
                   sub = "The talent is there, but training is required.";
                   badge = "🔮";
               }
            }
            data = { badge, title, subtitle: sub, nextView: nextViewId };
            break;
        case 'sorter':
            data = { badge: '🃏', title: 'Fate Sorted', subtitle: 'Wisdom distinguishes investment from folly.', nextView: nextViewId };
            break;
        case 'timeline':
            data = { badge: '📜', title: 'Scrolls Mastered', subtitle: 'The flow of time bends to your will.', nextView: nextViewId };
            break;
        case 'pangea':
            data = { badge: '🌍', title: 'Realms United', subtitle: 'You have healed the fractured world.', nextView: nextViewId };
            break;
        case 'neural':
            data = { badge: '🧠', title: 'Mind Sharp', subtitle: 'Your intellect rivals the Archmages.', nextView: nextViewId };
            break;
        case 'capsule':
            data = { badge: '🖋️', title: 'Legacy Sealed', subtitle: 'Your prophecy is written in the stars.', nextView: nextViewId };
            break;
        case 'kahoot':
            data = { badge: '🏆', title: 'Arena Champion', subtitle: 'You have proven your worth in combat.', nextView: nextViewId };
            break;
        default:
            break;
    }

    setCelebrationData(data);
    setShowCelebration(true);
  };

  const advanceLevel = () => {
      setShowCelebration(false);
      setCurrentView(celebrationData.nextView);
  };

  const renderContent = () => {
    if (showCelebration) {
        return (
            <motion.div 
                key="celebration" 
                variants={pageVariants} 
                initial="initial" 
                animate="animate" 
                exit="exit" 
                className="absolute inset-0 z-20" 
            >
                <CelebrationScreen 
                    badge={celebrationData.badge}
                    title={celebrationData.title}
                    subtitle={celebrationData.subtitle}
                    onNext={advanceLevel}
                />
            </motion.div>
        );
    }

    switch(currentView) {
      case 'home':
        return (
          <ViewWrapper k="home">
              <div className="flex flex-col items-center justify-center h-full text-center p-4 relative">
                <div className="flex flex-col items-center justify-center flex-1">
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-ink dark:text-parchment mb-6 drop-shadow-lg leading-tight">
                        The Chronomancer's<br/>Codex
                    </h1>
                    <p className="font-body text-2xl italic text-ink/80 dark:text-parchment/80 max-w-md mx-auto mb-10">
                    "Time is the currency of the soul.<br/>Spend it wisely, Apprentice."
                    </p>
                    <div className="w-24 h-24 border-4 border-magic-gold rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-4xl">⏳</span>
                    </div>
                </div>
                
                <button 
                    onClick={() => handleLevelComplete('diagnostic')}
                    className="absolute bottom-10 left-10 px-8 py-3 bg-ink dark:bg-magic-gold text-parchment dark:text-ink font-display font-bold text-xl rounded-sm hover:scale-105 transition-transform"
                >
                    OPEN THE GRIMOIRE
                </button>
              </div>
          </ViewWrapper>
        );
      case 'diagnostic':
        return (
            <ViewWrapper k="diagnostic">
                <Landing onComplete={(score) => handleLevelComplete('sorter', score)} updateLife={updateLife} />
            </ViewWrapper>
        );
      case 'sorter':
        return (
            <ViewWrapper k="sorter">
                <AssetSorter onComplete={() => handleLevelComplete('timeline')} updateLife={updateLife} />
            </ViewWrapper>
        );
      case 'timeline':
        return (
            <ViewWrapper k="timeline">
                <TimelineGrammar onComplete={() => handleLevelComplete('pangea')} />
            </ViewWrapper>
        );
      case 'pangea':
        return (
            <ViewWrapper k="pangea">
                <PangeaSim onComplete={() => handleLevelComplete('neural')} />
            </ViewWrapper>
        );
      case 'neural':
        return (
            <ViewWrapper k="neural">
                <NeuralCalibration onComplete={() => handleLevelComplete('capsule')} updateLife={updateLife} />
            </ViewWrapper>
        );
      case 'capsule':
        return (
            <ViewWrapper k="capsule">
                <TimeCapsule lifeExpectancy={lifeExpectancy} onComplete={() => handleLevelComplete('kahoot')} />
            </ViewWrapper>
        );
      case 'kahoot':
        return (
            <ViewWrapper k="kahoot">
                <KahootQuiz onComplete={() => handleLevelComplete('home')} updateLife={updateLife} />
            </ViewWrapper>
        );
      default:
        return (
            <ViewWrapper k="error">
                <div className="flex items-center justify-center h-full text-crimson">
                    Unknown Temporal State
                </div>
            </ViewWrapper>
        );
    }
  };

  return (
    <main 
      className={`relative w-full overflow-hidden transition-colors duration-500 font-body
      ${darkMode ? 'bg-obsidian text-parchment' : 'bg-parchment text-ink'}
      bg-paper-texture dark:bg-leather-texture`}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }} // Enforce true viewport height
    >
      
      <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <Menu currentView={currentView} setView={setCurrentView} darkMode={darkMode} toggleTheme={toggleTheme} />

      <div className="relative w-full h-full z-10">
         <AnimatePresence mode="wait">
            {renderContent()}
         </AnimatePresence>
      </div>

      {currentView !== 'home' && !showCelebration && (
        <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
             <div className="text-xs font-rune text-ink/60 dark:text-parchment/60 uppercase mb-1">Sands of Time</div>
             <motion.div 
               key={lifeExpectancy}
               initial={{ scale: 1.2 }}
               animate={{ 
                 scale: 1, 
                 color: lifeExpectancy < 20 ? '#8a0303' : '#d4af37' 
               }}
               className="text-4xl font-display font-bold drop-shadow-md bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
             >
                {lifeExpectancy} Yrs
             </motion.div>
        </div>
      )}
    </main>
  );
};

export default App;