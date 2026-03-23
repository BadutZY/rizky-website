import { Youtube, Instagram, Github, ArrowUpRight, Play, Film, RefreshCw, Clock, ExternalLink, Radio } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';
import { useLatestChannelVideo, type VideoType } from '@/hooks/useLatestChannelVideo';
import YouTubeChannelCard from '@/components/YouTubeChannelCard';

const BADUTZY_CHANNEL_HANDLE  = "badutzy";
const BADUTZY_CHANNEL_URL     = "https://www.youtube.com/@badutzy";
const BADUTZY_VIDEOS_URL      = "https://www.youtube.com/@badutzy/videos";
const BADUTZY_SHORTS_URL      = "https://www.youtube.com/@badutzy/shorts";
const BADUTZY_STREAMS_URL     = "https://www.youtube.com/@badutzy/streams";

function formatRelativeTime(isoDate: string): string {
  const diff    = Date.now() - new Date(isoDate).getTime();
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor(diff / 3_600_000);
  const minutes = Math.floor(diff / 60_000);
  if (days > 30) return new Date(isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  if (days >= 1)    return `${days}h lalu`;
  if (hours >= 1)   return `${hours}j lalu`;
  if (minutes >= 1) return `${minutes}m lalu`;
  return "Baru saja";
}

function formatViewCount(count?: string): string {
  if (!count) return "";
  const n = parseInt(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

const CARD_CONFIG = {
  video: {
    label:       "Video Terbaru",
    badge:       "Latest Video",
    accentColor: "#FF0000",
    glowColor:   "rgba(255,0,0,0.25)",
    borderColor: "rgba(255,50,50,0.2)",
    bgGradient:  "linear-gradient(160deg, #1c0808 0%, #0f0f0f 60%, #0a0a0a 100%)",
    playlistUrl: BADUTZY_VIDEOS_URL,
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
        <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
      </svg>
    ),
  },
  short: {
    label:       "Shorts Terbaru",
    badge:       "Latest Short",
    accentColor: "#FF4500",
    glowColor:   "rgba(255,69,0,0.25)",
    borderColor: "rgba(255,80,0,0.2)",
    bgGradient:  "linear-gradient(160deg, #1c0e06 0%, #0f0f0f 60%, #0a0a0a 100%)",
    playlistUrl: BADUTZY_SHORTS_URL,
    icon: () => (
      <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
        <path d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 0 0-3.5-6.61L6.44 5.62A3.74 3.74 0 0 0 5.5 12l1.2.5L5.25 13.2A3.74 3.74 0 0 0 8.75 19.8l8.06-3.17a3.74 3.74 0 0 0 .96-6.31zM10 14.65V9.35L15 12l-5 2.65z" />
      </svg>
    ),
  },
  stream: {
    label:       "Stream Replay",
    badge:       "Stream Replay",
    accentColor: "#FF3B5C",
    glowColor:   "rgba(255,59,92,0.25)",
    borderColor: "rgba(255,59,92,0.2)",
    bgGradient:  "linear-gradient(160deg, #1c0810 0%, #0f0f0f 60%, #0a0a0a 100%)",
    playlistUrl: BADUTZY_STREAMS_URL,
    icon: () => <Radio className="w-3 h-3 text-white" />,
  },
} as const;

const YouTubeCard = ({
  type,
  index,
  isVisible,
}: {
  type:      VideoType;
  index:     number;
  isVisible: boolean;
}) => {
  const cfg = CARD_CONFIG[type];
  const { video, loading, error, refresh } = useLatestChannelVideo(BADUTZY_CHANNEL_HANDLE, type);

  const [active,       setActive]       = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imgFailed,    setImgFailed]    = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const watchUrl = video ? `https://www.youtube.com/watch?v=${video.videoId}` : cfg.playlistUrl;
  const embedSrc = video
    ? `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : "";

  const handleRefresh = async () => {
    setActive(false);
    setImgFailed(false);
    setIsRefreshing(true);
    refresh();
    await new Promise<void>((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  const isShort = type === "short";

  const mediaWrapperStyle: React.CSSProperties = isShort
    ? { position: "relative", width: "100%", paddingTop: "177.78%" }
    : { position: "relative", width: "100%", paddingTop: "56.25%" };

  const errorMsg =
    error === "no_api_key"        ? { title: "API Key belum diatur",    hint: "Tambahkan VITE_YOUTUBE_API_KEY di .env" } :
    error === "quota_exceeded"    ? { title: "Quota API habis",         hint: "Coba lagi besok" } :
    error === "channel_not_found" ? { title: "Channel tidak ditemukan", hint: "Cek BADUTZY_CHANNEL_HANDLE" } :
    error === "no_video_found"    ? { title: "Belum ada video",         hint: "Belum ada konten di kategori ini" } :
                                    { title: "Gagal memuat video",      hint: "Coba refresh" };

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity:         isVisible ? 1 : 0,
        transform:       isVisible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background:  cfg.bgGradient,
          border:      `1px solid ${isHovered ? cfg.accentColor + "40" : cfg.borderColor}`,
          boxShadow:   isHovered
            ? `0 0 0 1px ${cfg.accentColor}20, 0 8px 40px ${cfg.glowColor}, 0 2px 8px rgba(0,0,0,0.6)`
            : "0 4px 24px rgba(0,0,0,0.5)",
          transform:   isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        <div
          className="absolute top-0 inset-x-0 h-[2px] transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)`,
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${cfg.accentColor}, ${cfg.accentColor}aa)`
                  : cfg.accentColor,
                boxShadow: isHovered ? `0 0 12px ${cfg.glowColor}` : "none",
              }}
            >
              <cfg.icon />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/35 font-semibold leading-none mb-0.5">
                @badutzy
              </p>
              <p
                className="text-[11px] font-bold leading-none tracking-wide"
                style={{ color: cfg.accentColor }}
              >
                {cfg.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Refresh"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            {video && !loading && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-all duration-200"
                title="Buka di YouTube"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div style={mediaWrapperStyle}>
          <div className="absolute inset-0 overflow-hidden">

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(10,10,10,0.95)" }}>
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: cfg.accentColor + "20", animationDuration: "1.6s" }} />
                <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: cfg.accentColor + "50", borderTopColor: cfg.accentColor }} />
              </div>
              <p className="text-white/25 text-[11px] tracking-wide">Memuat {cfg.label.toLowerCase()}…</p>
            </div>
          )}

          {!loading && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: "rgba(10,10,10,0.95)" }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: cfg.accentColor + "15", border: `1px solid ${cfg.accentColor}30` }}
              >
                <Youtube className="w-5 h-5" style={{ color: cfg.accentColor + "80" }} />
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold">{errorMsg.title}</p>
                <p className="text-white/25 text-[10px] mt-1">{errorMsg.hint}</p>
              </div>
              {error !== "no_api_key" && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                  style={{ background: cfg.accentColor + "18", color: cfg.accentColor }}
                >
                  <RefreshCw className="w-3 h-3" />
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          {!loading && !error && video && (
            !active ? (
              <button
                onClick={() => setActive(true)}
                className="absolute inset-0 w-full h-full group/play"
                aria-label={`Play ${video.title}`}
              >
                {!imgFailed ? (
                  <img
                    src={
                      isShort
                        ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                        : video.thumbnail
                    }
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105"
                    style={{ filter: "brightness(0.55)" }}
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#111" }}>
                    <Youtube className="w-12 h-12 text-white/10" />
                  </div>
                )}

                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${cfg.accentColor}40 0%, transparent 50%)` }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 35%)" }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center transition-all duration-300 group-hover/play:scale-110"
                    style={{
                      width: "64px", height: "64px",
                      borderRadius: "50%",
                      background: cfg.accentColor,
                      boxShadow: `0 0 0 10px ${cfg.accentColor}20, 0 4px 28px ${cfg.glowColor}`,
                    }}
                  >
                    <Play className="text-white ml-0.5 w-7 h-7" fill="white" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover/play:opacity-100 transition-opacity duration-200">
                  <span className="bg-black/75 text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm tracking-wide">
                    Klik untuk putar
                  </span>
                </div>
              </button>
            ) : (
              <div className="absolute inset-0 bg-black">
                {isShort ? (
                  <iframe
                    src={embedSrc}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                ) : (
                  <iframe
                    src={embedSrc}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                )}
                <button
                  onClick={() => setActive(false)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm z-10"
                  title="Tutup"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )
          )}

          </div>
        </div>

        <div className="px-4 py-3.5">
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-white/8 rounded-full animate-pulse w-4/5" />
              <div className="h-2.5 bg-white/8 rounded-full animate-pulse w-3/5" />
            </div>
          ) : video ? (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-[13px] leading-snug line-clamp-2" title={video.title}>
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase"
                    style={{ background: cfg.accentColor + "20", color: cfg.accentColor, border: `1px solid ${cfg.accentColor}35` }}
                  >
                    {cfg.badge}
                  </span>
                  <div className="flex items-center gap-1 text-white/30">
                    <Clock className="w-2.5 h-2.5" />
                    <span className="text-[10px]">{formatRelativeTime(video.publishedAt)}</span>
                  </div>
                  {video.viewCount && (
                    <span className="text-[10px] text-white/25">{formatViewCount(video.viewCount)}</span>
                  )}
                </div>
              </div>
              <a
                href={cfg.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: cfg.accentColor + "15" }}
                title={`Lihat ${cfg.label}`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const ModrinthIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M12.252.004a11.78 11.768 0 0 0-8.92 3.73 11 10.999 0 0 0-2.17 3.11 11.37 11.359 0 0 0-1.16 5.169c0 1.42.17 2.5.6 3.77.24.759.77 1.899 1.17 2.529a12.3 12.298 0 0 0 8.85 5.639c.44.05 2.54.07 2.76.02.2-.04.22.1-.26-1.7l-.36-1.37-1.01-.06a8.5 8.489 0 0 1-5.18-1.8 5.34 5.34 0 0 1-1.3-1.26c0-.05.34-.28.74-.5a37.572 37.545 0 0 1 2.88-1.629c.03 0 .5.45 1.06.98l1 .97 2.07-.43 2.06-.43 1.47-1.47c.8-.8 1.48-1.5 1.48-1.52 0-.09-.42-1.63-.46-1.7-.04-.06-.2-.03-1.02.18-.53.13-1.2.3-1.45.4l-.48.15-.53.53-.53.53-.93.1-.93.07-.52-.5a2.7 2.7 0 0 1-.96-1.7l-.13-.6.43-.57c.68-.9.68-.9 1.46-1.1.4-.1.65-.2.83-.33.13-.099.65-.579 1.14-1.069l.9-.9-.7-.7-.7-.7-1.95.54c-1.07.3-1.96.53-1.97.53-.03 0-2.23 2.48-2.63 2.97l-.29.35.28 1.03c.16.56.3 1.16.31 1.34l.03.3-.34.23c-.37.23-2.22 1.3-2.84 1.63-.36.2-.37.2-.44.1-.08-.1-.23-.6-.32-1.03-.18-.86-.17-2.75.02-3.73a8.84 8.839 0 0 1 7.9-6.93c.43-.03.77-.08.78-.1.06-.17.5-2.999.47-3.039-.01-.02-.1-.02-.2-.03Zm3.68.67c-.2 0-.3.1-.37.38-.06.23-.46 2.42-.46 2.52 0 .04.1.11.22.16a8.51 8.499 0 0 1 2.99 2 8.38 8.379 0 0 1 2.16 3.449 6.9 6.9 0 0 1 .4 2.8c0 1.07 0 1.27-.1 1.73a9.37 9.369 0 0 1-1.76 3.769c-.32.4-.98 1.06-1.37 1.38-.38.32-1.54 1.1-1.7 1.14-.1.03-.1.06-.07.26.03.18.64 2.56.7 2.78l.06.06a12.07 12.058 0 0 0 7.27-9.4c.13-.77.13-2.58 0-3.4a11.96 11.948 0 0 0-5.73-8.578c-.7-.42-2.05-1.06-2.25-1.06Z" />
  </svg>
);

const CurseForgeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M18.326 9.2145S23.2261 8.4418 24 6.1882h-7.5066V4.4H0l2.0318 2.3576V9.173s5.1267-.2665 7.1098 1.2372c2.7146 2.516-3.053 5.917-3.053 5.917L5.0995 19.6c1.5465-1.4726 4.494-3.3775 9.8983-3.2857-2.0565.65-4.1245 1.6651-5.7344 3.2857h10.9248l-1.0288-3.2726s-7.918-4.6688-.8336-7.1127z" />
  </svg>
);

const gridSocialLinks = [
  { icon: Youtube, href: 'https://www.youtube.com/@badutzy', label: 'YouTube', username: '@badutzy', color: 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' },
  { icon: Instagram, href: 'https://www.instagram.com/rzky.mp_36/', label: 'Instagram', username: '@rzky.mp_36', color: 'hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30' },
  { icon: XIcon, href: 'https://x.com/BadutZYY_', label: 'X', username: '@BadutZYY_', isCustomIcon: true, color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30' },
  { icon: ModrinthIcon, href: 'https://modrinth.com/user/BadutZY', label: 'Modrinth', username: '@BadutZY', isCustomIcon: true, color: 'hover:bg-[#00AF5C]/10 hover:text-[#00AF5C] hover:border-[#00AF5C]/30' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@badutzy._', label: 'TikTok', username: '@badutzy._', isCustomIcon: true, color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30' },
  { icon: CurseForgeIcon, href: 'https://www.curseforge.com/members/badutzy', label: 'CurseForge', username: '@badutzy', isCustomIcon: true, color: 'hover:bg-[#F16436]/10 hover:text-[#F16436] hover:border-[#F16436]/30' },
];

const githubLink = {
  icon: Github,
  href: 'https://github.com/BadutZY',
  label: 'GitHub',
  username: '@BadutZY',
  color: 'hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/30',
};


const instagramReels = [
  { shortcode: 'DVT03rLicSo', href: 'https://www.instagram.com/reel/DVT03rLicSo/' },
  { shortcode: 'DWGUd9TiTVe', href: 'https://www.instagram.com/reel/DWGUd9TiTVe/' },
  { shortcode: 'DVZK61DiUyx', href: 'https://www.instagram.com/reel/DVZK61DiUyx/' },
];

const SocialCard = ({
  link,
  index,
  isVisible,
  className,
}: {
  link: typeof gridSocialLinks[0];
  index: number;
  isVisible: boolean;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 ${link.color} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${link.label} - ${link.username}`}
    >
      <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-transparent">
        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground transition-colors duration-300">{link.label}</div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{link.username}</div>
      </div>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'bg-primary/10 text-primary translate-x-0 opacity-100' : 'opacity-0 -translate-x-2'
        }`}
      >
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </a>
  );
};


const IG_GRADIENT = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

const InstagramCard = ({
  reel,
  index,
  isVisible,
}: {
  reel: typeof instagramReels[0];
  index: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: isVisible ? `${index * 110}ms` : '0ms',
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #120d1a 0%, #0d0d0f 100%)',
          border: '1px solid rgba(193,53,132,0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shadow-sm"
              style={{ background: IG_GRADIENT }}
            >
              <Instagram className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/55">
              Instagram Reels
            </span>
          </div>
          <a
            href={reel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-pink-400 transition-colors"
          >
            <ArrowUpRight className="w-3 h-3" />
            <span>Open</span>
          </a>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '177.78%',
          }}
        >
          <iframe
            src={`https://www.instagram.com/reel/${reel.shortcode}/embed/`}
            title={`Instagram Reel ${reel.shortcode}`}
            allowFullScreen
            scrolling="no"
            frameBorder="0"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>

        <div
          className="flex items-center gap-1.5 px-4 py-2.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ background: IG_GRADIENT }}
          >
            <Film className="w-2 h-2 text-white" />
          </div>
          <span className="text-[10px] text-white/35 font-medium">@rzky.mp_36</span>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.1, true);
  const { ref: socialRef,  isVisible: socialVisible  } = useScrollAnimation(0.1, true);
  const { ref: ytCardRef,  isVisible: ytCardVisible  } = useScrollAnimation(0.1, true);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.05, true);

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-24">
        <div
          ref={sectionRef}
          className={`rounded-3xl overflow-hidden border border-border/30 bg-card/30 p-8 md:p-12 lg:p-16 text-center transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">
            Get In Touch
          </h2>
          <div className="flex gap-1 justify-center mb-6">
            <div className="w-12 h-1 rounded-full bg-primary" />
            <div className="w-6 h-1 rounded-full bg-primary/50" />
          </div>
          <p className="text-muted-foreground max-w-md mx-auto text-base md:text-lg leading-relaxed">
            Feel free to reach out through any of my social platforms. I'm always open to new connections!
          </p>
        </div>
      </div>

      <div ref={socialRef} className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
          {gridSocialLinks.map((link, i) => (
            <SocialCard key={link.label} link={link} index={i} isVisible={socialVisible} />
          ))}
        </div>
        <div className="max-w-2xl mx-auto flex justify-center">
          <div className="w-full sm:w-[calc(50%-0.5rem)]">
            <SocialCard link={githubLink} index={gridSocialLinks.length} isVisible={socialVisible} />
          </div>
        </div>
      </div>

      <div ref={ytCardRef} className="container mx-auto px-6 md:px-10 lg:px-20 mt-10 md:mt-14">
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center gap-4 mb-6"
            style={{
              opacity:    ytCardVisible ? 1 : 0,
              transform:  ytCardVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div className="flex-1 h-px bg-border/30" />
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background:  "rgba(255,0,0,0.06)",
                border:      "1px solid rgba(255,0,0,0.15)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#FF0000", boxShadow: "0 0 8px #FF0000" }}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400/80">
                YouTube Channel
              </span>
            </div>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          <YouTubeChannelCard isVisible={ytCardVisible} />
        </div>
      </div>

      <div ref={contentRef} className="container mx-auto px-6 md:px-10 lg:px-20 mt-20 md:mt-28">
        <div
          className={`flex items-center gap-4 mb-10 transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex-1 h-px bg-border/40" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/40 bg-card/40 backdrop-blur-sm">
            <Play className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              My Content
            </span>
          </div>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        <div
          className={`mb-3 transition-all duration-500 ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '60ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#FF0000] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground tracking-wide">YouTube</span>
            </div>
            <a
              href={BADUTZY_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <span>@badutzy</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-[1.78fr_1fr_1.78fr] gap-5 md:gap-6 mb-14 items-start">
          <YouTubeCard type="video"  index={0} isVisible={contentVisible} />
          <YouTubeCard type="short"  index={1} isVisible={contentVisible} />
          <YouTubeCard type="stream" index={2} isVisible={contentVisible} />
        </div>

        <div
          className={`mb-3 transition-all duration-500 ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '160ms' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              }}
            >
              <Instagram className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">Instagram Reels</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 pb-8">
          {instagramReels.map((r, i) => (
            <InstagramCard key={r.shortcode} reel={r} index={i} isVisible={contentVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;