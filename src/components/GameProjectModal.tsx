import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Download, Monitor, Gamepad2, Code2, ExternalLink,
  ChevronRight, Zap, CheckCircle2, Layers, Cpu, HardDrive,
  MemoryStick, Users, Globe, GitFork, Building2
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { GameProject, SocialLink, TeamMember } from './GameCard';

interface GameProjectModalProps {
  project: GameProject | null;
  onClose: () => void;
}

const GENRE_COLORS: Record<string, string> = {
  Action:    'bg-red-500/15 text-red-400 border-red-500/25',
  Strategy:  'bg-sky-500/15 text-sky-400 border-sky-500/25',
  PvP:       'bg-orange-500/15 text-orange-400 border-orange-500/25',
  RPG:       'bg-violet-500/15 text-violet-400 border-violet-500/25',
  Puzzle:    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Shooter:   'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Adventure: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Arcade:    'bg-pink-500/15 text-pink-400 border-pink-500/25',
  Casual:    'bg-teal-500/15 text-teal-400 border-teal-500/25',
  Indie:     'bg-lime-500/15 text-lime-400 border-lime-500/25',
};

const TECH_LOGOS: Record<string, string> = {
  'C#':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'Unity':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
  'C++':    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Godot':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg',
  'Unreal': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg',
  'Blender':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
};

// ── Social media icon + config ─────────────────────────────────────────
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.55V6.78a4.85 4.85 0 0 1-1.07-.09z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const SOCIAL_META: Record<SocialLink['platform'], {
  label: string;
  hoverClass: string;
  icon: React.ReactNode;
}> = {
  youtube:   { label: 'YouTube',   hoverClass: 'hover:bg-red-500/15 hover:border-red-500/35 hover:text-red-400',      icon: <YouTubeIcon /> },
  tiktok:    { label: 'TikTok',    hoverClass: 'hover:bg-pink-500/15 hover:border-pink-500/35 hover:text-pink-400',   icon: <TikTokIcon /> },
  instagram: { label: 'Instagram', hoverClass: 'hover:bg-purple-500/15 hover:border-purple-500/35 hover:text-purple-400', icon: <InstagramIcon /> },
  github:    { label: 'GitHub',    hoverClass: 'hover:bg-foreground/10 hover:border-foreground/30 hover:text-foreground', icon: <GitHubIcon /> },
  website:   { label: 'Website',   hoverClass: 'hover:bg-primary/15 hover:border-primary/35 hover:text-primary',       icon: <Globe className="w-3.5 h-3.5" /> },
};

// ── Helper: trigger file download ──────────────────────────────────────
function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Social pill button ─────────────────────────────────────────────────
const SocialPill = ({ social }: { social: SocialLink }) => {
  const meta = SOCIAL_META[social.platform];
  if (!meta) return null;
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${meta.label}${social.label ? ` · ${social.label}` : ''}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium
        border border-border/40 bg-muted/25 text-muted-foreground
        transition-all duration-200 ${meta.hoverClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      {meta.icon}
      <span className="leading-none">{social.label ?? meta.label}</span>
    </a>
  );
};

