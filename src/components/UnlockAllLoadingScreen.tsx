import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Unlock, CheckCircle, Shield, Zap, Key } from 'lucide-react';

interface UnlockAllLoadingScreenProps {
  onComplete: () => void;
}

const bootLines = [
  'Authenticating secret phrase...',
  'Decrypting hidden modules...',
  'Unlocking: Theme Toggle',
  'Unlocking: Secret Video',
  'Unlocking: Equipment Specs',
  'Unlocking: Wife Section',
  'All secrets revealed!',
];

const floatingKeys = Array.from({ length: 10 }, (_, i) => ({
  delay: i * 0.3,
  duration: 4 + (i % 3),
  left: 5 + (i * 10) % 90,
  size: 10 + (i % 4) * 3,
}));

const UnlockAllLoadingScreen = ({ onComplete }: UnlockAllLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 3000;
    const steps = 55;
    const increment = 100 / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment + Math.random() * 1.2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => { setIsExiting(true); setTimeout(onComplete, 600); }, 600);
      }
      setProgress(Math.min(current, 100));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => Math.min(prev + 1, bootLines.length - 1));
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return createPortal(
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-600 ${isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`} style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingKeys.map((k, i) => (
          <div key={i} className="absolute" style={{ left: `${k.left}%`, bottom: '-20px', animation: `keyFloat ${k.duration}s ease-in-out ${k.delay}s infinite`, opacity: 0.1 }}>
            <Key className="text-primary" style={{ width: k.size, height: k.size }} />
          </div>
        ))}
      </div>
      <div className="absolute pointer-events-none" style={{ width: '600px', height: '600px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)', animation: 'glowPulse 3s ease-in-out infinite' }} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-6 px-6 max-w-md w-full">
        <div className="relative">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: '72px', height: '72px', background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.3)', boxShadow: '0 0 50px hsl(var(--primary) / 0.25)', animation: 'unlockPulse 2s ease-in-out infinite' }}>
            <Unlock className="w-9 h-9" style={{ color: 'hsl(var(--primary))' }} />
          </div>
          <div className="absolute inset-0" style={{ animation: 'orbit 6s linear infinite' }}>
            <Shield className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 text-primary/50" />
          </div>
          <div className="absolute inset-0" style={{ animation: 'orbit 6s linear infinite reverse' }}>
            <Zap className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 text-primary/50" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground font-mono">Unlocking All Secrets</h3>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Revealing every hidden feature...</p>
        </div>
        <div className="w-full rounded-lg p-3 font-mono text-[11px] space-y-0.5 max-h-44 overflow-hidden" style={{ background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border) / 0.3)' }}>
          {bootLines.slice(0, currentLine + 1).map((line, i) => (
            <div key={i} className="flex items-center gap-1.5" style={{ color: i === currentLine ? 'hsl(var(--primary))' : line.includes('revealed') ? 'hsl(120 70% 50%)' : line.startsWith('Unlocking:') ? 'hsl(var(--primary) / 0.8)' : 'hsl(var(--muted-foreground) / 0.7)' }}>
              {line.includes('revealed') ? <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(120 70% 50%)' }} /> : line.startsWith('Unlocking:') ? <Unlock className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(var(--primary) / 0.6)' }} /> : <span style={{ color: 'hsl(var(--primary) / 0.4)' }}>$</span>}
              {line}
            </div>
          ))}
        </div>
        <div className="w-full space-y-2">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted) / 0.5)' }}>
            <div className="h-full rounded-full transition-all duration-100 relative overflow-hidden" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))', boxShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.2) 50%, transparent 100%)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
            </div>
          </div>
          <p className="text-center font-mono text-[10px] text-muted-foreground tabular-nums">{Math.round(progress)}%</p>
        </div>
      </div>
      <style>{`
        @keyframes keyFloat { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.1; } 90% { opacity: 0.1; } 100% { transform: translateY(-100vh) rotate(30deg); opacity: 0; } }
        @keyframes unlockPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 50px hsl(var(--primary) / 0.25); } 50% { transform: scale(1.05); box-shadow: 0 0 70px hsl(var(--primary) / 0.35); } }
        @keyframes orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes glowPulse { 0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>,
    document.body
  );
};

export default UnlockAllLoadingScreen;
