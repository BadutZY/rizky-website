import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, Tablet, ExternalLink, RefreshCw,
  Globe, ChevronLeft, ChevronRight, Maximize2, X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const PREVIEW_SITES = [
  {
    id:          1,
    title:       'Fritzy Force',
    description: 'Fanbase website rebuild with React & Tailwind',
    url:         'https://fritzyforce.vercel.app/',
    color:       '#8B5CF6',
    badge:       'React · Tailwind · Supabase',
  },
  {
    id:          2,
    title:       'Rizky Website',
    description: 'Personal portfolio website',
    url:         'https://rizky-website.vercel.app/',
    color:       '#3B82F6',
    badge:       'React · TypeScript · Vite',
  },
  {
    id:          3,
    title:       'Box Siege',
    description: 'Game download website for Box Siege',
    url:         'https://box-siege.vercel.app/',
    color:       '#10B981',
    badge:       'Website · Game',
  },
] as const;

type SiteId   = typeof PREVIEW_SITES[number]['id'];
type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_CFG = {
  desktop: { icon: Monitor,    label: 'Desktop', iframeWidth: '100%',   aspect: 56.25  },
  tablet:  { icon: Tablet,     label: 'Tablet',  iframeWidth: '768px',  aspect: 75     },
  mobile:  { icon: Smartphone, label: 'Mobile',  iframeWidth: '390px',  aspect: 177.78 },
} as const;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function FullscreenModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-[99999] flex flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/40 transition-all duration-200">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in new tab</span>
          </a>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200"
            aria-label="Close fullscreen">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <iframe src={url} title={title} className="flex-1 w-full border-none" />
    </motion.div>,
    document.body
  );
}

function PhoneMockup({
  url, title, color, isLoading, refreshKey, direction, onLoad,
}: {
  url: string; title: string; color: string;
  isLoading: boolean; refreshKey: number; direction: number;
  onLoad: () => void;
}) {
  const iframeVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div
        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{
          width: 280,
          background: '#0f1014',
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.6), 0 0 40px ${color}22`,
        }}
      >
        <div className="flex items-center justify-between px-5 py-2 bg-black/60" style={{ height: 32 }}>
          <span className="text-[9px] font-semibold text-white/70 font-mono">9:41</span>
          <div className="w-16 h-4 rounded-full bg-black" />
          <div className="flex items-center gap-1">
            <div className="flex items-end gap-px h-3">
              {[2, 3, 4, 5].map(h => (
                <div key={h} className="w-[2px] rounded-sm bg-white/70" style={{ height: h }} />
              ))}
            </div>
            <div className="w-3.5 h-2.5 rounded-sm border border-white/70 relative">
              <div className="absolute inset-[1.5px] right-[1.5px] rounded-sm bg-white/70" style={{ width: '70%' }} />
              <div className="absolute right-[-3px] top-[3px] w-[2px] h-[5px] rounded-r-sm bg-white/40" />
            </div>
          </div>
        </div>

        <div className="relative bg-white" style={{ paddingTop: `${(530/280)*100}%` }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${url}-${refreshKey}`}
              custom={direction}
              variants={iframeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <iframe
                src={url}
                title={`Preview: ${title}`}
                className="w-full h-full border-none block"
                onLoad={onLoad}
                style={{ pointerEvents: 'auto' }}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                style={{ background: '#0f0f0f' }}
              >
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: color + '40', borderTopColor: color }} />
                  <Globe className="absolute inset-0 m-auto w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] text-white/40 font-mono">Loading…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center py-2 bg-black/40">
          <div className="w-24 h-1 rounded-full bg-white/30" />
        </div>

        <div className="absolute right-[-3px] top-28 w-[3px] h-10 rounded-l-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute left-[-3px] top-20 w-[3px] h-7 rounded-r-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute left-[-3px] top-32 w-[3px] h-7 rounded-r-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute left-[-3px] top-44 w-[3px] h-7 rounded-r-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${color}25`, transition: 'box-shadow 0.4s ease' }}
        />
      </div>
    </div>
  );
}

