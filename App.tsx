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
 * --- OMNI-RESOLUTION CALIBRATION ALGORITHM ---
 * A precise hook that mathematically scales the interface to fit ANY display.
 * It treats the viewport as a fixed canvas and adjusts the 'rem' unit 
 * to maintain perfect relative proportions.
 */
const useOmniResolution = () => {
  useEffect(() => {
    const calibrate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Reference Dimensions (The "Ideal" Canvas)
      const desktopBaseW = 1512; // MacBook Pro 14"
      const desktopBaseH = 982;
      const mobileBaseW = 390;   // iPhone 13/14
      
      let scaleFactor = 1;

      if (w < h) {
         // PORTRAIT MODE (Phones / Vertical Tablets)
         // Algorithm: Lock to width to ensure text legibility, but check height to prevent overlaps.
         scaleFactor = w / mobileBaseW;
         
         // Height Correction: If screen is unusually short (e.g. old phones with keyboard up)
         // slightly reduce scale to fit vertical content.
         const minAspect = 1.6; // Minimum height/width ratio expected
         if (h / w < minAspect) {
             scaleFactor *= 0.9;
         }

      } else {
         // LANDSCAPE MODE (Desktops / Projectors / Smart Boards)
         // Algorithm: 'Contain' Fit.
         // We find the limiting dimension to ensure NO SCROLLING is ever needed.
         const widthRatio = w / desktopBaseW;
         const heightRatio = h / desktopBaseH;
         
         // Use the smaller ratio to ensure full fit
         scaleFactor = Math.min(widthRatio, heightRatio);
         
         // Projector Boost: On massive 4k screens, bump it slightly for readability from distance
         if (w > 2500) scaleFactor *= 1.1; 
      }

      // CLAMPING (Safety Protocols)
      // Prevent microscopic text on watches or absurdly huge text on 8K walls
      // Base 1rem = 16px. 
      // Limits: 10px (Tiny) -> 64px (Giant)
      const newRootSize = Math.max(10, Math.min(64, 16 * scaleFactor));
      
      // Apply to Root
      document.documentElement.style.fontSize = `${newRootSize}px`;
      
      // Store Scale for JS logic if needed
      document.documentElement.style.setProperty('--app-scale', `${scaleFactor}`);
    };

    // Active Listeners
    window.addEventListener('resize', calibrate);
    window.addEventListener('orientationchange', () => setTimeout(calibrate, 100)); // Delay for iOS rotation
    calibrate(); // Initial Pulse

    return () => window.removeEventListener('resize', calibrate);
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
  // Initialize the Resolution Algorithm
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