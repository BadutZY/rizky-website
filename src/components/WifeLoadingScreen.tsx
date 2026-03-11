import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, CheckCircle, Sparkles } from 'lucide-react';

interface WifeLoadingScreenProps {
  onComplete: () => void;
}

const bootLines = [
  'Scanning emotional database...',
  "Locating BadutZY's heart...",
  'Found: Victoria Kimberly (Kimmy)',
  'Loading memories together...',
  'Rendering love gallery...',
  'Compiling affection modules...',
  'Connection established!',
];

const floatingHearts = Array.from({ length: 8 }, (_, i) => ({
  delay: i * 0.4,
  duration: 3 + (i % 3),
  left: 10 + (i * 11) % 80,
  size: 12 + (i % 4) * 4,
}));

const WifeLoadingScreen = ({ onComplete }: WifeLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2800;
    const steps = 50;
    const increment = 100 / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment + Math.random() * 1.5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => { setIsExiting(true); setTimeout(onComplete, 600); }, 500);
      }
      setProgress(Math.min(current, 100));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => Math.min(prev + 1, bootLines.length - 1));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return createPortal(
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-600 ${isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`} style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingHearts.map((h, i) => (
          <div key={i} className="absolute" style={{ left: `${h.left}%`, bottom: '-20px', animation: `floatUp ${h.duration}s ease-in-out ${h.delay}s infinite`, opacity: 0.15 }}>
            <Heart className="text-primary" style={{ width: h.size, height: h.size }} fill="currentColor" />
          </div>
        ))}
      </div>
      <div className="absolute pointer-events-none" style={{ width: '500px', height: '500px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-6 px-6 max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative" style={{ background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.3)', boxShadow: '0 0 40px hsl(var(--primary) / 0.2)', animation: 'heartPulse 1.5s ease-in-out infinite' }}>
          <Heart className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} fill="currentColor" />
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5" style={{ color: 'hsl(var(--primary))', animation: 'sparkle 2s ease-in-out infinite' }} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground font-mono">You Found BadutZY's Love</h3>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Loading the most special person...</p>
        </div>
        <div className="w-full rounded-lg p-3 font-mono text-[11px] space-y-0.5 max-h-40 overflow-hidden" style={{ background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border) / 0.3)' }}>
          {bootLines.slice(0, currentLine + 1).map((line, i) => (
            <div key={i} className="flex items-center gap-1.5" style={{ color: i === currentLine ? 'hsl(var(--primary))' : line.includes('established') ? 'hsl(120 70% 50%)' : 'hsl(var(--muted-foreground) / 0.7)' }}>
              {line.includes('established') ? <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(120 70% 50%)' }} /> : <span style={{ color: 'hsl(var(--primary) / 0.4)' }}>$</span>}
              {line}
            </div>
          ))}
        </div>
        <div className="w-full space-y-2">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted) / 0.5)' }}>
            <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))', boxShadow: '0 0 10px hsl(var(--primary) / 0.5)' }} />
          </div>
          <p className="text-center font-mono text-[10px] text-muted-foreground tabular-nums">{Math.round(progress)}%</p>
        </div>
      </div>
      <style>{`
        @keyframes floatUp { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.15; } 90% { opacity: 0.15; } 100% { transform: translateY(-100vh) rotate(20deg); opacity: 0; } }
        @keyframes heartPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes sparkle { 0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); } 50% { opacity: 1; transform: scale(1.2) rotate(15deg); } }
      `}</style>
    </div>,
    document.body
  );
};

export default WifeLoadingScreen;
