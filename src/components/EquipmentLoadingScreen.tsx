import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Cpu, CheckCircle } from 'lucide-react';

interface EquipmentLoadingScreenProps {
  onComplete: () => void;
}

const bootLines = [
  'Initializing hardware scan...',
  'Detecting CPU: Intel Core i5-4590',
  'Detecting GPU: GeForce GTX 950',
  'Reading memory modules...',
  'Scanning storage devices...',
  'Loading system configuration...',
  'Hardware scan complete!',
];

const EquipmentLoadingScreen = ({ onComplete }: EquipmentLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2400;
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
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return createPortal(
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-600 ${isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`} style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="relative flex flex-col items-center gap-6 px-6 max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.3)', boxShadow: '0 0 40px hsl(var(--primary) / 0.2)' }}>
          <Cpu className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground font-mono">Easter Egg Unlocked</h3>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Loading equipment specifications...</p>
        </div>
        <div className="w-full rounded-lg p-3 font-mono text-[11px] space-y-0.5 max-h-36 overflow-hidden" style={{ background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border) / 0.3)' }}>
          {bootLines.slice(0, currentLine + 1).map((line, i) => (
            <div key={i} className="flex items-center gap-1.5" style={{ color: i === currentLine ? 'hsl(var(--primary))' : line.includes('complete') ? 'hsl(120 70% 50%)' : 'hsl(var(--muted-foreground) / 0.7)' }}>
              {line.includes('complete') ? <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(120 70% 50%)' }} /> : <span style={{ color: 'hsl(var(--primary) / 0.4)' }}>$</span>}
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
    </div>,
    document.body
  );
};

export default EquipmentLoadingScreen;
