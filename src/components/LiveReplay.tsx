import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  ExternalLink,
  Clock,
  Youtube,
  KeyRound,
  Wifi,
  AlertCircle,
  X,
  Maximize2,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
  useLatestPlaylistVideo,
  type ReplayError,
  type YouTubeVideo,
} from "@/hooks/useLatestPlaylistVideo";
import { YOUTUBE_CONFIG, type PlatformType } from "@/config/youtubeConfig";
import idnLogo from "@/assets/icons/idn-logo.png";
import showroomLogo from "@/assets/icons/showroom-logo.png";

function formatRelativeTime(isoDate: string): string {
  const diff    = Date.now() - new Date(isoDate).getTime();
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor(diff / 3_600_000);
  const minutes = Math.floor(diff / 60_000);
  if (days > 30)
    return new Date(isoDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (days >= 1)    return `${days} days ago`;
  if (hours >= 1)   return `${hours} hours ago`;
  if (minutes >= 1) return `${minutes} minutes ago`;
  return "Just now";
}

function embedUrl(videoId: string): string {
  const p = new URLSearchParams({
    autoplay:       "1",
    rel:            "0",
    modestbranding: "1",
    playsinline:    "1",
    enablejsapi:    "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${p.toString()}`;
}

function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

const PLATFORM = {
  idn: {
    label:       "IDN Live",
    accentColor: "#FF3B5C",
    logo:        idnLogo,
    playlistId:  YOUTUBE_CONFIG.idnPlaylistId,
    playlistUrl: `https://www.youtube.com/playlist?list=${YOUTUBE_CONFIG.idnPlaylistId}`,
  },
  showroom: {
    label:       "Showroom",
    accentColor: "#F97316",
    logo:        showroomLogo,
    playlistId:  YOUTUBE_CONFIG.showroomPlaylistId,
    playlistUrl: `https://www.youtube.com/playlist?list=${YOUTUBE_CONFIG.showroomPlaylistId}`,
  },
} as const satisfies Record<PlatformType, unknown>;

const ERROR_INFO: Record<
  ReplayError,
  { Icon: React.ElementType; title: string; desc: string }
> = {
  no_api_key:       { Icon: KeyRound,    title: "API Key Not Set",  desc: "Add VITE_YOUTUBE_API_KEY in your .env file" },
  quota_exceeded:   { Icon: AlertCircle, title: "API Quota Exceeded",       desc: "Daily YouTube API quota exceeded. Try again tomorrow." },
  invalid_playlist: { Icon: AlertCircle, title: "Invalid Playlist",  desc: "Check the Playlist ID in youtubeConfig.ts" },
  empty_playlist:   { Icon: Youtube,     title: "Empty Playlist",       desc: "No replay videos available yet." },
  timeout:          { Icon: Wifi,        title: "Connection Timeout",       desc: "Could not reach YouTube API. Check your connection." },
  network_error:    { Icon: Wifi,        title: "Failed to Load",          desc: "Network error. Try refreshing." },
  unknown:          { Icon: AlertCircle, title: "An Error Occurred",     desc: "Unable to load video. Please try again." },
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

interface EmbedModalProps {
  video:    YouTubeVideo;
  platform: PlatformType;
  onClose:  () => void;
}

function EmbedModal({ video, platform, onClose }: EmbedModalProps) {
  const cfg = PLATFORM[platform];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="embed-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-3 md:p-6"
      >
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cfg.accentColor + "22" }}
              >
                <img src={cfg.logo} alt={cfg.label} className="w-4 h-4 object-contain" />
              </div>
              <span className="text-white/80 text-sm font-semibold truncate">
                {video.title}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <a
                href={youtubeWatchUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                Open on YouTube
                <ExternalLink size={10} />
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* iframe wrapper */}
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-black"
            style={{
              paddingTop: "56.25%",
              boxShadow:  `0 0 60px ${cfg.accentColor}22, 0 20px 60px rgba(0,0,0,0.6)`,
              border:     `1px solid ${cfg.accentColor}30`,
            }}
          >
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-12 h-12">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: cfg.accentColor + "30" }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-t-transparent"
                      style={{ borderColor: cfg.accentColor }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
                    />
                  </div>
                  <p className="text-white/40 text-xs">Loading video…</p>
                </div>
              </div>
            )}
            <iframe
              src={embedUrl(video.videoId)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: "none", opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}
              onLoad={() => setReady(true)}
            />
          </div>

          <p className="text-center text-white/20 text-[11px] mt-2.5">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/30 text-[10px] font-mono">
              ESC
            </kbd>{" "}
            or click outside to close
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

interface InlineEmbedProps {
  video:       YouTubeVideo;
  accentColor: string;
  onExpand:    () => void;
  onClose:     () => void;
}

function InlineEmbed({ video, accentColor, onExpand, onClose }: InlineEmbedProps) {
  const [ready, setReady] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.85 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.85 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top" }}
      className="relative w-full rounded-xl overflow-hidden bg-black"
    >
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 rounded-xl">
            <motion.div
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: accentColor + "60", borderTopColor: accentColor }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
          </div>
        )}
        <iframe
          src={embedUrl(video.videoId)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
          style={{ border: "none", opacity: ready ? 1 : 0, transition: "opacity 0.25s ease" }}
          onLoad={() => setReady(true)}
        />
      </div>
      <div className="absolute top-2 right-2 flex gap-1.5 z-10">
        <button
          onClick={onExpand}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
          title="Expand"
        >
          <Maximize2 size={12} />
        </button>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
          title="Close player"
        >
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}

interface ReplayCardProps {
  platform: PlatformType;
  delay?:   number;
}

