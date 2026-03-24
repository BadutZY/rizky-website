import { motion } from 'framer-motion';
import { Download, Monitor, Gamepad2, ExternalLink, Zap } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────
export interface GameProject {
  id: number;
  title: string;
  category: 'Game';
  lang: string;
  image: string;
  video?: string;
  link: string;
  description: string;
  fullDescription: string;
  downloadFile?: string;
  genre?: string[];
  platform?: string[];
  engine?: string;
  version?: string;
  fileSize?: string;
  features?: string[];
  markdownFile?: string;
  minSpecs?: {
    os?: string;
    processor?: string;
    memory?: string;
    graphics?: string;
    storage?: string;
  };
}

interface GameCardProps {
  project: GameProject;
  index: number;
  isVisible: boolean;
  onClick: () => void;
}

// ── Genre color map ────────────────────────────────────────────────────
const GENRE_COLORS: Record<string, string> = {
  Action:    'bg-red-500/20 text-red-400 border-red-500/30',
  Strategy:  'bg-sky-500/20 text-sky-400 border-sky-500/30',
  RPG:       'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Puzzle:    'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PvP:       'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Adventure: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Arcade:    'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Casual:    'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Indie:     'bg-lime-500/20 text-lime-400 border-lime-500/30',
};

// ── Main Card Component ────────────────────────────────────────────────
const GameCard = ({ project, index, isVisible, onClick }: GameCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.97 }}
      transition={{ delay: index * 0.13, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)/0.6) 0%, hsl(var(--primary)/0.1) 50%, hsl(var(--primary)/0.4) 100%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Card shell */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border/40 bg-card/60
        group-hover:border-transparent transition-all duration-500 ease-out"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* ── Video or image background ───────────────────── */}
        {project.video ? (
          <video
            src={project.video}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        )}

        {/* Scanline texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-background/10" />
        <div className="absolute inset-0 bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Neon side accent */}
        <div
          className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--primary)), transparent)' }}
        />

        {/* Top-right badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {project.platform?.map((p) => (
            <span key={p}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                bg-background/70 backdrop-blur-md border border-border/50 text-muted-foreground">
              <Monitor className="w-3 h-3" />
              {p}
            </span>
          ))}
          {project.engine && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-background/70 backdrop-blur-md border border-border/50 text-muted-foreground">
              {project.engine}
            </span>
          )}
        </div>

        {/* Top-left GAME badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold
            bg-primary/20 backdrop-blur-md border border-primary/40 text-primary tracking-wider uppercase">
            <Gamepad2 className="w-3 h-3" />
            Game
          </span>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-all duration-400 delay-75 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-all duration-400 delay-75 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-all duration-400 delay-75 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-all duration-400 delay-75 rounded-br-sm" />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {project.genre?.map((g) => (
              <span key={g}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm tracking-wide
                  ${GENRE_COLORS[g] || 'bg-primary/20 text-primary border-primary/30'}`}>
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight mb-0.5
                group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground/80 truncate">{project.description}</p>
            </div>

            <div
              className="flex-shrink-0 flex items-center gap-2
                translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-400 ease-out"
            >
              {project.downloadFile && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
                  bg-primary text-primary-foreground shadow-[0_0_16px_-2px_hsl(var(--primary)/0.6)]">
                  View More
                </div>
              )}
              <div className="p-2 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {project.version && (
            <div className="flex items-center gap-1.5 mt-2">
              <Zap className="w-2.5 h-2.5 text-primary/60" />
              <span className="text-[10px] text-muted-foreground/60 font-mono">v{project.version}</span>
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)/0.8), transparent)' }}
        />
      </div>
    </motion.div>
  );
};

export default GameCard;