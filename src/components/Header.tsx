import { useState, useEffect, useRef, useCallback } from 'react';
import { Home, User, Wrench, FolderOpen, Mail, Menu, X } from 'lucide-react';
import { useActiveSection } from '@/hooks/useScrollAnimation';


const navItems = [
  { href: '#home', label: 'Home', icon: Home },
  { href: '#about', label: 'About', icon: User },
  { href: '#skills', label: 'Skills', icon: Wrench },
  { href: '#projects', label: 'Projects', icon: FolderOpen },
  { href: '#contact', label: 'Contact', icon: Mail },
];

const Header = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const activeSection = useActiveSection();
  
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      if (e.clientY > windowHeight - 120) {
        setIsVisible(true);
        setLastInteraction(Date.now());
      }
    };

    const handleScroll = () => {
      setIsVisible(true);
      setLastInteraction(Date.now());
    };

    const checkIdle = () => {
      if (Date.now() - lastInteraction > 3000 && hoveredIndex === null) {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    timeout = setInterval(checkIdle, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeout);
    };
  }, [lastInteraction, hoveredIndex]);

  const updateIndicator = useCallback(() => {
    const activeIndex = navItems.findIndex(item => item.href.slice(1) === activeSection);
    if (activeIndex >= 0 && itemRefs.current[activeIndex] && dockRef.current) {
      const btn = itemRefs.current[activeIndex]!;
      const nav = dockRef.current;
      const btnRect = btn.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      setActiveIndicator({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    // Double rAF to ensure layout is fully settled after mount/fonts loaded
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        updateIndicator();
      });
      (raf1 as any)._raf2 = raf2;
    });
    // Also update after fonts are ready
    document.fonts?.ready?.then(() => updateIndicator());
    const timeout = setTimeout(updateIndicator, 200);
    window.addEventListener('resize', updateIndicator);
    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeout);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    // Close minimized menu on mobile after click
    if (isMinimized) {
      // keep minimized state, just navigate
    }
  };

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.45;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.05;
    return 1;
  };

  const getTranslateY = (index: number) => {
    if (hoveredIndex === null) return 0;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return -14;
    if (distance === 1) return -7;
    if (distance === 2) return -2;
    return 0;
  };

  return (
    <>
      {/* Hamburger button at bottom-left when minimized */}
      <button
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl hover:scale-110 transition-all duration-500 ${
          isMinimized ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 8px 40px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--border) / 0.3)',
        }}
        aria-label="Open navigation"
      >
        <Menu size={24} className="text-primary" />
      </button>

      <header
        role="banner"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isMinimized ? 'translate-y-full opacity-0 pointer-events-none' : isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <nav
          ref={dockRef}
          role="navigation"
          aria-label="Main navigation"
          className="flex items-end gap-1 md:gap-1.5 px-2 md:px-3 py-2 md:py-2.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl animate-scale-in"
          style={{
            boxShadow: '0 8px 40px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--border) / 0.3)',
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Sliding active indicator */}
          <div
            className="absolute rounded-xl pointer-events-none"
            style={{
              left: activeIndicator.left + (activeIndicator.width - 40) / 2,
              width: 40,
              height: 40,
              bottom: '50%',
              transform: 'translateY(50%)',
              background: 'hsl(var(--primary) / 0.15)',
              boxShadow: '0 0 20px hsl(var(--primary) / 0.25), inset 0 0 12px hsl(var(--primary) / 0.1)',
              border: '1px solid hsl(var(--primary) / 0.2)',
              transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
              opacity: activeIndicator.width > 0 ? 1 : 0,
            }}
          />

          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            const scale = getScale(index);
            const translateY = getTranslateY(index);

            return (
              <div key={item.href} className="relative flex flex-col items-center">
                {/* Tooltip */}
                <div
                  className={`absolute -top-10 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 pointer-events-none ${
                    hoveredIndex === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
                  }`}
                  style={{
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.label}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                    style={{
                      background: 'hsl(var(--card))',
                      borderRight: '1px solid hsl(var(--border) / 0.5)',
                      borderBottom: '1px solid hsl(var(--border) / 0.5)',
                    }}
                  />
                </div>

                <button
                  ref={(el) => { itemRefs.current[index] = el; }}
                  onClick={(e) => handleNavClick(e, item.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-colors duration-200 outline-none"
                  style={{
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={18}
                    className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                    style={{
                      filter: hoveredIndex === index ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' : 'none',
                      color: hoveredIndex === index ? 'hsl(var(--primary))' : undefined,
                    }}
                  />
                </button>

                <div
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{
                    background: 'hsl(var(--primary))',
                    boxShadow: '0 0 6px hsl(var(--primary) / 0.6)',
                    transform: `translateY(${translateY}px)`,
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </div>
            );
          })}

          {/* Divider */}
          <div className="w-px h-8 mx-1 self-center" style={{ background: 'hsl(var(--border) / 0.5)' }} />

          {/* Minimize button */}
          <div className="relative flex flex-col items-center">
            <div
              className={`absolute -top-10 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 pointer-events-none ${
                hoveredIndex === navItems.length + 1 ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
              }`}
              style={{
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border) / 0.5)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              Minimize
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                style={{
                  background: 'hsl(var(--card))',
                  borderRight: '1px solid hsl(var(--border) / 0.5)',
                  borderBottom: '1px solid hsl(var(--border) / 0.5)',
                }}
              />
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              onMouseEnter={() => setHoveredIndex(navItems.length + 1)}
              className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-colors duration-200 outline-none"
              style={{
                transform: `scale(${getScale(navItems.length + 1)}) translateY(${getTranslateY(navItems.length + 1)}px)`,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              aria-label="Minimize navigation"
            >
              <X size={18} className="text-muted-foreground transition-colors duration-200" style={{
                filter: hoveredIndex === navItems.length + 1 ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' : 'none',
                color: hoveredIndex === navItems.length + 1 ? 'hsl(var(--primary))' : undefined,
              }} />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
