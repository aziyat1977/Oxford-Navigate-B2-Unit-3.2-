import React, { useState, useEffect, PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import AssetSorter from './components/AssetSorter';
import TimelineGrammar from './components/TimelineGrammar';
import NeuralCalibration from './components/NeuralCalibration';
import TimeCapsule from './components/TimeCapsule';
import PangeaSim from './components/PangeaSim';
import Menu from './components/Menu';
import CelebrationScreen from './components/CelebrationScreen';

/**
 * --- OMNI-RESOLUTION CALIBRATION ALGORITHM V2 (ULTRA-PRECISION) ---
 * 
 * Mathematical Core:
 * This hook uses a ResizeObserver to monitor the exact pixel dimensions of the viewport.
 * It calculates a 'Scale Multiplier' by comparing the device's available space against
 * a 'Canonical Design Reference' (1600x900 for Landscape, 390x844 for Portrait).
 * 
 * The algorithm applies a "Contain" strategy:
 * Scale = Math.min(AvailableWidth / RefWidth, AvailableHeight / RefHeight)
 * 
 * This guarantees:
 * 1. ZERO SCROLLING: The app fits exactly within the bezels.
 * 2. UNIFORM DENSITY: Text and UI elements maintain visual weight across 4K and Mobile.
 */
const useOmniResolution = () => {
  useEffect(() => {
    const setScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = w / h;

      // Canonical References (The "Ideal" Canvas)
      const DESKTOP_REF = { w: 1600, h: 900 };
      const MOBILE_REF = { w: 390, h: 844 };
      
      let scale;
      let baseSize = 16; // Base REM size in pixels

      if (aspect > 1) {
         // LANDSCAPE (Desktop, Projector, Tablet Horizontal)
         // Calculate ratios
         const ratioW = w / DESKTOP_REF.w;
         const ratioH = h / DESKTOP_REF.h;
         
         // The 'Limiting Dimension' determines the scale to prevent overflow
         scale = Math.min(ratioW, ratioH);
         
         // Projector/4K Boost: If on a massive screen, we slightly boost legibility
         if (w > 2000) scale *= 1.1;

      } else {
         // PORTRAIT (Phone, Tablet Vertical)
         const ratioW = w / MOBILE_REF.w;
         const ratioH = h / MOBILE_REF.h;
         
         // In portrait, width is usually the constraint, but we must respect height to avoid UI overlap
         scale = Math.min(ratioW, ratioH);
         
         // Ultra-Narrow Correction (e.g. Galaxy Fold folded)
         if (aspect < 0.5) scale *= 0.95; 
      }

      // Clamp limits to preserve readability physics
      // Min: 10px (prevents illegibility on watches)
      // Max: 80px (prevents absurdity on stadium screens, though 4K projectors will use high values)
      const exactFontSize = Math.max(10, Math.min(80, baseSize * scale));

      document.documentElement.style.fontSize = `${exactFontSize}px`;
      document.documentElement.style.setProperty('--app-scale', `${scale}`);
    };

    // ResizeObserver is more precise than window.resize as it fires on sub-pixel layout shifts
    const observer = new ResizeObserver(() => {
       // Wrap in requestAnimationFrame to sync with screen refresh rate
       window.requestAnimationFrame(setScale);
    });

    observer.observe(document.body);
    setScale(); // Initial Fire

    return () => observer.disconnect();
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
    >
        {children}
    </motion.div>
);

const App = () => {
  // Initialize the Ultra-Precision Algorithm
  useOmniResolution();

  const [currentView, setCurrentView] = useState('home');
  const [lifeExpectancy, setLifeExpectancy] = useState(40); 
  const [darkMode, setDarkMode] = useState(true);
  
  // Celebration State
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
    // Define badges based on WHAT level just finished (currentView)
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
                className="absolute inset-0 z-20" // Absolute positioning to ensure overlap handling
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
                <TimeCapsule lifeExpectancy={lifeExpectancy} />
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
    <main className={`relative w-full h-full overflow-hidden transition-colors duration-500 font-body
      ${darkMode ? 'bg-obsidian text-parchment' : 'bg-parchment text-ink'}
      bg-paper-texture dark:bg-leather-texture`}>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <Menu currentView={currentView} setView={setCurrentView} darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
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