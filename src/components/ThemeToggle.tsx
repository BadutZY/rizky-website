import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  visible: boolean;
}

const ThemeToggle = ({ visible }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-5 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-xl border border-border/40 transition-all duration-500 outline-none hover:scale-110 hover:border-primary/30 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
      style={{
        boxShadow: isHovered
          ? '0 4px 20px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--border) / 0.3)'
          : '0 2px 12px hsl(var(--background) / 0.3), 0 0 0 1px hsl(var(--border) / 0.2)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun
          size={16}
          className="text-muted-foreground transition-all duration-300"
          style={{
            color: isHovered ? 'hsl(var(--primary))' : undefined,
            filter: isHovered ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none',
          }}
        />
      ) : (
        <Moon
          size={16}
          className="text-muted-foreground transition-all duration-300"
          style={{
            color: isHovered ? 'hsl(var(--primary))' : undefined,
            filter: isHovered ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none',
          }}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
