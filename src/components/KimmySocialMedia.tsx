import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ExternalLink, Heart, MessageCircle, Repeat2, Eye, Bookmark } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Platform = 'x' | 'tiktok' | 'threads';

interface SocialPost {
  id: string;
  url: string;
  shortcode?: string;
  tweetId?: string;
  videoId?: string;
  threadId?: string;
  caption: string;
  date: string;
  extra?: string;
}

// ─── Post Data ────────────────────────────────────────────────────────────────
const xPosts: SocialPost[] = [
  {
    id: 'x-1',
    url: 'https://x.com/Kimmy_JKT48/status/2036101720191992216',
    tweetId: '2036101720191992216',
    caption: '#Lunavicta',
    date: 'March 23, 2026',
  },
  {
    id: 'x-2',
    url: 'https://x.com/Kimmy_JKT48/status/2017586942733684738',
    tweetId: '2017586942733684738',
    caption: 'HEHEHEH MAKASIH BANYAK TWT HARI INI UYYYY SERU BANGED',
    date: 'January 31, 2026',

  },
  {
    id: 'x-3',
    url: 'https://x.com/Kimmy_JKT48/status/1998794886540329339',
    tweetId: '1998794886540329339',
    caption: 'SEE U VC TAHUN DEPAAANN, makaci banyak vc tahun ini❤️❤️❤️❤️❤️❤️❤️❤️',
    date: 'December 10, 2025',
  },
];

const tiktokPosts: SocialPost[] = [
  {
    id: 'tt-1',
    url: 'https://www.tiktok.com/@jkt48.kimmy/video/7503483388418854152',
    videoId: '7503483388418854152',
    caption: '😈',
    date: 'May 12, 2025',
  },
  {
    id: 'tt-2',
    url: 'https://www.tiktok.com/@jkt48.kimmy/video/7414498889635466502',
    videoId: '7414498889635466502',
    caption: '🧍🏻‍♀️ #jkt48.kimmy',
    date: 'September 14, 2024',
  },
  {
    id: 'tt-3',
    url: 'https://www.tiktok.com/@jkt48.kimmy/video/7423422203821083910',
    videoId: '7423422203821083910',
    caption: 'capybara..! 🤏🏻 #KimmyJKT48 ',
    date: 'October 8, 2024',
  },
];

const threadsPosts: SocialPost[] = [
  {
    id: 'th-1',
    url: 'https://www.threads.com/@jkt48.kimmy/post/DMhU7avTQ5U',
    threadId: 'DMhU7avTQ5U',
    caption: ' ',
    date: 'July 25, 2025',
  },
  {
    id: 'th-2',
    url: 'https://www.threads.com/@jkt48.kimmy/post/C_DzLEKzzFY',
    threadId: 'C_DzLEKzzFY',
    caption: 'recent 📸 ',
    date: 'August 24, 2024',
  },
  {
    id: 'th-3',
    url: 'https://www.threads.com/@jkt48.kimmy/post/DU-1C8sk0ki',
    threadId: 'DU-1C8sk0ki',
    caption: 'steadfast ###',
    date: 'February 2, 2026',
  },
];

// ─── Platform Config ──────────────────────────────────────────────────────────
const platforms = [
  {
    id: 'x' as Platform,
    label: 'X (Twitter)',
    color: '#e7e9ea',
    glow: 'rgba(231,233,234,0.2)',
    username: 'Kimmy JKT48',
    handle: '@Kimmy_JKT48',
    profileUrl: 'https://x.com/Kimmy_JKT48',
    posts: xPosts,
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'tiktok' as Platform,
    label: 'TikTok',
    color: '#fe2c55',
    glow: 'rgba(254,44,85,0.35)',
    username: 'JKT48 Kimmy',
    handle: '@jkt48.kimmy',
    profileUrl: 'https://www.tiktok.com/@jkt48.kimmy',
    posts: tiktokPosts,
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/>
      </svg>
    ),
  },
  {
    id: 'threads' as Platform,
    label: 'Threads',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.3)',
    username: 'Kimmy JKT48',
    handle: '@jkt48.kimmy',
    profileUrl: 'https://www.threads.com/@jkt48.kimmy',
    posts: threadsPosts,
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.107-1.138 3.455-1.165 1.005-.02 1.925.112 2.748.391.02-.882-.06-1.693-.236-2.412l2.036-.421c.238 1.012.342 2.138.3 3.37l.018.435c.93.494 1.69 1.134 2.273 1.93.825 1.127 1.196 2.457 1.073 3.848-.136 1.533-.745 2.88-1.81 4.003-1.239 1.303-2.904 2.128-4.95 2.45-.535.084-1.09.128-1.658.132zM9.15 15.525c.05.907.578 1.534 1.548 1.837.564.176 1.22.208 1.844.176 1.099-.06 1.942-.467 2.504-1.209.43-.565.734-1.313.893-2.214-.758-.263-1.588-.393-2.484-.377-.964.02-1.784.278-2.376.75-.509.407-.774.932-.742 1.482z"/>
      </svg>
    ),
  },
];

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="w-10 h-10 rounded-full border-2 border-white/10 animate-spin" style={{ borderTopColor: color }} />
    <span className="text-[11px] text-white/40">{label}</span>
  </div>
);

