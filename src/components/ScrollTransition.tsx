import { useEffect, useState } from 'react';

const ScrollTransition = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      const aboutSection = document.getElementById('about');
      if (!heroSection || !aboutSection) return;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const aboutTop = aboutSection.offsetTop;
      const transitionZone = aboutTop - heroBottom + 200;
      const scrollY = window.scrollY;
      const start = heroBottom - 300;
      const end = start + transitionZone;
      if (scrollY < start) setScrollProgress(0);
      else if (scrollY > end) setScrollProgress(1);
      else setScrollProgress((scrollY - start) / (end - start));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (scrollProgress <= 0 || scrollProgress >= 1) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30" style={{ opacity: Math.sin(scrollProgress * Math.PI) * 0.6 }}>
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${30 + scrollProgress * 40}%`, opacity: 1 - scrollProgress }}>
        <span className="text-4xl md:text-6xl font-bold text-primary/30 select-none whitespace-nowrap" style={{ transform: `scale(${1 - scrollProgress * 0.5}) translateY(${scrollProgress * -100}px)`, filter: `blur(${scrollProgress * 4}px)`, transition: 'none' }}>
          Rizky
        </span>
      </div>
      <div className="absolute w-64 h-64 rounded-full" style={{ background: `radial-gradient(circle, hsl(30 100% 50% / ${0.1 * scrollProgress}) 0%, transparent 70%)`, left: '30%', top: `${40 + scrollProgress * 20}%`, transform: `scale(${1 + scrollProgress})` }} />
      <div className="absolute w-48 h-48 rounded-full" style={{ background: `radial-gradient(circle, hsl(30 100% 50% / ${0.08 * scrollProgress}) 0%, transparent 70%)`, right: '20%', top: `${50 + scrollProgress * 15}%`, transform: `scale(${0.8 + scrollProgress * 0.5})` }} />
    </div>
  );
};

export default ScrollTransition;