const LivePreview = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.05, true);
  const [shown,      setShown]      = useState(false);
  const [activeId,   setActiveId]   = useState<SiteId>(1);
  const [viewport,   setViewport]   = useState<Viewport>('desktop');
  const [isLoading,  setIsLoading]  = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [direction,  setDirection]  = useState(0);

  const isMobile = useIsMobile();

  const effectiveViewport: Viewport = isMobile ? 'mobile' : viewport;
  const vpCfg = VIEWPORT_CFG[effectiveViewport];

  if (isVisible && !shown) setShown(true);

  const activeSite  = PREVIEW_SITES.find(s => s.id === activeId)!;
  const activeIndex = PREVIEW_SITES.findIndex(s => s.id === activeId);

  const switchSite = useCallback((id: SiteId, dir: number) => {
    if (id === activeId) return;
    setDirection(dir);
    setActiveId(id);
    setIsLoading(true);
    setRefreshKey(k => k + 1);
  }, [activeId]);

  const handlePrev = useCallback(() => {
    const prev = PREVIEW_SITES[(activeIndex - 1 + PREVIEW_SITES.length) % PREVIEW_SITES.length];
    switchSite(prev.id, -1);
  }, [activeIndex, switchSite]);

  const handleNext = useCallback(() => {
    const next = PREVIEW_SITES[(activeIndex + 1) % PREVIEW_SITES.length];
    switchSite(next.id, 1);
  }, [activeIndex, switchSite]);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft')  handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, handlePrev, handleNext]);

  const iframeVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -32 : 32 }),
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">

      <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${activeSite.color}40, transparent)`, transition: 'all 0.6s ease' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${activeSite.color}08 0%, transparent 70%)`, transition: 'all 0.6s ease' }} />

      <div className="container mx-auto px-6 md:px-10 lg:px-20">

        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <Monitor className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Live Preview</span>
            </div>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">
            Try It <span className="text-gradient">Live</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
            Browse my websites directly.
          </p>
        </motion.div>

        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
              {PREVIEW_SITES.map(site => {
                const isActive = site.id === activeId;
                return (
                  <button
                    key={site.id}
                    onClick={() => switchSite(site.id, site.id > activeId ? 1 : -1)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isActive ? 'text-foreground bg-card' : 'text-muted-foreground bg-card/40 border-border/40 hover:text-foreground'
                    }`}
                    style={{
                      borderColor: isActive ? site.color + '60' : undefined,
                      boxShadow:   isActive ? `0 0 0 1px ${site.color}20` : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: site.color }}
                    />
                    {site.title}
                  </button>
                );
              })}
            </div>

            <PhoneMockup
              url={activeSite.url}
              title={activeSite.title}
              color={activeSite.color}
              isLoading={isLoading}
              refreshKey={refreshKey}
              direction={direction}
              onLoad={() => setIsLoading(false)}
            />

            <div className="flex items-center justify-between mt-4 px-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{activeSite.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activeSite.description}</p>
              </div>

              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  {PREVIEW_SITES.map(site => (
                    <button key={site.id} onClick={() => switchSite(site.id, site.id > activeId ? 1 : -1)} aria-label={site.title}>
                      <motion.span
                        className="block rounded-full"
                        animate={{
                          width:           site.id === activeId ? '16px' : '5px',
                          height:          '5px',
                          backgroundColor: site.id === activeId ? activeSite.color : 'hsl(var(--muted-foreground) / 0.3)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </button>
                  ))}
                </div>
                <button onClick={handlePrev}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-all duration-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNext}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-all duration-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a href={activeSite.url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                  title="Open in new tab">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => { setIsLoading(true); setRefreshKey(k => k + 1); }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 font-mono"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>
        )}

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-2xl"
            style={{
              boxShadow: `0 0 80px -30px ${activeSite.color}25, 0 4px 40px rgba(0,0,0,0.3)`,
              transition: 'box-shadow 0.6s ease',
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/40">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex items-center gap-0.5 ml-1">
                <button onClick={handlePrev} className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground hover:bg-border/60 transition-all duration-150">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleNext} className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground hover:bg-border/60 transition-all duration-150">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-border/40 min-w-0">
                <motion.div animate={{ backgroundColor: activeSite.color }} transition={{ duration: 0.4 }} className="w-2 h-2 rounded-full flex-shrink-0" />
                <span className="text-[11px] font-mono text-muted-foreground truncate">{activeSite.url}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setIsLoading(true); setRefreshKey(k => k + 1); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/60 transition-all duration-200" title="Refresh">
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <a href={activeSite.url} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/60 transition-all duration-200" title="Open in new tab">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => setFullscreen(true)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200" title="Fullscreen">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center bg-muted/40 border-b border-border/40 overflow-x-auto scrollbar-hide">
              <div className="flex items-center flex-shrink-0">
                {PREVIEW_SITES.map(site => {
                  const isActive = site.id === activeId;
                  return (
                    <button key={site.id}
                      onClick={() => switchSite(site.id, site.id > activeId ? 1 : -1)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-r border-border/30 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        isActive ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div layoutId="tab-accent"
                          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                          style={{ backgroundColor: site.color }}
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        />
                      )}
                      <motion.span className="w-2 h-2 rounded-full flex-shrink-0"
                        animate={{ backgroundColor: isActive ? site.color : 'transparent', borderColor: site.color }}
                        style={{ border: `1.5px solid ${site.color}` }}
                        transition={{ duration: 0.2 }}
                      />
                      {site.title}
                    </button>
                  );
                })}
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-1 px-3 py-2 border-l border-border/30 flex-shrink-0">
                {(['desktop', 'tablet', 'mobile'] as Viewport[]).map(vp => {
                  const VPIcon = VIEWPORT_CFG[vp].icon;
                  const isActive = viewport === vp;
                  return (
                    <button key={vp} onClick={() => setViewport(vp)} title={VIEWPORT_CFG[vp].label}
                      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 ${
                        isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-border/60'
                      }`}>
                      <VPIcon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1a1a1a] flex justify-center items-start p-4 md:p-6 min-h-[480px]">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white"
                style={{ width: vpCfg.iframeWidth, maxWidth: '100%' }}
              >
                <div className="relative w-full" style={{ paddingTop: `${vpCfg.aspect}%` }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={`${activeId}-${refreshKey}`}
                      custom={direction}
                      variants={iframeVariants}
                      initial="enter" animate="center" exit="exit"
                      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-0"
                    >
                      <iframe
                        src={activeSite.url}
                        title={`Preview: ${activeSite.title}`}
                        className="w-full h-full border-none block"
                        allow="fullscreen"
                        onLoad={() => setIsLoading(false)}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
                        style={{ background: '#0f0f0f' }}
                      >
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-ping" style={{ animationDuration: '1.5s' }} />
                          <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: activeSite.color + '40', borderTopColor: activeSite.color }} />
                          <Globe className="absolute inset-0 m-auto w-5 h-5" style={{ color: activeSite.color }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-white/60">Loading preview…</p>
                          <p className="text-xs text-white/30 mt-0.5 font-mono">{activeSite.url}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-t border-border/40 bg-muted/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeSite.color + '18' }}>
                  <Globe className="w-4 h-4" style={{ color: activeSite.color }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{activeSite.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground/60">{activeSite.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{activeSite.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  {PREVIEW_SITES.map(site => (
                    <button key={site.id} onClick={() => switchSite(site.id, site.id > activeId ? 1 : -1)} aria-label={site.title}>
                      <motion.span className="block rounded-full"
                        animate={{
                          width: site.id === activeId ? '20px' : '6px',
                          height: '6px',
                          backgroundColor: site.id === activeId ? activeSite.color : 'hsl(var(--muted-foreground) / 0.3)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </button>
                  ))}
                </div>
                <button onClick={handlePrev}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNext}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a href={activeSite.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200">
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {!isMobile && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={shown ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="text-center text-[11px] text-muted-foreground/35 mt-4 font-mono"
          >
            ← → to switch · Click ⤢ for fullscreen · ESC to close
          </motion.p>
        )}
      </div>

      <AnimatePresence>
        {fullscreen && (
          <FullscreenModal url={activeSite.url} title={activeSite.title} onClose={() => setFullscreen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default LivePreview;