// ─── Error Fallback Card ──────────────────────────────────────────────────────
const ErrorFallback = ({
  post, color, label, icon,
}: { post: SocialPost; color: string; label: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
    style={{ background: 'rgba(10,10,10,0.7)', border: `1px solid ${color}25` }}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
      style={{ background: color + '15', border: `1px solid ${color}30` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <p className="text-sm font-semibold text-white/70 mb-1">{label}</p>
      <p className="text-[12px] text-white/40 leading-relaxed max-w-xs">{post.caption}</p>
      <p className="text-[11px] text-white/25 mt-1">{post.date}</p>
    </div>
    <a href={post.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] font-semibold transition-all hover:scale-105 active:scale-95"
      style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
      <ExternalLink className="w-3.5 h-3.5" />
      View on {label}
    </a>
  </div>
);

// ─── X / Twitter Embed ────────────────────────────────────────────────────────
// Uses twttr.widgets.createTweet() — the only reliable way to render X posts.
const XEmbed = ({ post, color, icon }: { post: SocialPost; color: string; icon: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const tweetId = post.tweetId ?? '';

  const renderTweet = useCallback(() => {
    if (!containerRef.current || !tweetId) { setStatus('error'); return; }
    containerRef.current.innerHTML = '';
    setStatus('loading');

    const win = window as any;
    const doCreate = () => {
      win.twttr.widgets
        .createTweet(tweetId, containerRef.current!, {
          theme: 'dark',
          dnt: true,
          conversation: 'none',
          align: 'center',
        })
        .then((el: Element | undefined) => {
          setStatus(el ? 'done' : 'error');
        })
        .catch(() => setStatus('error'));
    };

    if (win.twttr?.widgets) {
      doCreate();
      return;
    }

    // Load widgets.js once
    if (!document.getElementById('twitter-wjs')) {
      const s = document.createElement('script');
      s.id = 'twitter-wjs';
      s.src = 'https://platform.twitter.com/widgets.js';
      s.async = true;
      s.charset = 'utf-8';
      document.body.appendChild(s);
    }

    // Poll until ready
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if ((window as any).twttr?.widgets) {
        clearInterval(poll);
        doCreate();
      }
      if (tries > 30) { clearInterval(poll); setStatus('error'); }
    }, 300);
  }, [tweetId]);

  useEffect(() => { renderTweet(); }, [renderTweet]);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.6)', minHeight: 300 }}>
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Spinner color={color} label="Loading X post…" />
        </div>
      )}
      {status === 'error' && (
        <ErrorFallback post={post} color={color} label="X (Twitter)" icon={icon} />
      )}
      <div
        ref={containerRef}
        className="w-full transition-opacity duration-500 [&_.twitter-tweet]:!mx-auto"
        style={{ opacity: status === 'done' ? 1 : 0 }}
      />
      {status === 'done' && (
        <a href={post.url} target="_blank" rel="noopener noreferrer"
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold backdrop-blur-md transition-all hover:scale-105"
          style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${color}50`, color }}>
          <ExternalLink className="w-3 h-3" /> Open on X
        </a>
      )}
    </div>
  );
};

// ─── TikTok Embed ─────────────────────────────────────────────────────────────
// Uses click-to-play to prevent autoplay — thumbnail shown first, iframe loads on click.
const TikTokEmbed = ({ post, color }: { post: SocialPost; color: string }) => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col items-center"
      style={{ background: 'rgba(10,10,10,0.6)' }}
    >
      {!active ? (
        /* ── Thumbnail / play button ── */
        <div
          className="relative w-full flex items-center justify-center cursor-pointer group"
          style={{ maxWidth: 380, height: 600, margin: '0 auto' }}
          onClick={() => { setActive(true); setLoading(true); }}
        >
          {/* Gradient background as placeholder */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(160deg, #1a0a0f 0%, #0d0d0d 60%, #0a0a12 100%)',
            }}
          />

          {/* TikTok-style decorative pattern */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute top-1/4 -left-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: `radial-gradient(circle, ${color}, transparent)`, filter: 'blur(32px)' }} />
            <div className="absolute bottom-1/4 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #69C9D0, transparent)', filter: 'blur(32px)' }} />
          </div>

          {/* TikTok logo watermark */}
          <div className="absolute top-4 left-4 opacity-20">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/>
            </svg>
          </div>

          {/* Center play button */}
          <div className="relative flex flex-col items-center gap-4 z-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: color,
                boxShadow: `0 0 0 12px ${color}20, 0 8px 32px ${color}50`,
              }}
            >
              {/* Play icon */}
              <svg viewBox="0 0 24 24" width="34" height="34" fill="white" style={{ marginLeft: 4 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-[13px] font-semibold">Klik untuk putar</p>
              <p className="text-white/35 text-[11px] mt-0.5">TikTok · @jkt48.kimmy</p>
            </div>
          </div>

          {/* Caption preview at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
            <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2">{post.caption}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px]">
            </div>
          </div>
        </div>
      ) : (
        /* ── Active iframe ── */
        <div className="relative w-full" style={{ maxWidth: 380, margin: '0 auto' }}>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(10,10,10,0.8)' }}>
              <Spinner color={color} label="Loading TikTok…" />
            </div>
          )}
          <iframe
            src={`https://www.tiktok.com/embed/v2/${post.videoId}`}
            className="rounded-2xl transition-opacity duration-500"
            style={{ width: '100%', height: 600, border: 'none', opacity: loading ? 0 : 1 }}
            allow="encrypted-media"
            allowFullScreen
            title={`TikTok video ${post.videoId}`}
            onLoad={() => setLoading(false)}
          />
          {/* Close button */}
          <button
            onClick={() => { setActive(false); setLoading(false); }}
            className="absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white/60 hover:text-white transition-all backdrop-blur-sm"
            title="Tutup"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <a href={post.url} target="_blank" rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold backdrop-blur-md transition-all hover:scale-105"
        style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${color}50`, color }}>
        <ExternalLink className="w-3 h-3" /> Open on TikTok
      </a>
    </div>
  );
};

// ─── Threads Embed ────────────────────────────────────────────────────────────
const ThreadsEmbed = ({ post, color }: { post: SocialPost; color: string }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.6)' }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Spinner color={color} label="Loading Threads post…" />
        </div>
      )}
      <iframe
        src={`https://www.threads.com/@jkt48.kimmy/post/${post.threadId}/embed`}
        className="w-full rounded-2xl transition-opacity duration-500"
        style={{ height: 500, border: 'none', opacity: loading ? 0 : 1 }}
        allowFullScreen
        title={`Threads post ${post.threadId}`}
        onLoad={() => setLoading(false)}
      />
      <a href={post.url} target="_blank" rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold backdrop-blur-md transition-all hover:scale-105"
        style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${color}50`, color }}>
        <ExternalLink className="w-3 h-3" /> Open on Threads
      </a>
    </div>
  );
};

// ─── Post Selector Card ───────────────────────────────────────────────────────
const PostCard = ({
  post, index, platform, color, isActive, onClick,
}: {
  post: SocialPost; index: number; platform: Platform;
  color: string; isActive: boolean; onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="relative text-left w-full rounded-2xl overflow-hidden transition-all duration-300 group"
    style={{
      background: isActive
        ? `linear-gradient(135deg, color-mix(in srgb, ${color} 18%, #111) 0%, #0d0d0d 100%)`
        : 'rgba(255,255,255,0.03)',
      border: `1.5px solid ${isActive ? color + '55' : 'rgba(255,255,255,0.07)'}`,
      boxShadow: isActive ? `0 0 24px ${color}22, 0 4px 20px rgba(0,0,0,0.4)` : '0 2px 12px rgba(0,0,0,0.2)',
    }}
  >
    {isActive && (
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}12, transparent 70%)` }} />
    )}
    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-300"
      style={{ background: isActive ? `linear-gradient(90deg, transparent, ${color}, transparent)` : 'transparent' }} />

    <div className="relative p-4">
      <div className="flex items-start justify-between mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{
            background: isActive ? color + '22' : 'rgba(255,255,255,0.05)',
            color: isActive ? color : 'rgba(255,255,255,0.3)',
            border: `1px solid ${isActive ? color + '40' : 'rgba(255,255,255,0.07)'}`,
          }}>
          {index + 1}
        </div>
        <span className="text-[10px] text-white/28 mt-0.5">{post.date}</span>
      </div>
      <p className="text-[11px] leading-relaxed text-white/50 mb-3 group-hover:text-white/65 transition-colors"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
        {post.caption}
      </p>
      <div className="flex items-center gap-3">
        {post.extra && (
          <span className="flex items-center gap-1 text-[10px] text-white/30">
            {platform === 'tiktok' ? <Eye className="w-2.5 h-2.5" />
              : platform === 'x' ? <Repeat2 className="w-2.5 h-2.5" />
              : <Bookmark className="w-2.5 h-2.5" />}
            {post.extra}
          </span>
        )}
      </div>
    </div>
  </motion.button>
);

// ─── Platform Button ──────────────────────────────────────────────────────────
const PlatformBtn = ({ pl, active, onClick }: { pl: typeof platforms[0]; active: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] font-semibold tracking-wide overflow-hidden transition-all duration-300"
    style={{
      background: active ? `${pl.color}15` : 'rgba(255,255,255,0.04)',
      border: `1.5px solid ${active ? pl.color + '45' : 'rgba(255,255,255,0.09)'}`,
      color: active ? pl.color : 'rgba(255,255,255,0.38)',
      boxShadow: active ? `0 0 22px ${pl.glow}` : 'none',
    }}
  >
    {active && (
      <motion.div layoutId="sm-btn-glow" className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 120%, ${pl.color}15, transparent 65%)` }} />
    )}
    <span className="relative" style={{ color: active ? pl.color : 'rgba(255,255,255,0.28)' }}>{pl.icon}</span>
    <span className="relative">{pl.label}</span>
    {active && (
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="relative w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: pl.color, boxShadow: `0 0 7px ${pl.color}` }} />
    )}
  </motion.button>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const KimmySocialMedia = () => {
  const { ref, isVisible } = useScrollAnimation(0.05, true);
  const [activePlatform, setActivePlatform] = useState<Platform>('x');
  const [activePostIdx, setActivePostIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const currentPl = platforms.find(p => p.id === activePlatform)!;
  const currentPost = currentPl.posts[activePostIdx];

  const handleSwitchPlatform = (id: Platform) => {
    if (id === activePlatform) return;
    setActivePlatform(id);
    setActivePostIdx(0);
    setAnimKey(k => k + 1);
  };

  const platformOrder: Platform[] = ['x', 'tiktok', 'threads'];
  const slideX = platformOrder.indexOf(activePlatform) >= 2 ? -40 : 40;

  return (
    <section className="py-14 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 80%, ${currentPl.color}07, transparent 70%)` }} />

      <style>{`
        @keyframes sm-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .sm-live { animation: sm-pulse 2s ease-in-out infinite; }
        .twitter-tweet { margin: 0 auto !important; }
      `}</style>

      <div className="container mx-auto px-6 md:px-10 lg:px-20">

        {/* Header */}
        <div ref={ref} className={`mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Kimmy's Social Media</h3>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm ml-11">Posts I love from my favorite person 🐹</p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, x: slideX }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideX }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8"
          >
            {/* Left: embed viewer */}
            <div className="order-2 lg:order-1">
              {/* Platform header bar */}
              <div className="relative rounded-2xl p-4 mb-4 flex items-center justify-between overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, ${currentPl.color} 14%, #111) 0%, #0a0a0a 100%)`,
                  border: `1px solid ${currentPl.color}30`,
                  boxShadow: `0 0 28px ${currentPl.glow}`,
                }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 50%, ${currentPl.color}10, transparent 60%)` }} />
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: currentPl.color + '20', border: `1px solid ${currentPl.color}40` }}>
                    <span style={{ color: currentPl.color }}>{currentPl.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{currentPl.username}</p>
                    <p className="text-[11px]" style={{ color: currentPl.color + 'cc' }}>{currentPl.handle}</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="sm-live w-1.5 h-1.5 rounded-full" style={{ background: currentPl.color }} />
                    <span className="text-[10px] text-white/40">Post {activePostIdx + 1}/{currentPl.posts.length}</span>
                  </div>
                  <a href={currentPl.profileUrl} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{ background: currentPl.color + '20', color: currentPl.color, border: `1px solid ${currentPl.color}40` }}>
                    <ExternalLink className="w-2.5 h-2.5" /> Follow
                  </a>
                </div>
              </div>

              {/* Embed panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`embed-${activePlatform}-${activePostIdx}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  {activePlatform === 'x' && (
                    <XEmbed post={currentPost} color={currentPl.color} icon={currentPl.icon} />
                  )}
                  {activePlatform === 'tiktok' && (
                    <TikTokEmbed post={currentPost} color={currentPl.color} />
                  )}
                  {activePlatform === 'threads' && (
                    <ThreadsEmbed post={currentPost} color={currentPl.color} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Caption strip */}
              <motion.div
                key={`cap-${activePlatform}-${activePostIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="mt-3 rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[12px] text-white/50 leading-relaxed">{currentPost.caption}</p>
                <div className="flex items-center gap-4 mt-2.5">
                  {currentPost.extra && (
                    <span className="flex items-center gap-1 text-[11px] text-white/35">
                      {activePlatform === 'tiktok' ? <Eye className="w-3 h-3" />
                        : activePlatform === 'x' ? <Repeat2 className="w-3 h-3" />
                        : <Bookmark className="w-3 h-3" />}
                      {currentPost.extra}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right: post selector */}
            <div className="order-1 lg:order-2 space-y-3">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/28 px-1 mb-4">Select Post</p>
              {currentPl.posts.map((post, idx) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={idx}
                  platform={activePlatform}
                  color={currentPl.color}
                  isActive={activePostIdx === idx}
                  onClick={() => setActivePostIdx(idx)}
                />
              ))}
              <div className="pt-2 border-t border-white/[0.05]" />
              <a href={currentPl.profileUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
                style={{ background: `linear-gradient(135deg, ${currentPl.color}10, transparent)`, border: `1px solid ${currentPl.color}22` }}>
                <span className="text-[12px] font-semibold" style={{ color: currentPl.color + 'bb' }}>Visit full profile</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  style={{ color: currentPl.color + '70' }} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Platform switcher */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mt-10">
          {platforms.map(pl => (
            <PlatformBtn key={pl.id} pl={pl} active={activePlatform === pl.id} onClick={() => handleSwitchPlatform(pl.id)} />
          ))}
        </div>
      </div>
    </section>
  );
};''

export default KimmySocialMedia;