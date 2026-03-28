import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Cpu, MonitorSpeaker, MemoryStick, HardDrive, Zap,
  CircuitBoard, Box, Fan, Terminal, Monitor, Keyboard,
  Mouse, Headphones, ChevronRight, Activity, Layers, X, ZoomIn,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import setupImg from '@/assets/setup.jpeg';

// ─── Equipment photos ─────────────────────────────────────────────────────────
import cpuImg       from '@/assets/equipment/cpu.png';
import gpuImg       from '@/assets/equipment/gpu.png';
import ramImg       from '@/assets/equipment/ram.png';
import moboImg      from '@/assets/equipment/mobo.png';
import storageImg   from '@/assets/equipment/storage.png';
import psuImg       from '@/assets/equipment/psu.png';
import caseImg      from '@/assets/equipment/case.jpeg';
import coolingImg   from '@/assets/equipment/cooling.webp';
import monitorImg   from '@/assets/equipment/monitor.png';
import keyboardImg  from '@/assets/equipment/keyboard.png';
import mouseImg     from '@/assets/equipment/mouse.png';
import headsetImg   from '@/assets/equipment/headset.png';
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
}

const specs: SpecItem[] = [
  { icon: Cpu,            label: 'CPU',         value: 'Intel Core i5-4590',    detail: '3.30 GHz · 4 Cores / 4 Threads',          color: '200 100% 52%', group: 'core',       perf: 62,  image: cpuImg       },
  { icon: MonitorSpeaker, label: 'GPU',         value: 'GeForce GTX 950',       detail: '2GB GDDR5 · Maxwell Architecture',         color: '120 100% 42%', group: 'core',       perf: 55,  image: gpuImg       },
  { icon: MemoryStick,    label: 'RAM',         value: '2×8 GB DDR3',           detail: '1600 MHz · Dual Channel',                  color: '270 100% 62%', group: 'core',       perf: 80,  image: ramImg       },
  { icon: CircuitBoard,   label: 'MOTHERBOARD', value: 'ASROCK H81M-DGS',       detail: 'LGA 1150 · Micro ATX',                     color: '0   100% 52%', group: 'core',       perf: 70,  image: moboImg      },
  { icon: HardDrive,      label: 'STORAGE',     value: '258GB SSD + 1.5TB HDD', detail: '258GB SSD · 500GB HDD · 1TB HDD',          color: '30  100% 52%', group: 'storage',    perf: 75,  image: storageImg   },
  { icon: Zap,            label: 'PSU',         value: '600W 80+ RGB',          detail: 'White Rated · RGB Illuminated',            color: '50  100% 52%', group: 'power',      perf: 60,  image: psuImg       },
  { icon: Box,            label: 'CASE',        value: 'Standard ATX',          detail: 'Mid Tower · Standard Airflow',             color: '210 18%  52%', group: 'power',      perf: 50,  image: caseImg      },
  { icon: Fan,            label: 'COOLING',     value: 'Cooler Master i30',     detail: 'CPU Cooler + DEEPCOOL XFAN 8CM',           color: '180 100% 48%', group: 'power',      perf: 65,  image: coolingImg   },
  { icon: Monitor,        label: 'MONITOR',     value: 'Dual Monitor Setup',    detail: 'HIKVISION FHD 100Hz · ACER HD 60Hz',       color: '220 80%  58%', group: 'peripheral', perf: 85,  image: monitorImg   },
  { icon: Keyboard,       label: 'KEYBOARD',    value: 'MONSGEEK FUN 60 PRO',   detail: '60% Mechanical Keyboard',                  color: '330 80%  58%', group: 'peripheral', perf: 90,  image: keyboardImg  },
  { icon: Mouse,          label: 'MOUSE',       value: 'MYNK GOZO E',           detail: 'Gaming Mouse',                             color: '160 70%  48%', group: 'peripheral', perf: 85,  image: mouseImg     },
  { icon: Headphones,     label: 'HEADSET',     value: 'Rexus Vonix F29',       detail: 'Gaming Headset',                           color: '290 70%  58%', group: 'peripheral', perf: 78,  image: headsetImg   },
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

// ─── Photo Modal ──────────────────────────────────────────────────────────────
interface PhotoModalProps {
  src: string;
  alt: string;
  color?: string;
  onClose: () => void;
}

function PhotoModal({ src, alt, color = '200 100% 52%', onClose }: PhotoModalProps) {
  // Lock scroll — compensate scrollbar width so page doesn't shift
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow   = document.body.style.overflow;
    const prevPadding    = document.body.style.paddingRight;
    document.body.style.overflow     = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow     = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          // Use 100vw/100vh so the overlay always covers the full monitor viewport,
          // independent of any body padding or page width.
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(16px, 4vw, 40px)',
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          // Compensate the paddingRight we added to body so the modal stays centred
          marginRight: 'calc(-1 * (100vw - 100%))',
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute w-[60vmin] h-[60vmin] rounded-full pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle, hsl(${color}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        <motion.div
          key="modal-image"
          initial={{ scale: 0.82, opacity: 0, y: 24 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{    scale: 0.88, opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-3xl w-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Corner decorations */}
          {[
            'top-0 left-0 border-l-2 border-t-2 rounded-tl-lg',
            'top-0 right-0 border-r-2 border-t-2 rounded-tr-lg',
            'bottom-0 left-0 border-l-2 border-b-2 rounded-bl-lg',
            'bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-6 h-6 ${cls} pointer-events-none`}
              style={{ borderColor: `hsl(${color})`, zIndex: 2 }}
            />
          ))}

          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl border-x border-t"
            style={{
              background: 'hsl(var(--card)/0.9)',
              borderColor: `hsl(${color}/0.35)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${color})`, boxShadow: `0 0 6px hsl(${color})` }} />
              <span className="text-[11px] font-mono text-muted-foreground">{alt}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: 'hsl(var(--muted)/0.6)',
                border: `1px solid hsl(${color}/0.25)`,
              }}
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Image */}
          <div
            className="relative overflow-hidden rounded-b-2xl border-x border-b"
            style={{
              borderColor: `hsl(${color}/0.35)`,
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px hsl(${color}/0.12), 0 0 60px hsl(${color}/0.08)`,
            }}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-auto block"
              style={{ maxHeight: '75vh', objectFit: 'contain', background: 'hsl(var(--card))' }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{ background: `linear-gradient(to top, hsl(${color}/0.08), transparent)` }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Terminal Boot ─────────────────────────────────────────────────────────────
function TerminalBoot({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const ref  = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(p => [...p, BOOT_LINES[i++]]);
      } else {
        clearInterval(id);
        if (!done.current) { done.current = true; setTimeout(onDone, 400); }
      }
    }, 110);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  const lineColor = (l: string) => {
    if (l.startsWith('✓'))            return '#22c55e';
    if (l.startsWith('>') || l.startsWith('$')) return 'hsl(var(--primary))';
    if (l.startsWith('  └─'))         return 'hsl(var(--muted-foreground))';
    if (l.includes('[OK]'))           return 'hsl(var(--muted-foreground)/0.75)';
    return 'hsl(var(--muted-foreground)/0.55)';
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-2xl">
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
      <div ref={ref} className="p-5 font-mono text-xs space-y-1 h-52 overflow-y-auto scrollbar-hide">
        {lines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}
            style={{ color: lineColor(line) }}>
            {line.includes('[OK]') ? (
              <><span>{line.replace('[OK]', '')}</span><span style={{ color: '#22c55e' }}>[OK]</span></>
            ) : line}
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

// ─── Neofetch Panel ────────────────────────────────────────────────────────────
function NeofetchPanel() {
  const rows = [
    { label: 'hostname', value: 'BadutZY-PC',     color: 'hsl(var(--primary))'  },
    { label: 'os',       value: 'Windows 10',     color: 'hsl(220 80% 60%)'     },
    { label: 'arch',     value: 'x86_64',         color: 'hsl(var(--muted-foreground))' },
    { label: 'cpu',      value: 'Intel i5-4590',  color: 'hsl(200 100% 52%)'    },
    { label: 'gpu',      value: 'GTX 950 2GB',    color: 'hsl(120 100% 42%)'    },
    { label: 'memory',   value: '16 GB DDR3',     color: 'hsl(270 100% 62%)'    },
    { label: 'storage',  value: '1.76 TB',        color: 'hsl(30 100% 52%)'     },
    { label: 'status',   value: 'Online',         color: '#22c55e'              },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 overflow-hidden shadow-2xl h-full"
      style={{ boxShadow: '0 0 40px hsl(var(--primary)/0.07)' }}
    >
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
          <motion.div key={row.label}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-center gap-3">
            <span className="text-muted-foreground/40 w-16 flex-shrink-0">{row.label}:</span>
            <span style={{ color: row.color }} className="font-medium">{row.value}</span>
          </motion.div>
        ))}
        <div className="pt-2 mt-1 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground/50">Status: </span>
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ color: '#22c55e' }}>
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
  onOpenModal: (src: string, alt: string, color: string) => void;
}

function SpecCard({ spec, index, onOpenModal }: SpecCardProps) {
  const Icon = spec.icon;
  const [barW, setBarW]       = useState(0);
  const [hovered, setHovered] = useState(false);

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
      style={{ cursor: 'default' }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        initial={false}
        variants={{
          rest: {
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            borderColor: 'hsl(var(--border) / 0.5)',
          },
          hover: {
            boxShadow: `0 14px 40px hsl(${spec.color}/0.22), 0 0 0 1px hsl(${spec.color}/0.18)`,
            borderColor: `hsl(${spec.color}/0.5)`,
          },
        }}
        whileHover="hover"
        animate="rest"
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          border: '1px solid',
          background: 'hsl(var(--card) / 0.7)',
        }}
      >
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.35 }}
          style={{ background: `linear-gradient(145deg, hsl(${spec.color}/0.13) 0%, transparent 60%)` }}
        />

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          variants={{ rest: { opacity: 0, scaleX: 0.4 }, hover: { opacity: 1, scaleX: 1 } }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${spec.color}), transparent)`,
            transformOrigin: 'center',
          }}
        />

        {/* Corner brackets */}
        {[
          { cls: 'top-2 left-2',     borderCls: 'border-l border-t' },
          { cls: 'top-2 right-2',    borderCls: 'border-r border-t' },
          { cls: 'bottom-2 left-2',  borderCls: 'border-l border-b' },
          { cls: 'bottom-2 right-2', borderCls: 'border-r border-b' },
        ].map(({ cls, borderCls }, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 ${cls} ${borderCls} pointer-events-none`}
            variants={{ rest: { opacity: 0, scale: 0.5 }, hover: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            style={{ borderColor: `hsl(${spec.color}/0.55)` }}
          />
        ))}

        {/* ── Card body ─────────────────────────────── */}
        <div className="p-5 relative z-10 flex flex-col gap-3">

          {/* Header: icon + label + value */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              variants={{
                rest:  { scale: 1,   rotate: 0,  boxShadow: 'none' },
                hover: { scale: 1.1, rotate: -6, boxShadow: `0 0 18px hsl(${spec.color}/0.35)` },
              }}
              transition={{ duration: 0.35 }}
              style={{
                background: `hsl(${spec.color}/0.15)`,
                border:     `1px solid hsl(${spec.color}/0.3)`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color: `hsl(${spec.color})` }} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                  className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${spec.color})`, boxShadow: `0 0 4px hsl(${spec.color})` }}
                />
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/55">
                  {spec.label}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground leading-tight truncate">
                {spec.value}
              </p>
            </div>
          </div>

          {spec.detail && (
            <p className="text-[11px] text-muted-foreground leading-relaxed">{spec.detail}</p>
          )}

          {/* Performance bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground/45 uppercase tracking-wider">Rating</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: `hsl(${spec.color})` }}>
                {spec.perf}%
              </span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width:      `${barW}%`,
                  background: `linear-gradient(90deg, hsl(${spec.color}/0.75), hsl(${spec.color}))`,
                  boxShadow:  `0 0 8px hsl(${spec.color}/0.45)`,
                  transition: 'width 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            </div>
          </div>

          {/* Specs link row */}
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <motion.div
              variants={{
                rest:  { x: 0, color: 'hsl(var(--muted-foreground) / 0.3)' },
                hover: { x: 4, color: `hsl(${spec.color}/0.8)` },
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
            <motion.span
              variants={{
                rest:  { color: 'hsl(var(--muted-foreground) / 0.3)' },
                hover: { color: `hsl(${spec.color}/0.8)` },
              }}
              transition={{ duration: 0.3 }}
            >
              specs.{spec.label.toLowerCase().replace('motherboard', 'mobo')}
            </motion.span>
          </div>

          {/* ── Hover Image Dropdown ───────────────────────── */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="img-dropdown"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{   opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div
                  className="mt-1 rounded-xl overflow-hidden border relative group/img"
                  style={{ borderColor: `hsl(${spec.color}/0.3)` }}
                >
                  {/* 1:1 aspect ratio container */}
                  <div
                    className="relative w-full cursor-zoom-in"
                    style={{ paddingBottom: '100%' }}
                    onClick={() => onOpenModal(spec.image, spec.value, spec.color)}
                  >
                    <img
                      src={spec.image}
                      alt={spec.value}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    {/* Color tint overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, hsl(${spec.color}/0.15), transparent 60%)` }}
                    />
                    {/* Zoom hint */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.18, duration: 0.25 }}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-sm"
                      style={{
                        background: `hsl(${spec.color}/0.2)`,
                        border: `1px solid hsl(${spec.color}/0.35)`,
                      }}
                    >
                      <ZoomIn className="w-3 h-3" style={{ color: `hsl(${spec.color})` }} />
                      <span className="text-[9px] font-mono" style={{ color: `hsl(${spec.color})` }}>zoom</span>
                    </motion.div>
                    {/* Top label */}
                    <div
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-md backdrop-blur-sm"
                      style={{
                        background: 'hsl(var(--card)/0.75)',
                        border: `1px solid hsl(${spec.color}/0.25)`,
                      }}
                    >
                      <span className="text-[9px] font-mono text-muted-foreground">{spec.label.toLowerCase()}.jpg</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ─────────────────────────────────────────────── */}

        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Equipment Section ────────────────────────────────────────────────────
const Equipment = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.02, true);
  const [booted,      setBooted]      = useState(false);
  const [activeGroup, setActiveGroup] = useState('all');
  const [modal, setModal]             = useState<{ src: string; alt: string; color: string } | null>(null);

  const filtered = activeGroup === 'all' ? specs : specs.filter(s => s.group === activeGroup);

  const openModal  = useCallback((src: string, alt: string, color: string) => setModal({ src, alt, color }), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <section
      id="equipment"
      className="relative overflow-hidden py-20 md:py-32"
      role="region"
      aria-labelledby="equipment-title"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.035]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, hsl(270 100% 60%), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-20 relative z-10">

        {/* Section heading */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
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
        <div
          className={`grid lg:grid-cols-2 gap-6 mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {!booted
            ? <TerminalBoot onDone={() => setBooted(true)} />
            : <NeofetchPanel />
          }

          {/* Setup photo — clickable for modal */}
          <motion.div
            className={`relative rounded-2xl overflow-hidden border border-border/40 bg-card/40 shadow-2xl group cursor-zoom-in transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => openModal(setupImg, "BadutZY's Battle Station", '200 100% 52%')}
          >
            <ImageWithSkeleton
              src={setupImg}
              alt="My setup"
              className="w-full h-full object-cover min-h-[260px] transition-transform duration-700 group-hover:scale-[1.04]"
              skeletonClassName="rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />

            {/* Hover zoom overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 border border-white/20">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>

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

        {/* Spec cards grid */}
        {booted && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mr-1">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-primary">filter</span>
              </div>
              {GROUPS.map(grp => {
                const GrpIcon = grp.icon;
                const isActive = activeGroup === grp.key;
                const count = grp.key === 'all' ? specs.length : specs.filter(s => s.group === grp.key).length;
                return (
                  <button
                    key={grp.key}
                    onClick={() => setActiveGroup(grp.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                        : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
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

            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((spec, i) => (
                  <SpecCard key={spec.label} spec={spec} index={i} onOpenModal={openModal} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Status bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <motion.span animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }}>
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

      {/* ── Photo Modal ──────────────────────────────────── */}
      {modal && (
        <PhotoModal
          key="photo-modal"
          src={modal.src}
          alt={modal.alt}
          color={modal.color}
          onClose={closeModal}
        />
      )}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  );
};

export default Equipment;