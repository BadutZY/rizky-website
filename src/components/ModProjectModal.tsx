import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X, ExternalLink, Download, Heart, Clock, Package,
  FileText, ChevronDown, Loader2, AlertCircle, Check,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import type { ModProject, StaticDownloadEntry } from "./ModCard";
import { STATUS_CONFIG } from "./ModCard";
import type { ModStatus } from "./ModCard";
import fabricIcon from '@/assets/loader/fabric.png';
import forgeIcon from '@/assets/loader/forge.png';
import neoforgeIcon from '@/assets/loader/neoforge.png';
import quiltIcon from '@/assets/loader/quilt.png';

interface ModProjectModalProps {
  project: ModProject | null;
  onClose: () => void;
}

const LOADER_COLORS: Record<string, string> = {
  Fabric:   'bg-[#dbb9a1]/15 text-[#dbb9a1] border-[#dbb9a1]/30',
  Forge:    'bg-[#4a86a8]/15 text-[#4a86a8] border-[#4a86a8]/30',
  NeoForge: 'bg-[#f06030]/15 text-[#f06030] border-[#f06030]/30',
  Neoforge: 'bg-[#f06030]/15 text-[#f06030] border-[#f06030]/30',
  Quilt:    'bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30',
};

const LOADER_ICONS: Record<string, string> = {
  Fabric:   fabricIcon,
  Forge:    forgeIcon,
  NeoForge: neoforgeIcon,
  Neoforge: neoforgeIcon,
  Quilt:    quiltIcon,
};

// Tech-stack logo map (loader icons + common tech)
const TECH_ICONS: Record<string, string> = {
  Fabric:   fabricIcon,
  Forge:    forgeIcon,
  NeoForge: neoforgeIcon,
  Neoforge: neoforgeIcon,
  Quilt:    quiltIcon,
  Java:     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
};

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return n.toString();
}

function getSiteName(url: string): string {
  if (url.includes('modrinth')) return 'Modrinth';
  if (url.includes('curseforge')) return 'CurseForge';
  return 'View Site';
}

// ── Modrinth version types ────────────────────────────────────────────
interface ModrinthVersion {
  id: string;
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  date_published: string;
  downloads: number;
  files: { url: string; filename: string; primary: boolean }[];
}

