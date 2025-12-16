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
  { id: 'home', label: 'HOME / TERMINAL' },
  { id: 'diagnostic', label: '01. DIAGNOSTIC AUDIT' },
  { id: 'sorter', label: '02. ASSET ALLOCATION' },
  { id: 'timeline', label: '03. TIMELINE DECRYPTION' },
  { id: 'neural', label: '04. NEURAL CALIBRATION' },
  { id: 'capsule', label: '05. TIME CAPSULE' },
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
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 md:p-6 pointer-events-none">
        {/* Hamburger */}
        <button 
          onClick={toggleMenu}
          className="pointer-events-auto bg-black/50 dark:bg-black/50 backdrop-blur border border-slate-500 text-white p-3 rounded hover:bg-neon-green hover:border-neon-green hover:text-black transition-all group"
        >
          <div className="space-y-1">
            <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => { playSound('click'); toggleTheme(); }}
          className="pointer-events-auto bg-black/50 dark:bg-black/50 backdrop-blur border border-slate-500 text-white p-3 rounded hover:bg-white hover:text-black transition-all font-mono text-xs uppercase"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-gray-100 dark:bg-slate-900 flex flex-col justify-center items-start p-10 md:p-20 border-r-4 border-slate-900 dark:border-neon-green"
          >
             <div className="mb-10 text-xs text-slate-500 font-mono tracking-widest uppercase">
               Navigation System v4.2
             </div>

             <div className="flex flex-col gap-4">
               {menuItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleNav(item.id)}
                   onMouseEnter={() => playSound('hover')}
                   className={`text-left text-2xl md:text-5xl font-display font-black tracking-tighter transition-all hover:translate-x-4
                     ${currentView === item.id 
                       ? 'text-emerald-600 dark:text-neon-green' 
                       : 'text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white'
                     }`}
                 >
                   {item.label}
                 </button>
               ))}
             </div>

             <div className="mt-auto text-xs font-mono text-slate-400">
                TEMPORA AGENCY &copy; 2040
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Menu;