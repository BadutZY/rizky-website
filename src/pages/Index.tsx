import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Cpu, Heart, Monitor, Keyboard, Headphones, Mail, MessageCircle, Sparkles, Terminal, Globe, Zap, Star, Diamond, Hexagon, Triangle, Circle } from 'lucide-react';
import Header from '@/components/Header';
import ParticleBackground from '@/components/ParticleBackground';
import GlobalParallaxBackground from '@/components/GlobalParallaxBackground';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollIndicator from '@/components/ScrollIndicator';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import profile from '@/assets/BadutZY.png';
import modImg from '@/assets/project/curseforge.png';
import boxImg from '@/assets/project/fritzyforce-website.png';
import eqnoxImg from '@/assets/project/eqnox-website.png';
import kimmy1 from '@/assets/wife/kimmy-1.jpg';
import kimmy2 from '@/assets/wife/kimmy-2.jpg';
import kimmy3 from '@/assets/wife/kimmy-6.jpg';

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], staggerChildren: 0.12 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const floatingIcons = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', x: '15%', y: '20%', size: 'w-12 md:w-16' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', x: '75%', y: '25%', size: 'w-10 md:w-14' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', x: '80%', y: '65%', size: 'w-12 md:w-16' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg', x: '20%', y: '70%', size: 'w-10 md:w-12' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', x: '50%', y: '15%', size: 'w-8 md:w-12' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', x: '60%', y: '80%', size: 'w-8 md:w-10' },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(() => {
    if (sessionStorage.getItem('portfolio_loaded')) return false;
    return true;
  });
  const mousePos = useMouseParallax(0.015);
  const { displayText, isComplete } = useTypingEffect('Rizky', 150, 500);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollUnlockTimeout = useRef<number | null>(null);
  const wheelAccumulator = useRef(0);

  const sectionIds = ['hero', 'about', 'skills', 'projects', 'equipment', 'wife', 'contact'];

  const handleLoadComplete = useCallback(() => {
    sessionStorage.setItem('portfolio_loaded', 'true');
    setIsLoading(false);
  }, []);

  const releaseScrollLock = useCallback((delay = 600) => {
    if (scrollUnlockTimeout.current) {
      window.clearTimeout(scrollUnlockTimeout.current);
    }
    scrollUnlockTimeout.current = window.setTimeout(() => {
      isScrolling.current = false;
    }, delay);
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      const sections = containerRef.current?.querySelectorAll<HTMLElement>('.fp-section');
      if (!sections?.length) return;
      const boundedIndex = Math.max(0, Math.min(index, sections.length - 1));
      if (isScrolling.current || !sections[boundedIndex]) return;
      isScrolling.current = true;
      setActiveSection(boundedIndex);
      sections[boundedIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      releaseScrollLock();
    },
    [releaseScrollLock]
  );

  useEffect(() => {
    return () => {
      if (scrollUnlockTimeout.current) window.clearTimeout(scrollUnlockTimeout.current);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && !isLoading) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll<HTMLElement>('.fp-section');
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          const idx = Array.from(sections).indexOf(mostVisible.target as HTMLElement);
          if (idx !== -1) {
            setActiveSection(idx);
            wheelAccumulator.current = 0;
            const sectionEl = mostVisible.target as HTMLElement;
            if (sectionEl.id) sessionStorage.setItem('last_active_section', sectionEl.id);
          }
        }
      },
      { root: container, threshold: [0.45, 0.65, 0.85] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      if (isScrolling.current) { event.preventDefault(); return; }
      wheelAccumulator.current += event.deltaY;
      if (Math.abs(wheelAccumulator.current) < 45) return;
      event.preventDefault();
      const direction = wheelAccumulator.current > 0 ? 1 : -1;
      wheelAccumulator.current = 0;
      scrollToSection(activeSection + direction);
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeSection, scrollToSection]);

  if (isLoading) return <LoadingScreen onComplete={handleLoadComplete} />;

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative fp-container">
      <ParticleBackground />
      <GlobalParallaxBackground containerRef={containerRef} />
      <ThemeToggle visible={true} />
      <Header />

      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3" aria-label="Section navigation">
        {sectionIds.map((id, i) => (
          <button
            key={id}
            onClick={() => scrollToSection(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              activeSection === i
                ? 'bg-primary scale-125 shadow-[0_0_10px_hsl(var(--primary)/0.5)]'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
            aria-label={`Go to ${id}`}
          />
        ))}
      </nav>

      <main className="relative z-10">
        <section id="hero" className="fp-section flex items-center justify-center overflow-hidden relative" role="banner">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-bl from-primary/[0.08] to-transparent blur-3xl" />
            <div className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-gradient-to-tr from-primary/[0.06] to-transparent blur-3xl" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/[0.04] animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/[0.06] animate-[spin_45s_linear_infinite_reverse]" />
            <motion.div className="absolute top-[15%] left-[20%]" animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <Sparkles className="w-6 h-6 text-primary/10" />
            </motion.div>
            <motion.div className="absolute bottom-[25%] right-[20%]" animate={{ y: [0, 12, 0], rotate: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
              <Star className="w-5 h-5 text-primary/10" />
            </motion.div>
            <motion.div className="absolute top-[70%] left-[80%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
              <Diamond className="w-4 h-4 text-primary/[0.07]" />
            </motion.div>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 80% 70%, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
          </div>

          <div className="container relative z-10 px-6 md:px-10 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0"
            >
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4 md:mb-6 font-mono">
                Rizky Maulana Putra
              </motion.p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 leading-[1.1] italic">
                Beginner{' '}
                <span className={`text-primary ${!isComplete ? 'typing-cursor' : ''}`}>Programmer</span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed mx-auto lg:mx-0">
                A beginner programmer just starting out on my coding journey. I've created websites, mods, and released games. Every project is a new opportunity to learn and grow.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary">View Projects</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-secondary">Contact Me</a>
              </motion.div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => scrollToSection(1)}>
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-mono">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </section>

        <section id="about" className="fp-section flex items-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-[15%] left-[8%] w-32 h-32 rounded-full border border-primary/10 animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute bottom-[20%] right-[12%] w-24 h-24 rounded-2xl border border-primary/[0.08] rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[60%] left-[75%] w-16 h-16 rounded-full bg-primary/[0.03]" />
            <div className="absolute top-[30%] right-[20%] w-40 h-40 rounded-full bg-gradient-to-br from-primary/[0.05] to-transparent blur-2xl" />
            <div className="absolute bottom-[35%] left-[30%] w-20 h-20 rounded-xl border border-primary/[0.06] rotate-12 animate-float" style={{ animationDelay: '3s' }} />
            <motion.div className="absolute top-[25%] right-[35%]" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <Hexagon className="w-8 h-8 text-primary/[0.05]" />
            </motion.div>
            <motion.div className="absolute bottom-[15%] left-[15%]" animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
              <Triangle className="w-6 h-6 text-primary/[0.06]" />
            </motion.div>
            <div className="absolute top-[45%] left-[60%] w-1 h-1 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute top-[70%] left-[40%] w-1.5 h-1.5 rounded-full bg-primary/15 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[20%] left-[50%] w-1 h-1 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="container relative z-10 px-6 md:px-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.p variants={childVariants} className="text-sm tracking-[0.3em] uppercase text-primary font-mono mb-4">About</motion.p>
                <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">About Me</motion.h2>
                <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                  Get to know who I am, what I do, and the journey I'm on as a beginner programmer.
                </motion.p>
                <motion.div variants={childVariants}>
                  <Link to="/about" className="btn-primary inline-flex items-center gap-2 group">
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative group">
                  <motion.div animate={{ rotate: [3, -2, 3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-4 rounded-[2rem] border-2 border-primary/20" />
                  <motion.div animate={{ rotate: [-2, 3, -2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-8 rounded-[2.5rem] border border-primary/10" />
                  <div className="relative w-72 h-80 md:w-80 md:h-96 lg:w-[360px] lg:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl"
                    style={{ boxShadow: '0 25px 80px hsl(30 100% 50% / 0.15), 0 0 0 1px hsl(var(--border) / 0.2)' }}>
                    <ImageWithSkeleton src={profile} alt="Rizky Maulana Putra"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                      style={{ transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      skeletonClassName="rounded-[2rem]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-foreground">Available for projects</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        <section id="skills" className="fp-section flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
            {floatingIcons.map((icon, i) => (
              <motion.img key={i} src={icon.src} alt="" className={`absolute ${icon.size} opacity-[0.08]`}
                style={{ left: icon.x, top: icon.y, x: mousePos.x * (1 + i * 0.5), y: mousePos.y * (1 + i * 0.5) }} />
            ))}
            <motion.div className="absolute top-[10%] left-[40%]" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Terminal className="w-6 h-6 text-primary/[0.06]" />
            </motion.div>
            <motion.div className="absolute bottom-[15%] right-[30%]" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
              <Zap className="w-5 h-5 text-primary/[0.07]" />
            </motion.div>
            <div className="absolute top-[35%] right-[8%] w-24 h-24 rounded-full border border-primary/[0.05] animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-[25%] left-[5%] w-16 h-16 rounded-xl border border-primary/[0.04] rotate-45 animate-float" style={{ animationDelay: '4s' }} />
            <div className="absolute top-[75%] left-[45%] font-mono text-[80px] text-primary/[0.03] select-none leading-none">{'</'}</div>
            <div className="absolute top-[5%] right-[45%] font-mono text-[60px] text-primary/[0.03] select-none leading-none">{'{'}</div>
          </div>
          <div className="container relative z-10 px-6 md:px-20 text-center mx-auto">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex flex-col items-center">
              <motion.div variants={childVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Technologies</span>
              </motion.div>
              <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">My Skills</motion.h2>
              <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                the technologies I use for Web development, game development, and Minecraft modding.
              </motion.p>
              <motion.div variants={childVariants}>
                <Link to="/skills" className="btn-primary inline-flex items-center gap-2 group">
                  Explore Skills <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <ScrollIndicator />
        </section>

        <section id="projects" className="fp-section flex items-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-[10%] left-[5%] text-[120px] font-mono text-primary/[0.04] select-none leading-none">{'{'}</div>
            <div className="absolute bottom-[10%] right-[5%] text-[120px] font-mono text-primary/[0.04] select-none leading-none">{'}'}</div>
            <div className="absolute top-[45%] right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-primary/[0.05] to-transparent blur-3xl" />
            <div className="absolute bottom-[30%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-tr from-primary/[0.04] to-transparent blur-2xl" />
            <div className="absolute top-[20%] left-[45%] text-[60px] font-mono text-primary/[0.03] select-none leading-none opacity-60">{'</>'}</div>
            <motion.div className="absolute bottom-[20%] left-[35%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <Globe className="w-7 h-7 text-primary/[0.06]" />
            </motion.div>
            <div className="absolute top-[65%] right-[25%] w-20 h-20 rounded-full border border-primary/[0.05] animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[15%] right-[35%] w-2 h-2 rounded-full bg-primary/15 animate-pulse" />
            <div className="absolute bottom-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="container relative z-10 px-6 md:px-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.p variants={childVariants} className="text-sm tracking-[0.3em] uppercase text-primary font-mono mb-4">Portfolio</motion.p>
                <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">My Projects</motion.h2>
                <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                  A collection of projects I've built, from websites, game and mods.
                </motion.p>
                <motion.div variants={childVariants}>
                  <Link to="/projects" className="btn-primary inline-flex items-center gap-2 group">
                    View All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="relative flex justify-center lg:justify-end"
              >
                <motion.div className="relative w-[260px] h-[280px] sm:w-[320px] sm:h-[350px] md:w-[460px] md:h-[430px] group cursor-pointer overflow-visible" whileHover="bloom" initial="stacked">
                  {[
                    { img: eqnoxImg, stacked: { rotate: -6, x: -12, y: 10 }, bloom: { rotate: -22, x: -240, y: 40, scale: 0.88 } },
                    { img: modImg, stacked: { rotate: 0, x: 0, y: 0 }, bloom: { rotate: 0, x: 0, y: -24, scale: 1.06 } },
                    { img: boxImg, stacked: { rotate: 6, x: 12, y: -10 }, bloom: { rotate: 22, x: 240, y: 40, scale: 0.88 } },
                  ].map((card, i) => (
                    <motion.div key={i} className="absolute inset-0 rounded-2xl overflow-hidden border border-border/30 shadow-2xl will-change-transform"
                      style={{ zIndex: i === 1 ? 3 : i === 2 ? 2 : 1 }}
                      variants={{
                        stacked: { rotate: card.stacked.rotate, x: card.stacked.x, y: card.stacked.y, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24, mass: 0.72 } },
                        bloom: { rotate: card.bloom.rotate, x: card.bloom.x, y: card.bloom.y, scale: card.bloom.scale, transition: { type: 'spring', stiffness: 160, damping: 18, mass: 0.78 } },
                      }}>
                      <img src={card.img} alt={`Project showcase ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </motion.div>
                  ))}
                  <div className="absolute -inset-10 rounded-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 72%)' }} />
                </motion.div>
              </motion.div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        <section id="equipment" className="fp-section flex items-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="absolute top-[20%] right-[10%] w-48 h-48 rounded-full bg-gradient-to-bl from-blue-500/[0.04] to-transparent blur-3xl" />
            <div className="absolute bottom-[25%] left-[10%] w-36 h-36 rounded-full bg-gradient-to-tr from-green-500/[0.04] to-transparent blur-3xl" />
            <motion.div className="absolute top-[15%] left-[30%]" animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <Monitor className="w-8 h-8 text-primary/[0.06]" />
            </motion.div>
            <motion.div className="absolute bottom-[20%] right-[25%]" animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
              <Keyboard className="w-7 h-7 text-primary/[0.06]" />
            </motion.div>
            <motion.div className="absolute top-[60%] left-[70%]" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
              <Headphones className="w-6 h-6 text-primary/[0.05]" />
            </motion.div>
            <div className="absolute top-[40%] left-[15%] w-16 h-16 rounded-lg border border-primary/[0.05] rotate-12 animate-float" style={{ animationDelay: '3s' }} />
          </div>
          <div className="container relative z-10 px-6 md:px-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.div variants={childVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Setup</span>
                </motion.div>
                <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">My Equipment</motion.h2>
                <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                  The battle station behind every line of code and every mod created.
                </motion.p>
                <motion.div variants={childVariants}>
                  <Link to="/equipment" className="btn-primary inline-flex items-center gap-2 group">
                    View Full Specs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Monitor, label: 'Monitor', desc: 'High refresh display', color: 'from-blue-500/20 to-blue-600/5' },
                  { icon: Keyboard, label: 'Keyboard', desc: 'Mechanical RGB', color: 'from-green-500/20 to-green-600/5' },
                  { icon: Cpu, label: 'PC Setup', desc: 'Custom built rig', color: 'from-primary/20 to-primary/5' },
                  { icon: Headphones, label: 'Audio', desc: 'Studio headset', color: 'from-purple-500/20 to-purple-600/5' },
                ].map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    className="group relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 overflow-hidden cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1">{item.label}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        <section id="wife" className="fp-section flex items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div className="absolute inset-0" style={{ x: mousePos.x * -0.2, y: mousePos.y * -0.2 }}>
              <img src={kimmy1} alt="" className="w-full h-full object-cover grayscale opacity-15 scale-110" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
            <motion.div className="absolute top-[20%] right-[15%]" animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Heart className="w-5 h-5 text-primary/[0.08] fill-primary/[0.05]" />
            </motion.div>
            <motion.div className="absolute bottom-[30%] left-[20%]" animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}>
              <Heart className="w-4 h-4 text-primary/[0.06] fill-primary/[0.04]" />
            </motion.div>
            <motion.div className="absolute top-[50%] right-[30%]" animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
              <Sparkles className="w-4 h-4 text-primary/[0.06]" />
            </motion.div>
          </div>
          <div className="container relative z-10 px-6 md:px-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.div variants={childVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Special</span>
                </motion.div>
                <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">My Wife</motion.h2>
                <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                  The most special person in my life, meet Kimmy.
                </motion.p>
                <motion.div variants={childVariants}>
                  <Link to="/wife" className="btn-primary inline-flex items-center gap-2 group">
                    Meet Kimmy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="flex justify-center lg:justify-end"
              >
                <motion.div className="relative w-[260px] h-[310px] sm:w-[320px] sm:h-[380px] md:w-[440px] md:h-[450px] group cursor-pointer overflow-visible" whileHover="bloom" initial="stacked">
                  {[
                    { img: kimmy3, stacked: { rotate: -8, x: -16, y: 14 }, bloom: { rotate: -22, x: -220, y: 40, scale: 0.86 } },
                    { img: kimmy1, stacked: { rotate: -1, x: 0, y: 0 }, bloom: { rotate: 0, x: 0, y: -24, scale: 1.08 } },
                    { img: kimmy2, stacked: { rotate: 6, x: 14, y: -10 }, bloom: { rotate: 22, x: 220, y: 40, scale: 0.86 } },
                  ].map((card, i) => (
                    <motion.div key={i} className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-border/20 shadow-2xl will-change-transform"
                      style={{ zIndex: i === 1 ? 3 : i === 2 ? 2 : 1 }}
                      variants={{
                        stacked: { rotate: card.stacked.rotate, x: card.stacked.x, y: card.stacked.y, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24, mass: 0.72 } },
                        bloom: { rotate: card.bloom.rotate, x: card.bloom.x, y: card.bloom.y, scale: card.bloom.scale, transition: { type: 'spring', stiffness: 150, damping: 18, mass: 0.8 } },
                      }}>
                      <img src={card.img} alt={`Kimmy gallery ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                      {i === 1 && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border/30">
                            <div className="flex items-center gap-2">
                              <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                              <span className="text-xs font-semibold text-foreground">Kimmy</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div className="absolute -inset-10 rounded-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 72%)' }} />
                </motion.div>
              </motion.div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        <section id="contact" className="fp-section flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-bl from-primary/[0.06] to-transparent blur-3xl" />
            <div className="absolute bottom-[25%] left-[8%] w-48 h-48 rounded-full bg-gradient-to-tr from-primary/[0.04] to-transparent blur-2xl" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/[0.04]" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-primary/[0.06]" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-primary/[0.03]" />
            <motion.div className="absolute top-[15%] left-[25%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <Mail className="w-6 h-6 text-primary/[0.06]" />
            </motion.div>
            <motion.div className="absolute bottom-[20%] right-[20%]" animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
              <MessageCircle className="w-5 h-5 text-primary/[0.06]" />
            </motion.div>
            <div className="absolute top-[35%] left-[70%] w-2 h-2 rounded-full bg-primary/15 animate-pulse" />
            <div className="absolute bottom-[40%] left-[30%] w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="flex-1 flex items-center w-full">
            <div className="container relative z-10 px-6 md:px-20 mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <motion.div
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  <motion.div variants={childVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Social Media</span>
                  </motion.div>
                  <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-bold italic text-foreground mb-6">Get In Touch</motion.h2>
                  <motion.p variants={childVariants} className="text-muted-foreground text-base md:text-lg max-w-xl mb-6 leading-relaxed">
                    Feel free to reach out through any of my social platforms.
                  </motion.p>
                  <motion.div variants={childVariants} className="w-full max-w-lg  gap-3 mb-6">
                    <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm px-4 py-3 text-left">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Availability</p>
                      <p className="text-sm font-semibold text-foreground">Still studying</p>
                    </div>
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group">
                      Connect With Me <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="w-full max-w-[260px] sm:max-w-xs md:max-w-sm mx-auto lg:ml-auto"
                >
                  <div className="relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl p-2 sm:p-3 md:p-4 overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, hsl(var(--primary) / 0.14), transparent 55%)' }} />
                    <div className="relative rounded-2xl overflow-hidden border border-border/30">
                      <ImageWithSkeleton src={profile} alt="Rizky profile card"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        skeletonClassName="rounded-2xl" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-background/70 backdrop-blur-md border border-border/30 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">Keep learning and growing</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-3">
                      <div className="rounded-xl border border-border/40 bg-background/40 px-3 py-2 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">Direct contact</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </main>
      <BackToTop />
    </div>
  );
};

export default Index;
