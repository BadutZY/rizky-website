import { useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ visible = true }: { visible?: boolean }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = useCallback(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-transition', '1');
    root.classList.add('theme-transitioning');
    toggleTheme();
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
      root.style.removeProperty('--theme-transition');
    }, 800);
  }, [toggleTheme]);

  return (
    <motion.button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-5 right-[4.5rem] md:right-[6.5rem] z-[75] flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-xl border border-border/40 transition-all duration-500 outline-none hover:scale-110 hover:border-primary/30 ${visible ? '' : 'pointer-events-none'}`}
      style={{
        boxShadow: isHovered
          ? '0 4px 20px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--border) / 0.3)'
          : '0 2px 12px hsl(var(--background) / 0.3), 0 0 0 1px hsl(var(--border) / 0.2)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div key="sun" initial={{ rotate: -180, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 180, scale: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <Sun size={16} className="text-muted-foreground transition-all duration-300"
              style={{ color: isHovered ? 'hsl(var(--primary))' : undefined, filter: isHovered ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none' }} />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 180, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -180, scale: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <Moon size={16} className="text-muted-foreground transition-all duration-300"
              style={{ color: isHovered ? 'hsl(var(--primary))' : undefined, filter: isHovered ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
