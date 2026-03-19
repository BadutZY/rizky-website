import { useTypingEffect } from '@/hooks/useTypingEffect';
import { motion, useScroll, useTransform } from 'framer-motion';
import profile from '@/assets/BadutZY.png';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import { useRef } from 'react';

const Hero = () => {
  const { displayText, isComplete } = useTypingEffect('Rizky', 150, 500);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({ top: aboutSection.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center overflow-hidden" role="banner">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, hsl(30 100% 50% / 0.06) 0%, transparent 60%)' }} aria-hidden="true" />

      <div className="container relative z-10 px-6 md:px-10 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            style={{ y: textY, opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4 md:mb-6 font-mono"
            >
              Rizky Maulana Putra
            </motion.p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] italic">
              Beginner{' '}
              <span className={`text-primary ${!isComplete ? 'typing-cursor' : ''}`}>
                Programmer
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed"
            >
              A beginner programmer just starting out on my coding journey. I've created websites, mods, and released games. Every project is a new opportunity to learn and grow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); const el = document.getElementById('projects'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); }}
                className="btn-primary"
              >
                View Projects
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); }}
                className="btn-secondary"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: imageY, opacity }}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <motion.div
                animate={{ rotate: [3, -2, 3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-4 rounded-[2rem] border-2 border-primary/20"
              />
              <motion.div
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-8 rounded-[2.5rem] border border-primary/10"
              />

              <div className="relative w-72 h-80 md:w-80 md:h-96 lg:w-[360px] lg:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl"
                style={{ boxShadow: '0 25px 80px hsl(30 100% 50% / 0.15), 0 0 0 1px hsl(var(--border) / 0.2)' }}>
                <ImageWithSkeleton
                  src={profile}
                  alt="Rizky Maulana Putra"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                  skeletonClassName="rounded-[2rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-lg flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">Available for projects</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={handleScrollToAbout}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
