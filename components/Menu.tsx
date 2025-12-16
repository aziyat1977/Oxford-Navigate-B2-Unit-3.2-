import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface MenuProps {
  currentView: string;
  setView: (view: string) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const menuItems = [
  { id: 'home', label: 'I. The Grand Hall' },
  { id: 'diagnostic', label: 'II. Attunement Ritual' },
  { id: 'sorter', label: 'III. The Tarot of Fate' },
  { id: 'timeline', label: 'IV. Prophecy Scrolls' },
  { id: 'neural', label: 'V. Trial of Wits' },
  { id: 'capsule', label: 'VI. Inscribe Legacy' },
];

const Menu: React.FC<MenuProps> = ({ currentView, setView, darkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    playSound('click');
    setIsOpen(!isOpen);
  };

  const handleNav = (id: string) => {
    playSound('click');
    setView(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Bar - Wax Seal Button */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 md:p-6 pointer-events-none">
        
        {/* The Wax Seal (Menu Button) */}
        <button 
          onClick={toggleMenu}
          className="pointer-events-auto bg-crimson border-4 border-double border-magic-gold text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
        >
           <span className="font-display font-bold text-xl">{isOpen ? 'X' : 'M'}</span>
        </button>

        {/* Theme Toggle (Sun/Moon Amulet) */}
        <button 
          onClick={() => { playSound('click'); toggleTheme(); }}
          className="pointer-events-auto bg-ink dark:bg-parchment text-parchment dark:text-ink w-12 h-12 rounded-full border-2 border-magic-gold flex items-center justify-center shadow-[0_0_15px_#d4af37]"
        >
          {darkMode ? '☀' : '☾'}
        </button>
      </div>

      {/* Full Screen Spellbook Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
             {/* The Book Page */}
             <div className="bg-parchment dark:bg-obsidian w-full max-w-lg h-[80vh] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border-8 border-double border-ink dark:border-magic-gold relative overflow-hidden flex flex-col p-8 md:p-12 text-center bg-paper-texture dark:bg-leather-texture">
                
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-magic-gold" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-magic-gold" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-magic-gold" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-magic-gold" />

                <h2 className="text-3xl font-display font-bold text-ink dark:text-magic-gold mb-8 border-b-2 border-ink dark:border-gray-700 pb-4">
                  Table of Contents
                </h2>

                <div className="flex flex-col gap-6 overflow-y-auto">
                   {menuItems.map((item) => (
                     <button
                       key={item.id}
                       onClick={() => handleNav(item.id)}
                       onMouseEnter={() => playSound('hover')}
                       className={`font-body text-2xl md:text-3xl transition-all hover:scale-105 italic
                         ${currentView === item.id 
                           ? 'text-crimson font-bold decoration-wavy underline' 
                           : 'text-ink dark:text-parchment hover:text-mystic-blue'
                         }`}
                     >
                       {item.label}
                     </button>
                   ))}
                </div>

                <div className="mt-auto text-sm font-rune text-ink/60 dark:text-parchment/60">
                   "Time waits for no wizard."
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Menu;