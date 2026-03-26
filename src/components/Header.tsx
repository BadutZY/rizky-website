import { useState, useCallback, useMemo, useEffect } from 'react';
import { Home, User, Wrench, FolderOpen, Mail, Cpu, Heart } from 'lucide-react';
import { useActiveSection } from '@/hooks/useScrollAnimation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#about', label: 'About', icon: User },
  { href: '#skills', label: 'Skills', icon: Wrench },
  { href: '#projects', label: 'Projects', icon: FolderOpen },
  { href: '#equipment', label: 'Equipment', icon: Cpu },
  { href: '#wife', label: 'Wife', icon: Heart },
  { href: '#contact', label: 'Contact', icon: Mail },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const scrollContainer = document.querySelector('.fp-container');
    const handleScroll = () => {
      const scrollTop = scrollContainer instanceof HTMLElement ? scrollContainer.scrollTop : window.scrollY;
      setScrolled(scrollTop > 24);
    };
    handleScroll();
    if (scrollContainer instanceof HTMLElement) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) => {
      const id = item.href.slice(1);
      return id === activeSection || (id === 'hero' && activeSection === 'home');
    });
  }, [activeSection]);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector<HTMLElement>(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none transition-all duration-500 ${scrolled ? 'md:bg-transparent bg-background/60 backdrop-blur-xl md:backdrop-blur-none' : ''}`}>
        <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="text-lg font-bold text-foreground tracking-wider font-mono pointer-events-auto">
          Rizky<span className="text-primary">.</span>
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group pointer-events-auto" aria-label="Toggle menu">
          <motion.span animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="block w-7 h-[2px] bg-foreground origin-center" />
          <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="block w-5 h-[2px] bg-foreground group-hover:w-7 transition-[width] duration-300" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="block w-7 h-[2px] bg-foreground origin-center" />
        </button>
      </header>

      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 z-40 hidden md:flex flex-col items-center gap-1 py-4 px-2 rounded-r-2xl bg-card/60 backdrop-blur-xl border border-l-0 border-border/30"
        style={{
          top: 0,
          bottom: 0,
          marginTop: 'auto',
          marginBottom: 'auto',
          height: 'fit-content',
          boxShadow: '4px 0 30px hsl(var(--background) / 0.5)',
        }}
      >
        {activeIndex >= 0 && (
          <motion.div className="absolute left-0 w-[3px] h-6 rounded-r-full bg-primary"
            animate={{ top: 16 + activeIndex * 48 + (44 - 24) / 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
        )}
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const itemId = item.href.slice(1);
          const isActive = activeSection === itemId || (itemId === 'hero' && activeSection === 'home');
          return (
            <motion.button key={item.href}
              initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group ${isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
              aria-label={item.label} aria-current={isActive ? 'page' : undefined}>
              <Icon size={18} className="transition-all duration-300" style={{ filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' : 'none' }} />
              <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none bg-card border border-border/50 text-foreground shadow-lg">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-2">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const itemId = item.href.slice(1);
                const isActive = activeSection === itemId || (itemId === 'hero' && activeSection === 'home');
                return (
                  <motion.a key={item.href} href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`flex items-center gap-4 px-8 py-4 rounded-2xl text-2xl md:text-4xl font-bold tracking-wide transition-colors duration-300 group ${isActive ? 'text-primary' : 'text-foreground/60 hover:text-foreground'}`}>
                    <Icon size={24} className={`transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
                    </span>
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;