import { useState, useEffect, useRef } from 'react';
import { Cpu, MonitorSpeaker, MemoryStick, HardDrive, Zap, CircuitBoard, Box, Fan, ChevronRight, Terminal, Monitor, Keyboard, Mouse, Headphones } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SpecItem { icon: typeof Cpu; label: string; value: string; detail?: string; color: string; }

const specs: SpecItem[] = [
  { icon: Cpu, label: 'CPU', value: 'Intel Core i5-4590', detail: '3.30 GHz · 4 Cores / 4 Threads', color: '200 100% 50%' },
  { icon: MonitorSpeaker, label: 'GPU', value: 'GeForce GTX 950', detail: '2GB GDDR5 · Maxwell Architecture', color: '120 100% 40%' },
  { icon: MemoryStick, label: 'RAM', value: '2x8 GB DDR3', detail: '1600 MHz · Dual Channel', color: '270 100% 60%' },
  { icon: HardDrive, label: 'STORAGE', value: '258GB SSD + 1.5TB HDD', detail: '258GB SSD · 500GB HDD · 1TB HDD', color: '30 100% 50%' },
  { icon: Zap, label: 'PSU', value: '600W 80+ RGB', detail: 'White Rated · RGB Illuminated', color: '50 100% 50%' },
  { icon: CircuitBoard, label: 'MOTHERBOARD', value: 'ASROCK H81M-DGS', detail: 'LGA 1150 · Micro ATX', color: '0 100% 55%' },
  { icon: Box, label: 'CASE', value: 'Standard ATX', detail: 'Mid Tower · Standard Airflow', color: '210 20% 50%' },
  { icon: Fan, label: 'COOLING', value: 'Cooler Master i30', detail: 'CPU Cooler + DEEPCOOL XFAN 8CM', color: '180 100% 45%' },
  { icon: Monitor, label: 'MONITOR', value: 'Dual Monitor Setup', detail: 'HIKVISION DS-D5022F2 FHD 100Hz · ACER EB192Q HD 60Hz', color: '220 80% 55%' },
  { icon: Keyboard, label: 'KEYBOARD', value: 'MONSGEEK FUN 60 PRO', detail: '60% Mechanical Keyboard', color: '330 80% 55%' },
  { icon: Mouse, label: 'MOUSE', value: 'MYNK GOZO E', detail: 'Gaming Mouse', color: '160 70% 45%' },
  { icon: Headphones, label: 'HEADSET', value: 'Rexus Vonix F29', detail: 'Gaming Headset', color: '290 70% 55%' },
];