function timeAgoShort(iso: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '—';
  const diff = Date.now() - date.getTime();
  if (diff < 0) return 'just now';
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return 'today';
  if (d < 7)  return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5)  return `${w}w ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

// ── Dropdown filter component (portal + RAF tracking) ──
interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}

const FilterDropdown = ({ label, options, selected, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const track = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPos((prev) => {
          const newTop = rect.bottom + 6;
          const newLeft = rect.left;
          if (prev.top === newTop && prev.left === newLeft) return prev;
          return { top: newTop, left: newLeft };
        });
      }
      rafRef.current = requestAnimationFrame(track);
    };
    rafRef.current = requestAnimationFrame(track);

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  const isActive = selected.length > 0;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
          ${isActive
            ? 'bg-primary/15 border-primary/40 text-primary'
            : 'bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
          }`}
      >
        <SlidersHorizontal className="w-3 h-3" />
        {label}
        {isActive && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed z-[9999] min-w-[160px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                {isActive && (
                  <button onClick={() => onChange([])} className="text-[10px] text-primary hover:underline">Clear</button>
                )}
              </div>
              <div className="py-1 max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {options.map((opt) => {
                  const checked = selected.includes(opt);
                  const icon = LOADER_ICONS[opt];
                  return (
                    <button
                      key={opt}
                      onClick={() => toggle(opt)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150
                        ${checked ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
                    >
                      <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all
                        ${checked ? 'bg-primary border-primary' : 'border-border/60'}`}>
                        {checked && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </span>
                      {icon && <img src={icon} alt={opt} className="w-3.5 h-3.5 object-contain flex-shrink-0" />}
                      <span className="font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// ── Tab content animation variants ────────────────────────────────────
const tabContentVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

// ── Static Versions Tab (for non-Modrinth mods) ──────────────────────
const StaticVersionsTab = ({ downloads }: { downloads: StaticDownloadEntry[] }) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);

  const availableGameVersions = useMemo(() => {
    const all = downloads.flatMap((d) => d.game_versions);
    return [...new Set(all)].sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
  }, [downloads]);

  const availableLoaders = useMemo(() => {
    const all = downloads.flatMap((d) => d.loaders);
    return [...new Set(all)].sort();
  }, [downloads]);

  const filtered = useMemo(() => {
    return downloads.filter((d) => {
      const matchV = selectedVersions.length === 0 || d.game_versions.some((gv) => selectedVersions.includes(gv));
      const matchL = selectedLoaders.length === 0 || d.loaders.some((l) => selectedLoaders.includes(l));
      return matchV && matchL;
    });
  }, [downloads, selectedVersions, selectedLoaders]);

  const hasActiveFilters = selectedVersions.length > 0 || selectedLoaders.length > 0;

  const handleDownload = (entry: StaticDownloadEntry) => {
    const link = document.createElement('a');
    link.href = entry.filePath;
    link.download = entry.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="Loader" options={availableLoaders} selected={selectedLoaders} onChange={setSelectedLoaders} />
        <FilterDropdown label="Minecraft Version" options={availableGameVersions} selected={selectedVersions} onChange={setSelectedVersions} />
        {hasActiveFilters && (
          <button onClick={() => { setSelectedVersions([]); setSelectedLoaders([]); }} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-border/30">
        <div className="hidden sm:grid items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60"
          style={{ gridTemplateColumns: '1fr auto auto auto' }}>
          <span>Name</span>
          <span>Game Version</span>
          <span>Loader</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No versions match the current filter.</p>
        ) : (
          filtered.map((entry, idx) => (
            <div key={idx} className="hover:bg-muted/20 transition-colors duration-150 rounded-lg group/row">
              {/* Mobile */}
              <div className="flex sm:hidden items-center gap-3 px-3 py-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{entry.name}</span>
                  <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                    <span>{entry.game_versions.slice(0, 2).join(', ')}</span>
                    <span>·</span>
                    <span>{entry.loaders.join(', ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(entry)}
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
                    bg-primary/10 border border-primary/30 text-primary
                    hover:bg-primary hover:text-primary-foreground hover:border-primary
                    transition-all duration-200"
                  title={`Download ${entry.filename}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden sm:grid items-center gap-3 px-3 py-3" style={{ gridTemplateColumns: '1fr auto auto auto' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">{entry.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/60 hidden lg:inline">{entry.version_number}</span>
                </div>

                <div className="flex flex-wrap gap-1 justify-end">
                  {entry.game_versions.slice(0, 2).map((gv) => (
                    <span key={gv} className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-muted/50 text-muted-foreground border border-border/50">{gv}</span>
                  ))}
                  {entry.game_versions.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-muted/30 text-muted-foreground/60">+{entry.game_versions.length - 2}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 justify-end">
                  {entry.loaders.map((l) => {
                    const icon = LOADER_ICONS[l];
                    return (
                      <span key={l}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border
                          ${LOADER_COLORS[l] || 'bg-muted/60 text-muted-foreground border-border/60'}`}>
                        {icon && <img src={icon} alt={l} className="w-3 h-3 object-contain" />}
                        {l}
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleDownload(entry)}
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
                    bg-primary/10 border border-primary/30 text-primary
                    hover:bg-primary hover:text-primary-foreground hover:border-primary
                    transition-all duration-200"
                  title={`Download ${entry.filename}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Download versions tab (Modrinth) ──────────────────────────────────
const VersionsTab = ({ slug }: { slug: string }) => {
  const [versions, setVersions] = useState<ModrinthVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setSelectedVersions([]);
    setSelectedLoaders([]);
    fetch(`https://api.modrinth.com/v2/project/${slug}/version`, {
      headers: { 'User-Agent': 'portfolio-website/1.0' },
    })
      .then((r) => r.json())
      .then((data: ModrinthVersion[]) => { setVersions(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  const availableGameVersions = useMemo(() => {
    const all = versions.flatMap((v) => v.game_versions);
    return [...new Set(all)].sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
  }, [versions]);

  const availableLoaders = useMemo(() => {
    const all = versions.flatMap((v) =>
      v.loaders.map((l) => l.charAt(0).toUpperCase() + l.slice(1))
    );
    return [...new Set(all)].sort();
  }, [versions]);

  const filteredVersions = useMemo(() => {
    return versions.filter((v) => {
      const matchVersion = selectedVersions.length === 0 || v.game_versions.some((gv) => selectedVersions.includes(gv));
      const matchLoader = selectedLoaders.length === 0 || v.loaders.some((l) => selectedLoaders.includes(l.charAt(0).toUpperCase() + l.slice(1)));
      return matchVersion && matchLoader;
    });
  }, [versions, selectedVersions, selectedLoaders]);

  const hasActiveFilters = selectedVersions.length > 0 || selectedLoaders.length > 0;

  if (loading) return (
    <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">Loading versions…</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-12 gap-2 text-destructive/70">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">Failed to load versions</span>
    </div>
  );

  if (versions.length === 0) return (
    <p className="text-sm text-muted-foreground py-8 text-center">No versions found.</p>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="Loader" options={availableLoaders} selected={selectedLoaders} onChange={setSelectedLoaders} />
        <FilterDropdown label="Minecraft Version" options={availableGameVersions} selected={selectedVersions} onChange={setSelectedVersions} />
        {hasActiveFilters && (
          <button onClick={() => { setSelectedVersions([]); setSelectedLoaders([]); }} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {filteredVersions.length} result{filteredVersions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-border/30">
        <div className="hidden sm:grid items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60"
          style={{ gridTemplateColumns: '1fr auto auto auto auto auto' }}>
          <span>Name</span>
          <span>Game Version</span>
          <span>Loader</span>
          <span>Published</span>
          <span>Downloads</span>
          <span></span>
        </div>

        {filteredVersions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No versions match the current filter.</p>
        ) : (
          filteredVersions.map((v) => {
            const primaryFile = v.files.find((f) => f.primary) ?? v.files[0];
            const loaderDisplay = v.loaders.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');

            return (
              <div key={v.id} className="hover:bg-muted/20 transition-colors duration-150 rounded-lg group/row">
                {/* Mobile */}
                <div className="flex sm:hidden items-center gap-3 px-3 py-3">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{v.name}</span>
                    <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                      <span>{v.game_versions.slice(0, 2).join(', ')}{v.game_versions.length > 2 ? '…' : ''}</span>
                      <span>·</span>
                      <span>{loaderDisplay}</span>
                      <span>·</span>
                      <span>{timeAgoShort(v.date_published)}</span>
                    </div>
                  </div>
                  {primaryFile && (
                    <a href={primaryFile.url} download={primaryFile.filename} onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
                        bg-primary/10 border border-primary/30 text-primary
                        hover:bg-primary hover:text-primary-foreground hover:border-primary
                        transition-all duration-200"
                      title={`Download ${primaryFile.filename}`}>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Desktop */}
                <div className="hidden sm:grid items-center gap-3 px-3 py-3" style={{ gridTemplateColumns: '1fr auto auto auto auto auto' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground truncate">{v.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 hidden lg:inline">{v.version_number}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end">
                    {v.game_versions.slice(0, 2).map((gv) => (
                      <span key={gv} className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-muted/50 text-muted-foreground border border-border/50">{gv}</span>
                    ))}
                    {v.game_versions.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-muted/30 text-muted-foreground/60">+{v.game_versions.length - 2}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end">
                    {v.loaders.map((l) => {
                      const ll = l.charAt(0).toUpperCase() + l.slice(1);
                      const icon = LOADER_ICONS[ll];
                      return (
                        <span key={l}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border
                            ${LOADER_COLORS[ll] || 'bg-muted/60 text-muted-foreground border-border/60'}`}>
                          {icon && <img src={icon} alt={ll} className="w-3 h-3 object-contain" />}
                          {ll}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-[11px] text-muted-foreground whitespace-nowrap text-right">{timeAgoShort(v.date_published)}</span>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-end">
                    <Download className="w-3 h-3" />
                    <span>{formatDownloads(v.downloads)}</span>
                  </div>

                  {primaryFile ? (
                    <a href={primaryFile.url} download={primaryFile.filename} onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
                        bg-primary/10 border border-primary/30 text-primary
                        hover:bg-primary hover:text-primary-foreground hover:border-primary
                        transition-all duration-200"
                      title={`Download ${primaryFile.filename}`}>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ── Main Modal ────────────────────────────────────────────────────────
const ModProjectModal = ({ project, onClose }: ModProjectModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'download'>('description');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (project) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      window.addEventListener("keydown", handleEscape);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setActiveTab('description');
    } else {
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [project]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!project) return null;

  const tagline = project.modDescription || project.description;
  const hasMarkdown = !!project.markdownFile;
  const statusKey: ModStatus = project.status ?? 'public';
  const status = STATUS_CONFIG[statusKey];

  // Derive slug from link for Modrinth version fetching
  const modrinthSlug = project.link.includes('modrinth.com')
    ? project.link.split('/mod/')[1]?.replace(/\/$/, '')
    : null;

  // Check if static downloads are available
  const hasStaticDownloads = project.staticDownloads && project.staticDownloads.length > 0;
  const hasDownloadTab = !!modrinthSlug || hasStaticDownloads;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mod-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl flex flex-col bg-card border border-border/50 rounded-3xl shadow-2xl
          transition-all duration-500
          ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"}`}
        style={{ maxHeight: 'min(92vh, 860px)' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-background/70 backdrop-blur-md border border-border/50
            text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all duration-300 group"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* ── Fixed Header ───────────────────────────── */}
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-border/30 bg-card/80 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {/* Mod icon */}
            <div className="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-border/50 bg-muted">
              {project.modIcon ? (
                <ImageWithSkeleton
                  src={project.modIcon}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-7 h-7 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0 pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 id="mod-modal-title" className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {project.title}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-3 leading-snug">{tagline}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                {project.downloads !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span className="font-semibold text-foreground">{formatDownloads(project.downloads)}</span>
                    <span>downloads</span>
                  </div>
                )}
                {project.likes !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold text-foreground">{project.likes}</span>
                    <span>followers</span>
                  </div>
                )}
                {project.updatedAgo && (
                  <div className="flex items-center gap-1.5 text-muted-foreground/70">
                    <Clock className="w-3 h-3" />
                    <span>Updated {project.updatedAgo}</span>
                  </div>
                )}
              </div>

              {/* Loader + tag badges */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags?.map((tag) => (
                  <span key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/60">
                    {tag}
                  </span>
                ))}
                {project.loaders?.map((loader) => (
                  <span key={loader}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${LOADER_COLORS[loader] || 'bg-muted/60 text-muted-foreground border-border/60'}`}>
                    {LOADER_ICONS[loader] ? (
                      <img src={LOADER_ICONS[loader]} alt={loader} className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      <span className="text-[10px]">🔧</span>
                    )}
                    {loader}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl font-semibold text-sm
                bg-primary text-primary-foreground hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)]
                hover:scale-[1.02] transition-all duration-300"
            >
              View on {getSiteName(project.link)}
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl font-medium text-sm
                border border-border/60 text-muted-foreground hover:text-foreground hover:border-border
                transition-all duration-300"
            >
              Close
            </button>
          </div>

          {/* ── Description / Download tabs ── */}
          <div className="flex gap-1 mt-4 p-1 rounded-xl bg-muted/40 w-fit">
            <button
              onClick={() => { setActiveTab('description'); scrollRef.current && (scrollRef.current.scrollTop = 0); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === 'description'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Description
            </button>
            {hasDownloadTab && (
              <button
                onClick={() => { setActiveTab('download'); scrollRef.current && (scrollRef.current.scrollTop = 0); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${activeTab === 'download'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.3) transparent' }}
        >
          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' ? (
                <motion.div
                  key="description"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {hasMarkdown ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Description</span>
                        <div className="flex-1 h-px bg-border/40" />
                      </div>
                      <MarkdownRenderer content={project.markdownFile!} />
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.fullDescription || project.description}
                    </p>
                  )}

                  {project.versions && project.versions.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-border/30">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Supported Versions</span>
                        <div className="flex-1 h-px bg-border/40" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.versions.map((v) => (
                          <span key={v} className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack with logos */}
                  <div className="mt-6 pt-5 border-t border-border/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tech Stack</span>
                      <div className="flex-1 h-px bg-border/40" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.lang.split(' / ').map((tech) => {
                        const icon = TECH_ICONS[tech];
                        return (
                          <span key={tech}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-muted/60 text-muted-foreground border border-border/60">
                            {icon && (
                              <img src={icon} alt={tech} className="w-3.5 h-3.5 object-contain" />
                            )}
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="download"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">All Versions</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  {modrinthSlug ? (
                    <VersionsTab slug={modrinthSlug} />
                  ) : hasStaticDownloads ? (
                    <StaticVersionsTab downloads={project.staticDownloads!} />
                  ) : (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      Version listing not available for this mod.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModProjectModal;