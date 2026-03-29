import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Cpu, MonitorSpeaker, MemoryStick, HardDrive, Zap,
  CircuitBoard, Box, Fan, Terminal, Monitor, Keyboard,
  Mouse, Headphones, ChevronRight, Activity, Layers, X,
  Tag, Info, Image as ImageIcon,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import setupImg from '@/assets/setup.jpeg';

// ─── Equipment photos ─────────────────────────────────────────────────────────
import cpuImg      from '@/assets/equipment/cpu.png';
import gpuImg      from '@/assets/equipment/gpu.png';
import ramImg      from '@/assets/equipment/ram.png';
import moboImg     from '@/assets/equipment/mobo.png';
import storageImg  from '@/assets/equipment/storage.png';
import psuImg      from '@/assets/equipment/psu.png';
import caseImg     from '@/assets/equipment/case.jpeg';
import coolingImg  from '@/assets/equipment/cooling.webp';
import monitorImg  from '@/assets/equipment/monitor.png';
import keyboardImg from '@/assets/equipment/keyboard.png';
import mouseImg    from '@/assets/equipment/mouse.png';
import headsetImg  from '@/assets/equipment/headset.png';
// ─────────────────────────────────────────────────────────────────────────────

interface SpecItem {
  icon: typeof Cpu;
  label: string;
  value: string;
  detail?: string;
  color: string;
  group: 'core' | 'storage' | 'power' | 'peripheral';
  perf: number;
  image: string;
  priceRp?: string;
  priceUsd?: string;
  specLines?: string[];
}

