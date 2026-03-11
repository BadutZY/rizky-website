import { useState, useEffect, useRef } from 'react';

const codeSnippets = [
  'import { Portfolio } from "@rizky/core";',
  'const skills = await loadSkills();',
  'initializing_modules...',
  'compiling components...',
  'loading projects_data...',
  'establishing connection...',
  'rendering UI elements...',
  'optimizing performance...',
  'building production bundle...',
  'deploying to server...',
];

const floatingCodeLines = [
  'const app = new Application();',
  'export default Portfolio;',
  'function render() { ... }',
  '<Component props={data} />',
  'async fetch("/api/projects")',
  'npm run build --production',
  'git commit -m "deploy"',
  'SELECT * FROM skills;',
  'docker compose up -d',
  'interface Developer { }',
  'type Props = { name: string }',
  'useEffect(() => { }, []);',
];

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [typedText, setTypedText] = useState('');
  const titleText = '> RIZKY.DEV';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= titleText.length) {
        setTypedText(titleText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 3200;
    const steps = 60;
    const increment = 100 / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment + (Math.random() * 0.8);
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
      setProgress(Math.min(current, 100));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet(prev => (prev + 1) % codeSnippets.length);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'hsl(var(--background))' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingCodeLines.map((line, i) => {
          const top = 5 + (i * 7.5) % 90;
          const delay = i * 0.3;
          const duration = 12 + (i % 5) * 3;
          const isLeft = i % 2 === 0;
          return (
            <div
              key={i}
              className="absolute whitespace-nowrap font-mono text-xs sm:text-sm"
              style={{
                top: `${top}%`,
                [isLeft ? 'left' : 'right']: '-20%',
                color: 'hsl(var(--primary) / 0.08)',
                animation: `floatCode${isLeft ? 'Right' : 'Left'} ${duration}s linear ${delay}s infinite`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px', height: '600px', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-lg w-full">
        <div
          className="w-full rounded-xl border overflow-hidden"
          style={{
            borderColor: 'hsl(var(--border) / 0.4)',
            background: 'hsl(var(--card) / 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 80px hsl(var(--primary) / 0.1), 0 0 0 1px hsl(var(--border) / 0.2)',
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--border) / 0.3)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
            <span className="ml-2 font-mono text-xs tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>
              terminal — rizky@portfolio
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center">
              <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider" style={{ color: 'hsl(var(--primary))' }}>
                {typedText}
                <span className="inline-block w-[2px] h-[1em] ml-1 align-middle" style={{ background: 'hsl(var(--primary))', animation: 'cursorBlink 1s step-end infinite' }} />
              </h1>
              <p className="font-mono text-xs mt-2 tracking-widest uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Initializing Portfolio System...
              </p>
            </div>

            <div className="font-mono text-xs space-y-1 p-3 rounded-lg" style={{ background: 'hsl(var(--background) / 0.5)', border: '1px solid hsl(var(--border) / 0.3)' }}>
              {codeSnippets.slice(0, currentSnippet + 1).slice(-4).map((snippet, i, arr) => (
                <div key={`${currentSnippet}-${i}`} className="flex items-center gap-2" style={{ opacity: i === arr.length - 1 ? 1 : 0.4, color: i === arr.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
                  <span style={{ color: 'hsl(var(--primary) / 0.5)' }}>$</span>
                  <span>{snippet}</span>
                  {i === arr.length - 1 && <span className="inline-block w-1.5 h-3.5" style={{ background: 'hsl(var(--primary))', animation: 'cursorBlink 1s step-end infinite' }} />}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>{progress < 100 ? 'Loading modules...' : 'Complete!'}</span>
                <span className="font-bold tabular-nums" style={{ color: 'hsl(var(--primary))' }}>{Math.round(progress)}%</span>
              </div>
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted) / 0.5)' }}>
                <div className="h-full rounded-full transition-all duration-100 ease-out relative" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))', boxShadow: '0 0 12px hsl(var(--primary) / 0.5)' }}>
                  <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.2) 50%, transparent 100%)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                </div>
              </div>
              <div className="font-mono text-[10px] tracking-[2px]" style={{ color: 'hsl(var(--primary) / 0.4)' }}>
                {'█'.repeat(Math.floor(progress / 4))}{'░'.repeat(25 - Math.floor(progress / 4))}
              </div>
            </div>
          </div>
        </div>

        <p className="font-mono text-[10px] tracking-[3px] uppercase" style={{ color: 'hsl(var(--muted-foreground) / 0.5)' }}>
          {'{ portfolio.initialize() }'}
        </p>
      </div>

      <style>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes floatCodeRight { 0% { transform: translateX(0); } 100% { transform: translateX(calc(140vw)); } }
        @keyframes floatCodeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-140vw)); } }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
