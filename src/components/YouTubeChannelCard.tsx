import { useState, useRef } from "react";
import {
  useYouTubeChannelStats,
  formatSubscribers,
  formatVideoCount,
  formatTotalViews,
} from "@/hooks/useYouTubeChannelStats";
import { ExternalLink, RefreshCw, Play, Eye, Film, Users, Bell, CheckCircle } from "lucide-react";

const CHANNEL_HANDLE     = "badutzy";
const CHANNEL_URL        = "https://www.youtube.com/@badutzy";
const CHANNEL_HANDLE_STR = "@badutzy";

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-white/5 ${className}`}
    style={{ animation: "ytShimmer 1.8s ease-in-out infinite" }}
  />
);

const StatPill = ({
  icon,
  label,
  value,
  loading,
  accentColor = "#FF0000",
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading: boolean;
  accentColor?: string;
  delay?: number;
}) => (
  <div
    className="flex flex-col items-center gap-1 px-2 py-2.5 sm:px-4 sm:py-3 rounded-2xl relative overflow-hidden group min-w-0"
    style={{
      background:   "rgba(255,255,255,0.04)",
      border:       "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(8px)",
      animationDelay: `${delay}ms`,
    }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
      style={{ background: `radial-gradient(ellipse at center, ${accentColor}14 0%, transparent 70%)` }}
    />
    <div className="relative z-10 flex flex-col items-center gap-1 w-full">
      <span style={{ color: accentColor }}>{icon}</span>
      {loading ? (
        <Shimmer className="h-5 w-10 sm:h-6 sm:w-14" />
      ) : (
        <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">{value}</span>
      )}
      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-semibold text-white/40 text-center leading-tight truncate w-full text-center">{label}</span>
    </div>
  </div>
);

const YouTubeChannelCard = ({
  isVisible = true,
}: {
  isVisible?: boolean;
}) => {
  const { stats, loading, error, refresh } = useYouTubeChannelStats(CHANNEL_HANDLE);
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [bannerError,  setBannerError]    = useState(false);
  const [avatarError,  setAvatarError]    = useState(false);
  const [subscribed,   setSubscribed]     = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const joinYear = stats?.publishedAt
    ? new Date(stats.publishedAt).getFullYear()
    : null;

  const errorLabel =
    error === "no_api_key"       ? "YouTube API Key belum dikonfigurasi." :
    error === "quota_exceeded"   ? "Kuota YouTube API habis untuk hari ini." :
    error === "channel_not_found"? "Channel tidak ditemukan." :
    error === "network_error"    ? "Gagal terhubung ke YouTube API." :
    error                        ? "Gagal memuat data channel." : null;

  const cardVisible = isVisible;

  return (
    <div
      className="relative w-full"
      style={{
        opacity:    cardVisible ? 1 : 0,
        transform:  cardVisible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <style>{`
        @keyframes ytShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .yt-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: ytShimmer 1.8s ease-in-out infinite;
        }
        @keyframes ytPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes ytGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,0,0,0.3); }
          50%      { box-shadow: 0 0 40px rgba(255,0,0,0.6); }
        }
        @keyframes ytFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-4px); }
        }
        .yt-verified { animation: ytFloat 3s ease-in-out infinite; }
        .sub-btn-glow { animation: ytGlow 2.5s ease-in-out infinite; }
      `}</style>

      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:  "linear-gradient(145deg, #111111 0%, #0a0a0a 50%, #0d0d0d 100%)",
          border:      "1px solid rgba(255,255,255,0.07)",
          boxShadow:   "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,0,0,0.04) inset",
        }}
      >

        <div className="relative w-full overflow-hidden" style={{ height: "clamp(100px, 28vw, 140px)" }}>

          {!bannerError && stats?.bannerUrl ? (
            <img
              src={stats.bannerUrl}
              alt="Channel Banner"
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.65)" }}
              onError={() => setBannerError(true)}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, #1a0000 0%, #2d0000 20%, #1a0000 40%, #0d0d0d 60%, #1a0000 80%, #2d0000 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(255,0,0,0.4) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,50,0,0.3) 0%, transparent 40%),
                    radial-gradient(circle at 60% 80%, rgba(200,0,0,0.25) 0%, transparent 35%)
                  `,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 yt-shimmer" />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.8) 80%, #0a0a0a 100%)",
            }}
          />

          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-70">
            <div
              className="flex items-center justify-center rounded-lg px-2 py-1"
              style={{ background: "#FF0000", boxShadow: "0 2px 12px rgba(255,0,0,0.5)" }}
            >
              <svg viewBox="0 0 90 63" className="w-7 h-5 fill-white">
                <path d="M88.1 9.9C87 5.9 84 2.8 80 1.7 73 0 45 0 45 0S17 0 10 1.7C6 2.8 3 5.9 1.9 9.9 0 16.8 0 31.5 0 31.5S0 46.2 1.9 53.1C3 57.1 6 60.2 10 61.3 17 63 45 63 45 63s28 0 35-1.7c4-1.1 7-4.2 8.1-8.2C90 46.2 90 31.5 90 31.5S90 16.8 88.1 9.9zM36 45V18l23.4 13.5L36 45z"/>
              </svg>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
            }}
            title="Refresh stats"
          >
            <RefreshCw
              className="w-3.5 h-3.5 text-white/60"
              style={{ animation: isRefreshing ? "spin 0.8s linear infinite" : "none" }}
            />
          </button>
        </div>

        <div className="relative px-3 pb-4 sm:px-5 sm:pb-5">

          <div className="flex items-end justify-between" style={{ marginTop: "clamp(-28px, -8vw, -40px)" }}>
            <div className="relative flex-shrink-0">
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: "linear-gradient(135deg, #FF0000, #FF4500, #FF0000)",
                  boxShadow:  "0 4px 20px rgba(255,0,0,0.5)",
                }}
              >
                <div className="rounded-full p-[2px]" style={{ background: "#0a0a0a" }}>
                  {!avatarError && stats?.thumbnailUrl ? (
                    <img
                      src={stats.thumbnailUrl}
                      alt={stats.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : loading ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full yt-shimmer" />
                  ) : (
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
                      style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)" }}
                    >
                      B
                    </div>
                  )}
                </div>
              </div>

              <div
                className="absolute -bottom-0.5 -right-0.5 yt-verified"
                title="YouTube Creator"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#0a0a0a", border: "2px solid #0a0a0a" }}
                >
                  <CheckCircle className="w-5 h-5" style={{ color: "#aaaaaa" }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-shrink-0">
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border:     "1px solid rgba(255,255,255,0.12)",
                  color:      "rgba(255,255,255,0.7)",
                }}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Open</span>
              </a>

              <button
                onClick={() => setSubscribed(s => !s)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                  subscribed ? "" : "sub-btn-glow"
                }`}
                style={subscribed ? {
                  background: "rgba(255,255,255,0.1)",
                  border:     "1px solid rgba(255,255,255,0.15)",
                  color:      "rgba(255,255,255,0.7)",
                } : {
                  background: "#FF0000",
                  border:     "1px solid rgba(255,0,0,0.5)",
                  color:      "#ffffff",
                  boxShadow:  "0 4px 16px rgba(255,0,0,0.4)",
                }}
              >
                {subscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 sm:mt-3 mb-4">
            {loading ? (
              <>
                <Shimmer className="h-6 w-40 mb-2" />
                <Shimmer className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
                    {stats?.title ?? CHANNEL_HANDLE}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-sm text-white/50 font-medium">
                    {stats?.customUrl ?? CHANNEL_HANDLE_STR}
                  </span>
                  {joinYear && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="text-xs text-white/35">Joined {joinYear}</span>
                    </>
                  )}
                </div>
              </>
            )}

            {errorLabel && !loading && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-red-400/80"
                  style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.15)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                  {errorLabel}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4">
            <StatPill
              icon={<Users className="w-4 h-4" />}
              label="Subscribers"
              value={stats ? formatSubscribers(stats.subscriberCount) : "—"}
              loading={loading}
              accentColor="#FF0000"
              delay={0}
            />
            <StatPill
              icon={<Film className="w-4 h-4" />}
              label="Videos"
              value={stats ? formatVideoCount(stats.videoCount) : "—"}
              loading={loading}
              accentColor="#FF4500"
              delay={80}
            />
            <StatPill
              icon={<Eye className="w-4 h-4" />}
              label="Total Views"
              value={stats ? formatTotalViews(stats.viewCount) : "—"}
              loading={loading}
              accentColor="#FF3B5C"
              delay={160}
            />
          </div>

          {!loading && stats?.description && (
            <p
              className="text-xs text-white/35 leading-relaxed line-clamp-2 mb-4 px-1"
              title={stats.description}
            >
              {stats.description}
            </p>
          )}
          {loading && (
            <div className="mb-4 px-1 space-y-1.5">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-3/4" />
            </div>
          )}

          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10px] text-white/20 font-mono">
              {CHANNEL_HANDLE_STR}
            </span>
          </div>
        </div>

        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #FF0000 30%, #FF4500 70%, transparent 100%)",
            boxShadow: "0 0 12px rgba(255,0,0,0.6)",
          }}
        />
      </div>
    </div>
  );
};

export default YouTubeChannelCard;