const specs: SpecItem[] = [
  {
    icon: Cpu, label: 'CPU', value: 'Intel Core i5-4590',
    detail: '3.30 GHz · 4 Cores / 4 Threads',
    color: '200 100% 52%', group: 'core', perf: 62, image: cpuImg,
    priceRp: 'Rp 245.000', priceUsd: '$15',
    specLines: ['Generation: 4th Gen', 'Cores: 4 Cores / 4 Threads', 'Base Clock: 3.30 GHz', 'Boost Clock: 3.70 GHz', 'Socket: LGA 1150', 'TDP: 84W'],
  },
  {
    icon: MonitorSpeaker, label: 'GPU', value: 'GeForce GTX 950',
    detail: '2GB GDDR5 · Maxwell Architecture',
    color: '120 100% 42%', group: 'core', perf: 55, image: gpuImg,
    priceRp: 'Rp 600.000', priceUsd: '$36',
    specLines: ['VRAM: 2GB GDDR5', 'Architecture: Maxwell', 'CUDA Cores: 768', 'Memory Bus: 128-bit', 'TDP: 90W'],
  },
  {
    icon: MemoryStick, label: 'RAM', value: '2×8 GB DDR3',
    detail: '1600 MHz · Dual Channel',
    color: '270 100% 62%', group: 'core', perf: 80, image: ramImg,
    priceRp: 'Rp 630.000', priceUsd: '$38',
    specLines: ['Total: 16 GB', 'Speed: 12800/1600 MHz', 'Type: DDR3', 'Config: Dual Channel', 'CAS Latency: CL11'],
  },
  {
    icon: CircuitBoard, label: 'MOTHERBOARD', value: 'ASROCK H81M-DGS',
    detail: 'LGA 1150 · Micro ATX',
    color: '0 100% 52%', group: 'core', perf: 70, image: moboImg,
    priceRp: 'Rp 275.000', priceUsd: '$17',
    specLines: ['Socket: LGA 1150', 'Chipset: Intel H81', 'Form Factor: Micro ATX', 'RAM Slots: 2× DDR3', 'PCIe: x16 Gen 2'],
  },
  {
    icon: HardDrive, label: 'STORAGE', value: '258GB SSD + 1.5TB HDD',
    detail: '258GB SSD · 500GB HDD · 1TB HDD',
    color: '30 100% 52%', group: 'storage', perf: 75, image: storageImg,
    priceRp: 'Rp 580.000', priceUsd: '$35',
    specLines: ['SSD: 258 GB (OS Drive)', 'HDD #1: 500 GB', 'HDD #2: 1 TB', 'Interface: SATA III', 'Total: ~1.76 TB'],
  },
  {
    icon: Zap, label: 'PSU', value: '600W 80+ RGB',
    detail: 'White Rated · RGB Illuminated',
    color: '50 100% 52%', group: 'power', perf: 60, image: psuImg,
    priceRp: 'Rp 250.000', priceUsd: '$15',
    specLines: ['Wattage: 600W', 'Efficiency: 80+ White', 'Lighting: RGB', 'Modular: No', 'Connectors: ATX 24-pin'],
  },
  {
    icon: Box, label: 'CASE', value: 'Standard ATX',
    detail: 'Mid Tower · Standard Airflow',
    color: '210 18% 52%', group: 'power', perf: 50, image: caseImg,
    priceRp: 'Rp 70.000', priceUsd: '$5',
    specLines: ['Supports: mATX', 'Drive Bays: 2× 3.5" + 2× 2.5"', 'Expansion Slots: 7', 'Front I/O: USB 2.0 + Audio'],
  },
  {
    icon: Fan, label: 'COOLING', value: 'Cooler Master i30',
    detail: 'CPU Cooler + DEEPCOOL XFAN 8CM',
    color: '180 100% 48%', group: 'power', perf: 65, image: coolingImg,
    priceRp: 'Rp 55.000', priceUsd: '$4',
    specLines: ['Type: Air Cooler', 'CPU Fan: Cooler Master i30', 'Power Consumption: 1.56 W', 'Socket: LGA 1156 / 1155 / 1151 / 1150 / 1200'],
  },
  {
    icon: Monitor, label: 'MONITOR', value: 'Dual Monitor Setup',
    detail: 'HIKVISION FHD 100Hz · ACER HD 60Hz',
    color: '220 80% 58%', group: 'peripheral', perf: 85, image: monitorImg,
    priceRp: 'Rp 1.315.000', priceUsd: '$78',
    specLines: ['Primary: HIKVISION 22" FHD', 'Refresh #1: 100Hz IPS', 'Secondary: ACER 19" HD', 'Refresh #2: 60Hz', 'Connection: HDMI + VGA'],
  },
  {
    icon: Keyboard, label: 'KEYBOARD', value: 'MONSGEEK FUN 60 PRO',
    detail: '60% Mechanical Keyboard',
    color: '330 80% 58%', group: 'peripheral', perf: 90, image: keyboardImg,
    priceRp: 'Rp 420.000', priceUsd: '$25',
    specLines: ['Layout: 60% Compact', 'Type: Mechanical Rapid Trigger', 'Connection: USB-C', 'Switch: Magnetic Switch', 'Backlight: RGB'],
  },
  {
    icon: Mouse, label: 'MOUSE', value: 'MYNK GOZO E',
    detail: 'Gaming Mouse',
    color: '160 70% 48%', group: 'peripheral', perf: 85, image: mouseImg,
    priceRp: 'Rp 300.000', priceUsd: '$18',
    specLines: ['DPI: Up to 12.000', 'Buttons: 5 Programmable', 'Connection: Wireless', 'Sensor: PAW 3311'],
  },
  {
    icon: Headphones, label: 'HEADSET', value: 'Rexus Vonix F29',
    detail: 'Gaming Headset',
    color: '290 70% 58%', group: 'peripheral', perf: 78, image: headsetImg,
    priceRp: 'Rp 145.000', priceUsd: '$9',
    specLines: ['Type: Over-Ear Gaming', 'Driver: 50mm', 'Frequency: 20Hz–20kHz', 'Mic: Detachable', 'Connection: 3.5mm Jack'],
  },
];