const Equipment = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.02, true);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation<HTMLDivElement>(0.1, true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showSpecs, setShowSpecs] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (!sectionVisible || hasPlayed) return;
    const lines = ['$ neofetch --hardware', 'Detecting system components...', 'Reading BIOS information...', 'Scanning PCI devices...', '✓ All hardware detected successfully', '> Rendering specifications...'];
    setTerminalLines([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) { const currentLine = lines[i]; setTerminalLines(prev => [...prev, currentLine]); i++; }
      else { clearInterval(interval); setTimeout(() => { setShowSpecs(true); setHasPlayed(true); }, 500); }
    }, 450);
    return () => clearInterval(interval);
  }, [sectionVisible]);

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight; }, [terminalLines]);

  useEffect(() => {
    if (!showSpecs) return;
    let idx = 0;
    const interval = setInterval(() => { setActiveCard(idx % specs.length); idx++; }, 2500);
    return () => clearInterval(interval);
  }, [showSpecs]);

  return (
    <section id="equipment" className="section-padding overflow-hidden relative" role="region" aria-labelledby="equipment-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(270 100% 60%), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>
      <div className="container mx-auto px-5 sm:px-4 relative z-10">
        <div ref={sectionRef} className={`fade-in ${sectionVisible ? 'show' : ''} text-center mb-12`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Cpu className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-primary">Secret Unlocked</span>
          </div>
          <h2 id="equipment-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">My <span className="text-gradient">Equipment</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">The battle station behind every line of code.</p>
        </div>

        <div className={`max-w-2xl mx-auto mb-12 transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-card">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/50">
              <span className="w-3 h-3 rounded-full bg-destructive/70" /><span className="w-3 h-3 rounded-full bg-yellow-500/70" /><span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">system-specs.sh</span>
            </div>
            <div ref={terminalRef} className="p-4 font-mono text-xs space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
              {terminalLines.map((line, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: line.startsWith('✓') ? 'hsl(120 70% 50%)' : line.startsWith('$') || line.startsWith('>') ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>{line}</div>
              ))}
              {terminalLines.length > 0 && !showSpecs && <span className="inline-block w-2 h-3.5" style={{ background: 'hsl(var(--primary))', animation: 'blink 1s step-end infinite' }} />}
            </div>
          </div>
        </div>

        <div ref={gridRef} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ${showSpecs ? 'opacity-100' : 'opacity-0'}`}>
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            const isHovered = hoveredIndex === index;
            const isActive = activeCard === index;
            return (
              <div key={spec.label}
                className={`group relative bg-card/60 backdrop-blur-sm rounded-xl border overflow-hidden cursor-default transition-all duration-500 ${isHovered ? 'border-primary/50 -translate-y-2' : isActive ? 'border-primary/30 -translate-y-1' : 'border-border/40 hover:border-border'} ${showSpecs ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: showSpecs ? `${index * 150}ms` : '0ms', boxShadow: isHovered ? `0 12px 40px hsl(${spec.color} / 0.2), 0 0 0 1px hsl(${spec.color} / 0.1)` : isActive ? `0 6px 20px hsl(${spec.color} / 0.1)` : undefined }}
                onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className="h-0.5 transition-all duration-700" style={{ background: isHovered || isActive ? `linear-gradient(90deg, transparent, hsl(${spec.color}), transparent)` : 'transparent' }} />
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <div className="absolute left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${spec.color} / 0.6), transparent)`, animation: isHovered ? 'scanLine 2s ease-in-out infinite' : 'none' }} />
                </div>
                <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, hsl(${spec.color} / ${isHovered ? '0.08' : isActive ? '0.04' : '0'}), transparent 70%)`, opacity: isHovered || isActive ? 1 : 0 }} />
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t transition-all duration-500" style={{ borderColor: isHovered ? `hsl(${spec.color} / 0.5)` : 'transparent' }} />
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t transition-all duration-500" style={{ borderColor: isHovered ? `hsl(${spec.color} / 0.5)` : 'transparent' }} />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b transition-all duration-500" style={{ borderColor: isHovered ? `hsl(${spec.color} / 0.5)` : 'transparent' }} />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b transition-all duration-500" style={{ borderColor: isHovered ? `hsl(${spec.color} / 0.5)` : 'transparent' }} />
                <div className="p-5 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500" style={{ background: `hsl(${spec.color} / ${isHovered ? '0.2' : '0.1'})`, border: `1px solid hsl(${spec.color} / ${isHovered ? '0.4' : '0.2'})`, transform: isHovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1) rotate(0deg)', boxShadow: isHovered ? `0 0 20px hsl(${spec.color} / 0.3)` : 'none' }}>
                      <Icon className="w-5 h-5 transition-all duration-500" style={{ color: `hsl(${spec.color})`, filter: isHovered ? `drop-shadow(0 0 6px hsl(${spec.color} / 0.5))` : 'none' }} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{spec.label}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${spec.color})`, boxShadow: `0 0 6px hsl(${spec.color} / 0.5)`, animation: isActive ? 'pulse 2s infinite' : 'none' }} />
                        <span className="text-[9px] font-mono text-muted-foreground/60">{isHovered ? 'INSPECTING' : 'ONLINE'}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1 leading-tight transition-all duration-300" style={{ textShadow: isHovered ? `0 0 20px hsl(${spec.color} / 0.3)` : 'none' }}>{spec.value}</h3>
                  {spec.detail && <p className="text-xs text-muted-foreground leading-relaxed">{spec.detail}</p>}
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-300">
                    <ChevronRight className="w-3 h-3 transition-transform duration-300" style={{ transform: isHovered ? 'translateX(3px)' : 'translateX(0)' }} />
                    <span className="font-mono">specs.{spec.label.toLowerCase()}{isHovered && <span className="animate-pulse">_</span>}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-10 transition-all duration-700 ${showSpecs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: showSpecs ? '800ms' : '0ms' }}>
          <div className="bg-card/40 backdrop-blur-sm rounded-xl border border-border/30 p-5">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span>System Status: <span className="text-foreground font-semibold">Online</span></span></div>
              <div className="flex items-center gap-2"><Terminal className="w-3.5 h-3.5 text-primary" /><span>Platform: <span className="text-foreground font-semibold">Windows 10</span></span></div>
              <div className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-primary" /><span>Architecture: <span className="text-foreground font-semibold">x86_64</span></span></div>
              <div className="flex items-center gap-2"><HardDrive className="w-3.5 h-3.5 text-primary" /><span>Total Storage: <span className="text-foreground font-semibold">1.76 TB</span></span></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes scanLine { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }`}</style>
    </section>
  );
};

export default Equipment;
