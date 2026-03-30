import { motion } from 'framer-motion';
import { Download, Heart, Clock, ExternalLink, Package } from 'lucide-react';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import fabricIcon from '@/assets/loader/fabric.png';
import forgeIcon from '@/assets/loader/forge.png';
import neoforgeIcon from '@/assets/loader/neoforge.png';
import quiltIcon from '@/assets/loader/quilt.png';

// ── Status types & colors ─────────────────────────────────────────────
export type ModStatus = 'public' | 'private' | 'unlisted' | 'under_review';

export const STATUS_CONFIG: Record<ModStatus, { label: string; className: string }> = {
  public:       { label: 'Public',       className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  private:      { label: 'Private',      className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  unlisted:     { label: 'Unlisted',     className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  under_review: { label: 'Under Review', className: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
};

// ── Release type for download entries ────────────────────────────────
export type ReleaseType = 'alpha' | 'beta' | 'release';

export const RELEASE_TYPE_CONFIG: Record<ReleaseType, { label: string; className: string; dotColor: string }> = {
  alpha:   { label: 'Alpha',   className: 'bg-orange-500/15 text-orange-400 border-orange-500/30',  dotColor: 'bg-orange-400' },
  beta:    { label: 'Beta',    className: 'bg-sky-500/15 text-sky-400 border-sky-500/30',            dotColor: 'bg-sky-400' },
  release: { label: 'Release', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dotColor: 'bg-emerald-400' },
};

export interface StaticDownloadEntry {
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  filename: string;
  filePath: string;
  release_type?: ReleaseType; // Alpha, Beta, or Release — manual entry
}

export interface ModProject {
  id: number;
  title: string;
  category: 'Mod';
  lang: string;
  image: string;
  link: string;
  description: string;
  modDescription?: string;
  fullDescription: string;
  markdownFile?: string;
  downloads?: number;
  likes?: number;
  updatedAgo?: string;
  loaders?: string[];
  tags?: string[];
  modIcon?: string;
  versions?: string[];
  slug?: string;
  status?: ModStatus;
  staticDownloads?: StaticDownloadEntry[];
}

interface ModCardProps {
  project: ModProject;
  index: number;
  isVisible: boolean;
  onClick: () => void;
}

const LOADER_COLORS: Record<string, string> = {
  Fabric:   'bg-[#dbb9a1]/15 text-[#dbb9a1] border-[#dbb9a1]/30',
  Forge:    'bg-[#4a86a8]/15 text-[#4a86a8] border-[#4a86a8]/30',
  NeoForge: 'bg-[#f06030]/15 text-[#f06030] border-[#f06030]/30',
  Quilt:    'bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30',
};

const LOADER_ICONS: Record<string, string> = {
  Fabric:   fabricIcon,
  Forge:    forgeIcon,
  NeoForge: neoforgeIcon,
  Quilt:    quiltIcon,
};

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return n.toString();
}

const ModCard = ({ project, index, isVisible, onClick }: ModCardProps) => {
  const tagline = project.modDescription || project.description;
  const statusKey: ModStatus = project.status ?? 'public';
  const status = STATUS_CONFIG[statusKey];

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative w-full cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative flex items-center gap-4 md:gap-5 w-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 md:p-5
          hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.2)]
          transition-all duration-400 ease-out overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 80% at 5% 50%, hsl(var(--primary)/0.05), transparent)' }}
        />

        <div className="relative flex-shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 rounded-xl overflow-hidden border border-border/40 bg-muted">
          {project.modIcon ? (
            <ImageWithSkeleton
              src={project.modIcon}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {project.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border ${status.className}`}>
                {status.label}
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
              {project.downloads !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatDownloads(project.downloads)}</span>
                  {project.likes !== undefined && (
                    <><Heart className="w-3.5 h-3.5 ml-1" /><span className="font-medium">{project.likes}</span></>
                  )}
                </div>
              )}
              {project.updatedAgo && (
                <div className="flex items-center gap-1.5 text-muted-foreground/70">
                  <Clock className="w-3 h-3" />
                  <span>{project.updatedAgo}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-snug mb-3 line-clamp-1">{tagline}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            {project.tags?.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/60">
                {tag}
              </span>
            ))}
            {project.loaders?.map((loader) => (
              <span key={loader}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${LOADER_COLORS[loader] || 'bg-muted/60 text-muted-foreground border-border/60'}`}>
                {LOADER_ICONS[loader] ? (
                  <img src={LOADER_ICONS[loader]} alt={loader} className="w-3 h-3 object-contain" />
                ) : (
                  <span className="text-[10px]">🔧</span>
                )}
                {loader}
              </span>
            ))}
          </div>

          {(project.downloads !== undefined || project.updatedAgo) && (
            <div className="flex sm:hidden items-center gap-3 mt-2 text-xs text-muted-foreground">
              {project.downloads !== undefined && (
                <div className="flex items-center gap-1"><Download className="w-3 h-3" /><span>{formatDownloads(project.downloads)}</span></div>
              )}
              {project.likes !== undefined && (
                <div className="flex items-center gap-1"><Heart className="w-3 h-3" /><span>{project.likes}</span></div>
              )}
              {project.updatedAgo && (
                <div className="flex items-center gap-1 text-muted-foreground/70"><Clock className="w-3 h-3" /><span>{project.updatedAgo}</span></div>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 hidden md:flex items-center">
          <div className="w-8 h-8 rounded-xl border border-border/40 bg-background/40 flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>

        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export default ModCard;