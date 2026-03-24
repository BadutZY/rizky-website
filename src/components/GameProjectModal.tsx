import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Download, Monitor, Gamepad2, Code2, ExternalLink,
  ChevronRight, Zap, CheckCircle2, Layers, Cpu, HardDrive, MemoryStick
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { GameProject } from './GameCard';

interface GameProjectModalProps {
  project: GameProject | null;
  onClose: () => void;
}

const GENRE_COLORS: Record<string, string> = {
  Action:    'bg-red-500/15 text-red-400 border-red-500/25',
  Strategy:  'bg-sky-500/15 text-sky-400 border-sky-500/25',
  PvP:       'bg-sky-500/15 text-sky-400 border-sky-500/25',
  RPG:       'bg-violet-500/15 text-violet-400 border-violet-500/25',
  Puzzle:    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Shooter:   'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Adventure: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Arcade:    'bg-pink-500/15 text-pink-400 border-pink-500/25',
  Casual:    'bg-teal-500/15 text-teal-400 border-teal-500/25',
  Indie:     'bg-lime-500/15 text-lime-400 border-lime-500/25',
};

// ── Tech stack logos ──────────────────────────────────────────────────
const TECH_LOGOS: Record<string, string> = {
  'C#':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'Unity':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
  'C++':    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Godot':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg',
  'Unreal': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg',
  'Blender':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
};

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const GameProjectModal = ({ project, onClose }: GameProjectModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (project) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      window.addEventListener('keydown', handleEscape);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setDownloading(false);
    } else {
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [project]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDownload = () => {
    if (!project?.downloadFile || downloading) return;
    setDownloading(true);
    triggerDownload(project.downloadFile, `${project.title.replace(/\s+/g, '')}.zip`);
    setTimeout(() => setDownloading(false), 2500);
  };

  if (!project) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/92 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal shell */}
      <div
        className={`relative w-full max-w-3xl flex flex-col bg-card border border-border/50 rounded-3xl shadow-2xl
          overflow-hidden transition-all duration-500
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
        style={{ maxHeight: 'min(92vh, 860px)' }}
      >
        {/* Top glow */}
        <div
          className={`absolute top-0 left-12 right-12 h-px transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)/0.7), transparent)' }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-background/70 backdrop-blur-md border border-border/50
            text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all duration-300 group"
          aria-label="Close"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* ── Hero banner: video or image ────────────────────── */}
        <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ aspectRatio: '16/6' }}>
          {project.video ? (
            <video
              src={project.video}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isVisible ? 'scale-100' : 'scale-110'}`}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isVisible ? 'scale-100' : 'scale-110'}`}
            />
          )}

          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)',
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-transparent to-transparent" />

          {/* GAME badge */}
          <div className="absolute top-4 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold
              bg-primary/20 backdrop-blur-md border border-primary/40 text-primary tracking-widest uppercase">
              <Gamepad2 className="w-3.5 h-3.5" />
              Game
            </span>
          </div>

          {/* Genre tags at bottom of hero */}
          <div className="absolute bottom-4 left-5 right-16 flex flex-wrap gap-1.5 z-10">
            {project.genre?.map((g) => (
              <span key={g}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-sm ${GENRE_COLORS[g] || 'bg-primary/15 text-primary border-primary/25'}`}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.3) transparent' }}
        >
          <div className="p-5 md:p-6">

            {/* Title row */}
            <div className="mb-5">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h3 id="game-modal-title" className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {project.title}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold
                  bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wide">
                  Public
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 mb-7">
              {project.downloadFile && (
                <button
                  onClick={handleDownload}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
                    transition-all duration-300
                    ${downloading
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-primary text-primary-foreground hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)] hover:scale-[1.02]'
                    }`}
                >
                  {downloading ? (
                    <><CheckCircle2 className="w-4 h-4" />Downloading…</>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Game
                      {project.fileSize && <span className="text-xs opacity-70">· {project.fileSize}</span>}
                    </>
                  )}
                </button>
              )}

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                  border border-border/60 text-muted-foreground hover:text-foreground hover:border-border
                  transition-all duration-300"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                  border border-border/60 text-muted-foreground hover:text-foreground hover:border-border
                  transition-all duration-300 ml-auto"
              >
                Close
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
              {project.engine && (
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Engine</span>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{project.engine}</span>
                  </div>
                </div>
              )}
              {project.version && (
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Version</span>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-semibold text-foreground font-mono">{project.version}</span>
                  </div>
                </div>
              )}
              {project.platform && project.platform.length > 0 && (
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Platform</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.platform.map((p) => (
                      <div key={p} className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {project.fileSize && (
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">File Size</span>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{project.fileSize}</span>
                  </div>
                </div>
              )}
              {project.lang && (
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors duration-300 col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Language</span>
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-semibold text-foreground font-mono truncate">{project.lang}</span>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            {(project.markdownFile || project.fullDescription) && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">About</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                {project.markdownFile ? (
                  <MarkdownRenderer content={project.markdownFile} />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.fullDescription}</p>
                )}
              </div>
            )}

            {/* Minimum specs */}
            {project.minSpecs && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Minimum Requirements</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="rounded-xl border border-border/40 bg-muted/20 overflow-hidden">
                  <div className="p-4 space-y-2.5">
                    {[
                      { label: 'OS',        value: project.minSpecs.os,        icon: <Monitor className="w-3.5 h-3.5 text-primary/70" /> },
                      { label: 'Processor', value: project.minSpecs.processor,  icon: <Cpu className="w-3.5 h-3.5 text-primary/70" /> },
                      { label: 'Memory',    value: project.minSpecs.memory,     icon: <MemoryStick className="w-3.5 h-3.5 text-primary/70" /> },
                      { label: 'Graphics',  value: project.minSpecs.graphics,   icon: <Layers className="w-3.5 h-3.5 text-primary/70" /> },
                      { label: 'Storage',   value: project.minSpecs.storage,    icon: <HardDrive className="w-3.5 h-3.5 text-primary/70" /> },
                    ].filter((s) => s.value).map((spec) => (
                      <div key={spec.label} className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 w-24 flex-shrink-0 text-muted-foreground/60">
                          {spec.icon}
                          <span className="text-[11px] font-semibold uppercase tracking-wider">{spec.label}</span>
                        </div>
                        <span className="text-foreground/80">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Features</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.features.map((feature, i) => (
                    <div key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/20 border border-border/30
                        hover:border-primary/25 hover:bg-muted/30 transition-all duration-200">
                      <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech stack with logos */}
            <div className="pt-5 border-t border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tech Stack</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.lang.split(' / ').map((tech) => {
                  const logo = TECH_LOGOS[tech];
                  return (
                    <span key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-muted/60 text-muted-foreground border border-border/60">
                      {logo && (
                        <img src={logo} alt={tech} className="w-4 h-4 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GameProjectModal;