// ── Team Member card ───────────────────────────────────────────────────
const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const hasSocials = (member.socials?.length ?? 0) > 0;

  // flatten all socials preserving order
  const allSocials = member.socials ?? [];

  return (
    <div
      className="group flex flex-col gap-3 p-4 rounded-2xl border border-border/40
        bg-gradient-to-b from-card/80 to-muted/10
        hover:border-primary/35 hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.25)]
        transition-all duration-300"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border/50
              group-hover:border-primary/40 transition-colors duration-300 flex-shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center
              text-xs font-bold flex-shrink-0
              bg-gradient-to-br from-primary/25 to-primary/5
              border-2 border-border/50 group-hover:border-primary/40
              text-primary transition-colors duration-300"
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">{member.name}</p>
          {member.role && (
            <p className="text-[11px] text-muted-foreground/65 truncate mt-0.5 leading-tight">
              {member.role}
            </p>
          )}
        </div>
      </div>

      {/* Socials */}
      {hasSocials && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/25">
          {allSocials.map((s, i) => (
            <SocialPill key={`${s.platform}-${i}`} social={s} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Modal ────────────────────────────────────────────────────────
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

  const team = project.developerTeam;
  const hasTeam = !!team;
  const hasMembers = (team?.members?.length ?? 0) > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/92 backdrop-blur-md transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal shell */}
      <div
        className={`relative w-full max-w-3xl flex flex-col bg-card border border-border/50 rounded-3xl shadow-2xl
          overflow-hidden transition-all duration-500
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
        style={{ maxHeight: 'min(92vh, 940px)' }}
      >
        {/* Top glow line */}
        <div
          className={`absolute top-0 left-12 right-12 h-px transition-opacity duration-700 z-10
            ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)/0.7), transparent)' }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-background/70 backdrop-blur-md
            border border-border/50 text-muted-foreground
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all duration-300 group"
          aria-label="Close"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* ── Hero banner ───────────────────────────────────────── */}
        <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ aspectRatio: '16/6' }}>
          {project.video ? (
            <video
              src={project.video}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700
                ${isVisible ? 'scale-100' : 'scale-110'}`}
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700
                ${isVisible ? 'scale-100' : 'scale-110'}`}
            />
          )}

          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)' }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-transparent to-transparent" />

          {/* Top-left badges */}
          <div className="absolute top-4 left-5 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold
              bg-primary/20 backdrop-blur-md border border-primary/40 text-primary tracking-widest uppercase">
              <Gamepad2 className="w-3.5 h-3.5" />
              Game
            </span>
            {project.isContribution && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold
                bg-primary/90 text-primary-foreground backdrop-blur-md">
                <GitFork className="w-3 h-3" />
                Contribution
              </span>
            )}
          </div>

          {/* Genre tags bottom */}
          <div className="absolute bottom-4 left-5 right-16 flex flex-wrap gap-1.5 z-10">
            {project.genre?.map((g) => (
              <span key={g}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-sm
                  ${GENRE_COLORS[g] || 'bg-primary/15 text-primary border-primary/25'}`}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.3) transparent' }}
        >
          <div className="p-5 md:p-6 space-y-7">

            {/* Title + status */}
            <div>
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

            {/* ── Developer Team banner ─────────────────────────── */}
            {hasTeam && team && (
              <div
                className="relative rounded-2xl overflow-hidden border border-border/40
                  hover:border-primary/35 transition-all duration-300 group/team"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)/0.04) 0%, transparent 60%)',
                }}
              >
                {/* Decorative top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)/0.5), transparent)' }}
                />
                {/* Decorative corner glow */}
                <div
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-0 group-hover/team:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.15) 0%, transparent 70%)' }}
                />

                <div className="relative flex items-center gap-4 p-4 md:p-5">
                  {/* Logo box */}
                  {team.logo ? (
                    <div className="relative flex-shrink-0 w-[60px] h-[60px] md:w-[68px] md:h-[68px]">
                      <div className="w-full h-full rounded-2xl overflow-hidden border border-border/50
                        bg-background/60 flex items-center justify-center shadow-lg
                        group-hover/team:border-primary/40 transition-colors duration-300">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      {/* Subtle glow behind logo */}
                      <div
                        className="absolute inset-1 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-40 transition-opacity duration-500 -z-10 pointer-events-none"
                        style={{ background: 'hsl(var(--primary)/0.5)' }}
                      />
                    </div>
                  ) : (
                    <div className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] rounded-2xl border border-border/50
                      bg-muted/40 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Text info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-primary/55 uppercase tracking-widest mb-1">
                      Developer Team
                    </p>
                    <p className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                      {team.name}
                    </p>
                    {project.role && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <GitFork className="w-3 h-3 text-primary/50 flex-shrink-0" />
                        <span className="text-[11px] text-muted-foreground/70">
                          Role: <span className="text-primary/80 font-semibold">{project.role}</span>
                        </span>
                      </div>
                    )}
                    {hasMembers && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                        <span className="text-[11px] text-muted-foreground/50">
                          {team.members!.length} team {team.members!.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Team website link */}
                  {team.website && (
                    <a
                      href={team.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                        text-xs font-medium border border-border/50 text-muted-foreground
                        hover:text-foreground hover:border-primary/40 hover:bg-primary/5
                        transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Team Site</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5">
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
                Visit Website <ExternalLink className="w-4 h-4" />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              <div>
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
              <div>
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
              <div>
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

            {/* ── Team Members ──────────────────────────────────── */}
            {hasMembers && team?.members && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-3.5 h-3.5 text-primary/70" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Team Members
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold
                    bg-primary/10 text-primary border border-primary/20">
                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {team.members.map((member, i) => (
                    <MemberCard key={i} member={member} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Tech stack */}
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono
                        font-medium bg-muted/60 text-muted-foreground border border-border/60">
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