function ReplayCard({ platform, delay = 0 }: ReplayCardProps) {
  const cfg = PLATFORM[platform];
  const { video, loading, error, refresh } = useLatestPlaylistVideo(cfg.playlistId);

  const [imgFailed,    setImgFailed]    = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInline,   setShowInline]   = useState(false);
  const [showModal,    setShowModal]    = useState(false);

  const errInfo = error ? ERROR_INFO[error] : null;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    refresh();
    await new Promise<void>((r) => setTimeout(r, 700));
    setIsRefreshing(false);
  }, [refresh]);

  const handlePlayClick   = useCallback(() => setShowInline(true), []);
  const handleExpand      = useCallback(() => { setShowInline(false); setShowModal(true); }, []);
  const handleCloseInline = useCallback(() => setShowInline(false), []);
  const handleCloseModal  = useCallback(() => setShowModal(false), []);

  return (
    <>
      <AnimatePresence>
        {showModal && video && (
          <EmbedModal video={video} platform={platform} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      <motion.article
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden"
        style={{
          boxShadow: isHovered
            ? `0 16px 48px ${cfg.accentColor}1a, 0 4px 16px rgba(0,0,0,0.2)`
            : "0 4px 16px rgba(0,0,0,0.12)",
          transform:  isHovered && !showInline ? "translateY(-3px)" : "translateY(0)",
          transition: "box-shadow 0.5s ease, transform 0.5s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)`,
            opacity:    isHovered ? 1 : 0.45,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${cfg.accentColor}0c 0%, transparent 55%)`,
            opacity:    isHovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cfg.accentColor + "18" }}
            >
              <img src={cfg.logo} alt={cfg.label} className="w-[18px] h-[18px] object-contain" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold leading-none mb-0.5">
                Latest Replay
              </p>
              <p
                className="text-sm font-bold leading-none"
                style={{ color: cfg.accentColor }}
              >
                {cfg.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Playlist button */}
            <a
              href={cfg.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all duration-200"
              title={`View all ${cfg.label} playlist`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[13px] h-[13px]"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <polygon points="3,6 3,18 6,12" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {video && !loading && !error && (
              <a
                href={youtubeWatchUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all duration-200"
                title="Open on YouTube"
              >
                <ExternalLink size={13} />
              </a>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Refresh"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-border/30 mb-3" />

        {/* Body */}
        <div className="relative flex flex-col flex-1 px-4 pb-4 gap-3">

          {/* LOADING */}
          {loading && (
            <>
              <div className="w-full aspect-video rounded-xl bg-muted/50 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3.5 bg-muted/50 rounded-full animate-pulse w-4/5" />
                <div className="h-3 bg-muted/50 rounded-full animate-pulse w-3/5" />
              </div>
            </>
          )}

          {/* ERROR */}
          {!loading && errInfo && (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: cfg.accentColor + "18" }}
              >
                <errInfo.Icon size={20} style={{ color: cfg.accentColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{errInfo.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[200px] mx-auto">
                  {errInfo.desc}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{ backgroundColor: cfg.accentColor + "18", color: cfg.accentColor }}
              >
                <RefreshCw size={11} />
                Try Again
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {!loading && !error && video && (
            <>
              <AnimatePresence mode="wait">
                {showInline ? (
                  <InlineEmbed
                    key="inline"
                    video={video}
                    accentColor={cfg.accentColor}
                    onExpand={handleExpand}
                    onClose={handleCloseInline}
                  />
                ) : (
                  <motion.div
                    key="thumb"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/40 cursor-pointer group/thumb"
                    onClick={handlePlayClick}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play: ${video.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handlePlayClick();
                    }}
                  >
                    {!imgFailed ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                        onError={() => setImgFailed(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/60">
                        <Youtube size={36} className="text-muted-foreground/30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 transition-colors duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale:   isHovered ? 1 : 0.85,
                          opacity: isHovered ? 1 : 0.7,
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                        style={{ backgroundColor: cfg.accentColor + "dd" }}
                      >
                        <PlayIcon />
                      </motion.div>
                    </div>

                    <div
                      className="absolute top-2 left-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider"
                      style={{ backgroundColor: cfg.accentColor }}
                    >
                      {cfg.label.toUpperCase()}
                    </div>

                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none"
                    >
                      <span className="bg-black/70 text-white/90 text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                        Click to play
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p
                className="text-sm font-semibold text-foreground line-clamp-2 leading-snug"
                title={video.title}
              >
                {video.title}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={11} />
                  <span className="text-[11px]">{formatRelativeTime(video.publishedAt)}</span>
                </div>
                <a
                  href={youtubeWatchUrl(video.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold transition-all duration-200 hover:gap-1.5"
                  style={{ color: cfg.accentColor }}
                >
                  YouTube
                  <ExternalLink size={10} />
                </a>
              </div>
            </>
          )}
        </div>
      </motion.article>
    </>
  );
}

function LiveReplay() {
  return (
    <section className="section-padding overflow-x-hidden relative">
      <div className="container mx-auto px-5 sm:px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-card mb-5">
            <Youtube size={14} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Live Replay
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Watch Replay{" "}
            <span className="text-gradient">Kimmy Live</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Latest Kimmy live replays from IDN Live and Showroom{" "}
            <a
              href={YOUTUBE_CONFIG.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              {YOUTUBE_CONFIG.channelHandle}
            </a>
            .
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto lg:max-w-none">
          <ReplayCard platform="idn"      delay={0.1} />
          <ReplayCard platform="showroom" delay={0.2} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-muted-foreground/40 mt-5"
        >
          Video updates automatically when a new live replay is added to the playlist ·{" "}
          <a
            href={YOUTUBE_CONFIG.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/70 transition-colors duration-200"
          >
            View all on YouTube ↗
          </a>
        </motion.p>

      </div>
    </section>
  );
}

export default LiveReplay;