const GROUPS = [
  { key: 'all',        label: 'All',         icon: Layers    },
  { key: 'core',       label: 'Core',        icon: Cpu       },
  { key: 'storage',    label: 'Storage',     icon: HardDrive },
  { key: 'power',      label: 'Power',       icon: Zap       },
  { key: 'peripheral', label: 'Peripherals', icon: Monitor   },
] as const;

const BOOT_LINES = [
  '$ sudo neofetch --hardware --verbose',
  'Initializing hardware scanner...',
  'Reading UEFI / BIOS tables...              [OK]',
  'Scanning PCI bus for devices...            [OK]',
  'Detecting CPU topology...                  [OK]',
  '  └─ Intel Core i5-4590 @ 3.30GHz',
  'Scanning memory modules...                 [OK]',
  '  └─ 2 × 8GB DDR3-1600 (Dual Channel)',
  'Enumerating GPU...                         [OK]',
  '  └─ NVIDIA GeForce GTX 950 (2GB GDDR5)',
  'Scanning storage devices...                [OK]',
  '  └─ 258GB SSD + 500GB HDD + 1TB HDD',
  'Detecting peripherals...                   [OK]',
  '✓ All 12 hardware components detected',
  '> Rendering battle station specs...',
];

// ─────────────────────────────────────────────────────────────────────────────
// Photo Toggle Switch
// ─────────────────────────────────────────────────────────────────────────────
interface PhotoToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function PhotoToggle({ enabled, onToggle }: PhotoToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-300 focus:outline-none"
      style={{
        background: enabled ? 'hsl(var(--primary)/0.12)' : 'hsl(var(--card)/0.5)',
        borderColor: enabled ? 'hsl(var(--primary)/0.45)' : 'hsl(var(--border)/0.5)',
        boxShadow: enabled ? '0 0 14px hsl(var(--primary)/0.12)' : 'none',
      }}
    >
      {/* Icon */}
      <ImageIcon
        className="w-3 h-3 flex-shrink-0 transition-colors duration-300"
        style={{ color: enabled ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground)/0.5)' }}
      />

      {/* Label */}
      <span
        className="text-[11px] font-mono transition-colors duration-300"
        style={{ color: enabled ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground)/0.55)' }}
      >
        photos
      </span>

      {/* Toggle pill */}
      <div
        className="relative flex-shrink-0 rounded-full transition-all duration-300"
        style={{
          width: '30px',
          height: '16px',
          background: enabled
            ? 'hsl(var(--primary))'
            : 'hsl(var(--muted)/0.8)',
          border: `1px solid ${enabled ? 'hsl(var(--primary))' : 'hsl(var(--border)/0.6)'}`,
          boxShadow: enabled ? '0 0 8px hsl(var(--primary)/0.4)' : 'none',
        }}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute top-[1px] rounded-full"
          style={{
            width: '12px',
            height: '12px',
            background: '#ffffff',
            left: enabled ? 'calc(100% - 13px)' : '1px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Photo Modal
// ─────────────────────────────────────────────────────────────────────────────
interface PhotoModalProps {
  spec: SpecItem;
  onClose: () => void;
}

function PhotoModal({ spec, onClose }: PhotoModalProps) {
  const Icon = spec.icon;
  const c    = spec.color;

  useEffect(() => {
    const sbW     = window.innerWidth - document.documentElement.clientWidth;
    const prevOv  = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow     = 'hidden';
    document.body.style.paddingRight = `${sbW}px`;
    return () => {
      document.body.style.overflow     = prevOv;
      document.body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          overflowY: 'auto',
        }}
      >
        <div className="absolute pointer-events-none" style={{
          width: '40vmin', height: '40vmin', borderRadius: '50%',
          background: `radial-gradient(circle, hsl(${c}) 0%, transparent 70%)`,
          filter: 'blur(60px)', opacity: 0.08,
        }} />

        <motion.div
          key="modal-card"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{    scale: 0.92, opacity: 0, y: 12 }}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 'min(440px, 94vw)',
            maxHeight: 'calc(100vh - 24px)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'hsl(var(--card))',
            border: `1px solid hsl(${c}/0.22)`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px hsl(${c}/0.08), 0 0 60px hsl(${c}/0.06)`,
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height: '3px',
            flexShrink: 0,
            background: `linear-gradient(90deg, transparent 0%, hsl(${c}) 35%, hsl(${c}/0.5) 65%, transparent 100%)`,
          }} />

          {/* Header — fixed, never scrolls */}
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: `1px solid hsl(${c}/0.1)`, flexShrink: 0 }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `hsl(${c}/0.15)`, border: `1px solid hsl(${c}/0.28)` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${c})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-[0.14em] leading-none mb-0.5"
                style={{ color: `hsl(${c}/0.6)` }}>{spec.label}</p>
              <p className="text-sm font-bold text-foreground truncate leading-tight">{spec.value}</p>
            </div>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: `hsl(${c})`, boxShadow: `0 0 6px hsl(${c})` }} />
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-1"
              style={{ background: 'hsl(var(--muted)/0.7)', border: `1px solid hsl(${c}/0.18)` }}>
              <X className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Scrollable body */}
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>

            {/* Image — compact 16:9-ish ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56%', background: 'hsl(var(--muted)/0.3)', flexShrink: 0 }}>
              <img src={spec.image} alt={spec.value}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ padding: '12px' }} />
              <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                style={{ background: 'linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)' }} />
            </div>

            {/* Info body */}
            <div className="px-4 pb-3 pt-2 flex flex-col gap-2.5">
              <div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{spec.value}</h3>
                {spec.detail && (
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-relaxed">{spec.detail}</p>
                )}
              </div>

              {spec.specLines && spec.specLines.length > 0 && (
                <div className="rounded-xl overflow-hidden"
                  style={{ background: 'hsl(var(--muted)/0.3)', border: `1px solid hsl(${c}/0.1)` }}>
                  <div className="flex items-center gap-2 px-3 py-1.5"
                    style={{ borderBottom: `1px solid hsl(${c}/0.1)`, background: `hsl(${c}/0.05)` }}>
                    <Info className="w-3 h-3 flex-shrink-0" style={{ color: `hsl(${c})` }} />
                    <span className="text-[9px] font-mono uppercase tracking-[0.14em]"
                      style={{ color: `hsl(${c}/0.75)` }}>Specifications</span>
                  </div>
                  {spec.specLines.map((line, i) => {
                    const colonIdx = line.indexOf(':');
                    const key = colonIdx !== -1 ? line.slice(0, colonIdx).trim() : line;
                    const val = colonIdx !== -1 ? line.slice(colonIdx + 1).trim() : '';
                    return (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5"
                        style={{
                          borderTop: i > 0 ? '1px solid hsl(var(--border)/0.25)' : undefined,
                          background: i % 2 === 0 ? 'transparent' : 'hsl(var(--muted)/0.2)',
                        }}>
                        <span className="text-[10px] text-muted-foreground/55 font-mono">{key}</span>
                        <span className="text-[10px] font-semibold text-foreground/85 font-mono text-right ml-3 max-w-[55%]"
                          style={{ wordBreak: 'break-word' }}>{val || key}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {(spec.priceRp || spec.priceUsd) && (
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: `hsl(${c}/0.07)`, border: `1px solid hsl(${c}/0.18)` }}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3" style={{ color: `hsl(${c})` }} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/55">Est. Price</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {spec.priceRp && (
                      <span className="text-sm font-bold" style={{ color: `hsl(${c})` }}>{spec.priceRp}</span>
                    )}
                    {spec.priceRp && spec.priceUsd && (
                      <span className="text-muted-foreground/30 text-xs font-mono">/</span>
                    )}
                    {spec.priceUsd && (
                      <span className="text-xs font-semibold text-muted-foreground/70 font-mono">{spec.priceUsd}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom accent line */}
          <div style={{
            height: '1px',
            flexShrink: 0,
            background: `linear-gradient(90deg, transparent, hsl(${c}/0.25), transparent)`,
          }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Terminal Boot ────────────────────────────────────────────────────────────
function TerminalBoot({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const ref  = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < BOOT_LINES.length) { setLines(p => [...p, BOOT_LINES[i++]]); }
      else { clearInterval(id); if (!done.current) { done.current = true; setTimeout(onDone, 400); } }
    }, 110);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);

  const lineColor = (l: string) => {
    if (l.startsWith('✓'))                      return '#22c55e';
    if (l.startsWith('>') || l.startsWith('$')) return 'hsl(var(--primary))';
    if (l.startsWith('  └─'))                   return 'hsl(var(--muted-foreground))';
    if (l.includes('[OK]'))                      return 'hsl(var(--muted-foreground)/0.75)';
    return 'hsl(var(--muted-foreground)/0.55)';
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-2xl" style={{ maxWidth: '100%', minWidth: 0 }}>
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/40">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
        <span className="ml-2 text-xs font-mono text-muted-foreground">system-detect.sh</span>
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
            <span className="block w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 6px hsl(var(--primary))' }} />
          </motion.div>
          <span className="text-[10px] font-mono text-primary/60">RUNNING</span>
        </div>
      </div>
      <div ref={ref} className="p-5 font-mono text-xs space-y-1 h-52 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {lines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}
            style={{ color: lineColor(line), wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
            {line.includes('[OK]')
              ? <><span>{line.replace('[OK]', '')}</span><span style={{ color: '#22c55e' }}>[OK]</span></>
              : line}
          </motion.div>
        ))}
        {lines.length < BOOT_LINES.length && (
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.65, repeat: Infinity }}
            className="inline-block w-2 h-3 bg-primary align-middle" />
        )}
      </div>
    </div>
  );
}

// ─── Neofetch Panel ───────────────────────────────────────────────────────────
function NeofetchPanel() {
  const rows = [
    { label: 'hostname', value: 'BadutZY-PC',    color: 'hsl(var(--primary))'          },
    { label: 'os',       value: 'Windows 10',    color: 'hsl(220 80% 60%)'             },
    { label: 'arch',     value: 'x86_64',        color: 'hsl(var(--muted-foreground))' },
    { label: 'cpu',      value: 'Intel i5-4590', color: 'hsl(200 100% 52%)'            },
    { label: 'gpu',      value: 'GTX 950 2GB',   color: 'hsl(120 100% 42%)'            },
    { label: 'memory',   value: '16 GB DDR3',    color: 'hsl(270 100% 62%)'            },
    { label: 'storage',  value: '1.76 TB',       color: 'hsl(30 100% 52%)'             },
    { label: 'status',   value: 'Online',        color: '#22c55e'                      },
  ];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 overflow-hidden shadow-2xl h-full"
      style={{ boxShadow: '0 0 40px hsl(var(--primary)/0.07)' }}>
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/40">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
        <span className="ml-2 text-xs font-mono text-muted-foreground">system-specs.sh</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="block w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #22c55e' }} />
          <span className="text-[10px] font-mono text-green-500/70">COMPLETE</span>
        </div>
      </div>
      <div className="p-5 font-mono text-xs space-y-2">
        {rows.map((row, i) => (
          <motion.div key={row.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }} className="flex items-center gap-3">
            <span className="text-muted-foreground/40 w-16 flex-shrink-0">{row.label}:</span>
            <span style={{ color: row.color }} className="font-medium">{row.value}</span>
          </motion.div>
        ))}
        <div className="pt-2 mt-1 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground/50">Status: </span>
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#22c55e' }}>
              All systems nominal
            </motion.span>
          </div>
        </div>
        <div className="flex gap-1.5 pt-2">
          {['200 100% 52%','120 100% 42%','270 100% 62%','0 100% 52%','30 100% 52%','50 100% 52%','180 100% 48%','290 70% 58%'].map(c => (
            <div key={c} className="w-5 h-5 rounded-sm flex-shrink-0"
              style={{ background: `hsl(${c})`, boxShadow: `0 0 6px hsl(${c}/0.5)` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Spec Card ────────────────────────────────────────────────────────────────
interface SpecCardProps {
  spec: SpecItem;
  index: number;
  showPhoto: boolean;       // controlled by parent toggle
  onOpenModal: (spec: SpecItem) => void;
}

function SpecCard({ spec, index, showPhoto, onOpenModal }: SpecCardProps) {
  const Icon = spec.icon;
  const [barW, setBarW]       = useState(0);
  const [hovered, setHovered] = useState(false);

  // Image is visible if toggle is ON, or if card is hovered
  const imgVisible = showPhoto || hovered;

  useEffect(() => {
    const t = setTimeout(() => setBarW(spec.perf), 120 + index * 55);
    return () => clearTimeout(t);
  }, [spec.perf, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ cursor: 'default', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        initial={false}
        variants={{
          rest:  { boxShadow: '0 2px 10px rgba(0,0,0,0.2)', borderColor: 'hsl(var(--border) / 0.5)' },
          hover: { boxShadow: `0 14px 40px hsl(${spec.color}/0.22), 0 0 0 1px hsl(${spec.color}/0.18)`, borderColor: `hsl(${spec.color}/0.5)` },
        }}
        whileHover="hover"
        animate="rest"
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ border: '1px solid', background: 'hsl(var(--card) / 0.7)' }}
      >
        <motion.div className="absolute inset-0 pointer-events-none"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.45 }}
          style={{ background: `linear-gradient(145deg, hsl(${spec.color}/0.13) 0%, transparent 60%)` }} />

        <motion.div className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          variants={{ rest: { opacity: 0, scaleX: 0.4 }, hover: { opacity: 1, scaleX: 1 } }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ background: `linear-gradient(90deg, transparent, hsl(${spec.color}), transparent)`, transformOrigin: 'center' }} />

        {[
          { cls: 'top-2 left-2',     borderCls: 'border-l border-t' },
          { cls: 'top-2 right-2',    borderCls: 'border-r border-t' },
          { cls: 'bottom-2 left-2',  borderCls: 'border-l border-b' },
          { cls: 'bottom-2 right-2', borderCls: 'border-r border-b' },
        ].map(({ cls, borderCls }, i) => (
          <motion.div key={i} className={`absolute w-3 h-3 ${cls} ${borderCls} pointer-events-none`}
            variants={{ rest: { opacity: 0, scale: 0.5 }, hover: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            style={{ borderColor: `hsl(${spec.color}/0.55)` }} />
        ))}

        <div className="p-5 relative z-10 flex flex-col gap-3">

          <div className="flex items-center gap-3">
            <motion.div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              variants={{
                rest:  { scale: 1,   rotate: 0,  boxShadow: 'none' },
                hover: { scale: 1.1, rotate: -6, boxShadow: `0 0 18px hsl(${spec.color}/0.35)` },
              }}
              transition={{ duration: 0.4 }}
              style={{ background: `hsl(${spec.color}/0.15)`, border: `1px solid hsl(${spec.color}/0.3)` }}>
              <Icon className="w-5 h-5" style={{ color: `hsl(${spec.color})` }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <motion.span animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                  className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${spec.color})`, boxShadow: `0 0 4px hsl(${spec.color})` }} />
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/55">{spec.label}</span>
              </div>
              <p className="text-sm font-bold text-foreground leading-tight truncate">{spec.value}</p>
            </div>
          </div>

          {spec.detail && <p className="text-[11px] text-muted-foreground leading-relaxed">{spec.detail}</p>}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground/45 uppercase tracking-wider">Rating</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: `hsl(${spec.color})` }}>{spec.perf}%</span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: `${barW}%`,
                background: `linear-gradient(90deg, hsl(${spec.color}/0.75), hsl(${spec.color}))`,
                boxShadow: `0 0 8px hsl(${spec.color}/0.45)`,
                transition: 'width 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }} />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono">
            <motion.div
              variants={{ rest: { x: 0, color: 'hsl(var(--muted-foreground) / 0.3)' }, hover: { x: 4, color: `hsl(${spec.color}/0.8)` } }}
              transition={{ duration: 0.3 }}>
              <ChevronRight className="w-3 h-3" />
            </motion.div>
            <motion.span
              variants={{ rest: { color: 'hsl(var(--muted-foreground) / 0.3)' }, hover: { color: `hsl(${spec.color}/0.8)` } }}
              transition={{ duration: 0.3 }}>
              specs.{spec.label.toLowerCase().replace('motherboard', 'mobo')}
            </motion.span>
          </div>

          {/* ── Image Dropdown — visible on hover OR when toggle is ON ── */}
          <AnimatePresence>
            {imgVisible && (
              <motion.div
                key="img-dropdown"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                transition={{
                  height:  { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.5, ease: 'easeOut' },
                }}
                style={{ overflow: 'hidden' }}
              >
                <div className="pt-2 pb-2.5">
                  <div className="h-px w-full" style={{
                    background: `linear-gradient(90deg, transparent, hsl(${spec.color}/0.18), transparent)`,
                  }} />
                </div>

                <div className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid hsl(${spec.color}/0.22)` }}>
                  <div
                    className="relative w-full group/img"
                    style={{ paddingBottom: '100%', cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => onOpenModal(spec)}
                  >
                    <img
                      src={spec.image}
                      alt={spec.value}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                        maxWidth: '100%',
                        display: 'block',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover/img:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, hsl(${spec.color}/0.12), transparent 60%)`,
                        transition: 'opacity 0.35s ease',
                      }}
                    />
                    {spec.priceRp && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.32 }}
                        className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md"
                        style={{
                          background: 'hsl(var(--card)/0.88)',
                          border: `1px solid hsl(${spec.color}/0.28)`,
                          pointerEvents: 'none',
                        }}>
                        <Tag className="w-2.5 h-2.5" style={{ color: `hsl(${spec.color})` }} />
                        <span className="text-[10px] font-bold font-mono" style={{ color: `hsl(${spec.color})` }}>
                          {spec.priceRp}
                        </span>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, duration: 0.28 }}
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-md backdrop-blur-md"
                      style={{
                        background: 'hsl(var(--card)/0.8)',
                        border: `1px solid hsl(${spec.color}/0.18)`,
                        pointerEvents: 'none',
                      }}>
                      <span className="text-[9px] font-mono" style={{ color: `hsl(${spec.color}/0.75)` }}>
                        tap to expand
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Equipment Section ───────────────────────────────────────────────────
const Equipment = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.02, true);
  const [booted,      setBooted]      = useState(false);
  const [activeGroup, setActiveGroup] = useState('all');
  const [modalSpec,   setModalSpec]   = useState<SpecItem | null>(null);
  const [photosOn,    setPhotosOn]    = useState(() => window.innerWidth < 768);   // ← auto-on on mobile

  const filtered   = activeGroup === 'all' ? specs : specs.filter(s => s.group === activeGroup);
  const openModal  = useCallback((s: SpecItem) => setModalSpec(s), []);
  const closeModal = useCallback(() => setModalSpec(null), []);

  const setupSpec: SpecItem = {
    icon: Monitor,
    label: 'SETUP',
    value: "BadutZY's Battle Station",
    detail: 'Full dual-monitor gaming & coding setup',
    color: '200 100% 52%',
    group: 'peripheral',
    perf: 100,
    image: setupImg,
    priceRp: 'Rp 4.885.000', priceUsd: '$288',
    specLines: [
      'Primary: HIKVISION 22" FHD 100Hz',
      'Secondary: ACER 19" HD 60Hz',
      'CPU: Intel Core i5-4590',
      'GPU: GeForce GTX 950 2GB',
      'RAM: 16GB DDR3 1280MHz',
    ],
  };

  return (
    <section
      id="equipment"
      className="relative overflow-hidden py-20 md:py-32"
      role="region"
      aria-labelledby="equipment-title"
      style={{ maxWidth: '100vw' }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.035]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, hsl(270 100% 60%), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-20 relative z-10">

        {/* Heading */}
        <div ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Battle Station</span>
          </div>
          <h2 id="equipment-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">
            My <span className="text-gradient">Equipment</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            The battle station behind every line of code.
          </p>
        </div>

        {/* Neofetch / Terminal + Setup Photo */}
        <div className={`grid lg:grid-cols-2 gap-6 mb-16 transition-all duration-700 delay-100 min-w-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {!booted ? <TerminalBoot onDone={() => setBooted(true)} /> : <NeofetchPanel />}

          {/* ── Setup photo: clean hover zoom, NO icon overlay ── */}
          <motion.div
            className={`relative rounded-2xl overflow-hidden border border-border/40 bg-card/40 shadow-2xl group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => openModal(setupSpec)}
            style={{ aspectRatio: '16/9' }}
          >
            <ImageWithSkeleton
              src={setupImg} alt="My setup"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              skeletonClassName="rounded-none"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
            {/* Subtle tint on hover — no icon */}
            <div
              className="absolute inset-0 transition-opacity duration-400 pointer-events-none opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(160deg, hsl(var(--primary)/0.06) 0%, transparent 60%)' }}
            />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border/40">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-foreground/80">live setup</span>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border/40">
                <span className="text-[10px] font-mono text-muted-foreground">my_setup.jpg</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-foreground/70">BadutZY's Battle Station</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cards section */}
        {booted && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* ── Filter bar ── */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mr-1">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-primary">filter</span>
              </div>
              {GROUPS.map(grp => {
                const GrpIcon = grp.icon;
                const isActive = activeGroup === grp.key;
                const count = grp.key === 'all' ? specs.length : specs.filter(s => s.group === grp.key).length;
                return (
                  <button key={grp.key} onClick={() => setActiveGroup(grp.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                        : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                    }`}>
                    <GrpIcon className="w-3 h-3" />
                    {grp.label}
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              <div className="ml-auto text-[11px] font-mono text-muted-foreground/35">
                {filtered.length} component{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* ── Photo toggle row ── */}
            <div className="flex items-center gap-3 mb-8">
              <PhotoToggle enabled={photosOn} onToggle={() => setPhotosOn(p => !p)} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={photosOn ? 'on' : 'off'}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.22 }}
                  className="text-[11px] font-mono"
                  style={{ color: photosOn ? 'hsl(var(--primary)/0.7)' : 'hsl(var(--muted-foreground)/0.4)' }}
                >
                  {photosOn ? 'showing all photos' : 'hover to preview'}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* ── Cards grid ── */}
            <AnimatePresence mode="wait">
              <motion.div key={activeGroup}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden min-w-0">
                {filtered.map((spec, i) => (
                  <SpecCard
                    key={spec.label}
                    spec={spec}
                    index={i}
                    showPhoto={photosOn}
                    onOpenModal={openModal}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Status bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 p-5">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="block w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #22c55e' }} />
                  </motion.span>
                  <span>Status: <span className="text-foreground font-semibold">Online</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span>OS: <span className="text-foreground font-semibold">Windows 10 x86_64</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-primary" />
                  <span>CPU: <span className="text-foreground font-semibold">i5-4590 @ 3.30GHz</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-primary" />
                  <span>Storage: <span className="text-foreground font-semibold">1.76 TB</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Components: <span className="text-foreground font-semibold">{specs.length} detected</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {modalSpec && <PhotoModal spec={modalSpec} onClose={closeModal} />}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  );
};

export default Equipment;