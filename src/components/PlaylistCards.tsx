import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Play,
  Pause,
  Music2,
  ExternalLink,
  Heart,
  ListMusic,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';

import raavfyCover from '@/assets/playlist/raavfy-songs.jpg';
import englishCover from '@/assets/playlist/english-songs.jpg';
import jkt48Cover from '@/assets/playlist/jkt48-songs.jpg';
import indonesiaCover from '@/assets/playlist/indonesia-songs.jpg';

interface Track {
  title: string;
  artist: string;
  duration: string;
  videoId: string;
}

interface Playlist {
  id: string;
  name: string;
  cover: string;
  tracks: Track[];
  url: string;
  accentColor: string;
  textColor: string;
}

const playlists: Playlist[] = [
  {
    id: 'raavfy',
    name: 'Raavfy Songs',
    cover: raavfyCover,
    accentColor: '#7c3aed',
    textColor: '#ede9fe',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40nnZWNJp_R00Oh0YjojKFR9&si=tjbz3mVDX63s1N8Y',
    tracks: [
      { title: 'Kau Pilih Dia', artist: 'Raavfy, Mas Jordan, Malikoendang', duration: '3:30', videoId: 'nYefp88ahug' },
      { title: 'Persetan', artist: 'Raavfy', duration: '3:10', videoId: '2oQULwdi27I' },
      { title: 'Berubah', artist: 'Raavfy', duration: '3:45', videoId: 'BsBx8TmO0sI' },
    ],
  },
  {
    id: 'english',
    name: 'English Songs',
    cover: englishCover,
    accentColor: '#0ea5e9',
    textColor: '#e0f2fe',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40mkQFJAVQFbS_xCiZz3grK3&si=6dUgLGUTZIR2lu7O',
    tracks: [
      { title: 'Those Eyes', artist: 'New West', duration: '3:10', videoId: 'YPeHGoGhHxg' },
      { title: 'Cut My Fingers Off', artist: 'Ethan Bortnick', duration: '3:05', videoId: 'MX4PW0bHM2w' },
      { title: 'From The Start', artist: 'Laufey', duration: '3:10', videoId: 'GtVxI5E0JHE' },
    ],
  },
  {
    id: 'jkt48',
    name: 'JKT48 Songs',
    cover: jkt48Cover,
    accentColor: '#e11d48',
    textColor: '#fce7f3',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40lDS5ViQN_vPXduLjPkMoRz&si=cYPB-QJM0PFSuhJP',
    tracks: [
      { title: 'Sahabat atau Cinta', artist: 'JKT48', duration: '4:05', videoId: 'Sq0oSlmbDOc' },
      { title: 'Dai Dai Dai', artist: 'JKT48', duration: '4:20', videoId: '4_LDao9Aop8' },
      { title: 'Ada Aku!', artist: 'JKT48', duration: '3:50', videoId: '093VUafY4Po' },
    ],
  },
  {
    id: 'indonesia',
    name: 'Indonesia Songs',
    cover: indonesiaCover,
    accentColor: '#d97706',
    textColor: '#fef3c7',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40m_RClswTPLJx1lMlh5VCO2&si=Akjk12r6W2p5rUIl',
    tracks: [
      { title: 'Di Batas Malam', artist: 'Danilla', duration: '4:10', videoId: 'HYSQ_3Ti86g' },
      { title: 'Pecinta Wanita', artist: 'Irwansyah', duration: '3:55', videoId: 'Figow1PoksI' },
      { title: 'Monolog', artist: 'Pamungkas', duration: '4:30', videoId: 'w_0RyTy-GlA' },
    ],
  },
];

let _ytReady = false;
const _ytQueue: (() => void)[] = [];

function loadYTApi(cb: () => void) {
  if (_ytReady) { cb(); return; }
  _ytQueue.push(cb);
  if (document.getElementById('yt-iframe-api')) return;
  const s = document.createElement('script');
  s.id = 'yt-iframe-api';
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
  (window as any).onYouTubeIframeAPIReady = () => {
    _ytReady = true;
    _ytQueue.forEach((fn) => fn());
    _ytQueue.length = 0;
  };
}

let _activeStop: (() => void) | null = null;

interface PlayerCardProps {
  playlist: Playlist;
  index: number;
  isVisible: boolean;
}

const PlayerCard = ({ playlist, index, isVisible }: PlayerCardProps) => {
  const [trackIdx, setTrackIdx]     = useState(0);
  const [playing, setPlaying]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [curSec, setCurSec]         = useState(0);
  const [durSec, setDurSec]         = useState(0);
  const [shuffle, setShuffle]       = useState(false);
  const [repeat, setRepeat]         = useState(false);
  const [liked, setLiked]           = useState(false);
  const [queueOpen, setQueueOpen]   = useState(false);
  const [apiReady, setApiReady]     = useState(false);

  const ytRef    = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);

  const track = playlist.tracks[trackIdx];

  useEffect(() => {
    loadYTApi(() => {
      if (!holderRef.current) return;
      ytRef.current = new (window as any).YT.Player(`yt-${playlist.id}`, {
        height: '1', width: '1',
        videoId: playlist.tracks[0].videoId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, iv_load_policy: 3, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => setApiReady(true),
          onStateChange: (e: any) => {
            const S = (window as any).YT?.PlayerState;
            if (!S) return;
            if (e.data === S.PLAYING)  { startPoll(); }
            if (e.data === S.PAUSED || e.data === S.BUFFERING) stopPoll();
            if (e.data === S.ENDED)    handleEnded();
          },
        },
      });
    });
    return () => { stopPoll(); ytRef.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (!apiReady) return;
    if (playingRef.current) {
      ytRef.current?.loadVideoById?.(track.videoId);
    } else {
      ytRef.current?.cueVideoById?.(track.videoId);
    }
    setProgress(0); setCurSec(0); setDurSec(0);
  }, [trackIdx, apiReady]);

  const startPoll = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      const p = ytRef.current;
      if (!p?.getCurrentTime) return;
      const c = p.getCurrentTime();
      const d = p.getDuration();
      setCurSec(Math.floor(c));
      setDurSec(Math.floor(d));
      setProgress(d > 0 ? (c / d) * 100 : 0);
    }, 500);
  }, []);

  const stopPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const stopThis = useCallback(() => {
    ytRef.current?.pauseVideo?.();
    setPlaying(false);
    playingRef.current = false;
    stopPoll();
  }, [stopPoll]);

  const handleEnded = useCallback(() => {
    setTrackIdx((i) => {
      const len = playlist.tracks.length;
      if (repeat)   return i;
      if (shuffle)  return Math.floor(Math.random() * len);
      return (i + 1) % len;
    });
  }, [repeat, shuffle, playlist.tracks.length]);

  const handlePlayPause = () => {
    if (!apiReady) return;
    if (playing) {
      ytRef.current.pauseVideo();
      setPlaying(false);
      playingRef.current = false;
    } else {
      if (_activeStop && _activeStop !== stopThis) _activeStop();
      _activeStop = stopThis;
      ytRef.current.playVideo();
      setPlaying(true);
      playingRef.current = true;
    }
  };

  const handlePrev = () => {
    if (curSec > 3) {
      ytRef.current?.seekTo?.(0, true);
    } else {
      setTrackIdx((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length);
    }
  };

  const handleNext = () => {
    setTrackIdx((i) =>
      shuffle ? Math.floor(Math.random() * playlist.tracks.length) : (i + 1) % playlist.tracks.length
    );
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!durSec) return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    ytRef.current?.seekTo?.(ratio * durSec, true);
    setProgress(ratio * 100);
  };

  const pickTrack = (i: number) => {
    if (i === trackIdx) { handlePlayPause(); return; }
    setTrackIdx(i);
    setTimeout(() => {
      if (_activeStop && _activeStop !== stopThis) _activeStop();
      _activeStop = stopThis;
      ytRef.current?.playVideo?.();
      setPlaying(true);
      playingRef.current = true;
    }, 120);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '–:––';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ delay: index * 0.11, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative select-none"
    >
      {/* Hidden YT mount point */}
      <div
        ref={holderRef}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
      >
        <div id={`yt-${playlist.id}`} />
      </div>

      {/* Card shell */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg,#1c1c1e 0%,#0d0d0d 100%)',
          boxShadow: `0 4px 20px 0 #0009`,
        }}
      >
        {/* Album art */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
          <img
            src={playlist.cover}
            alt={playlist.name}
            className="w-full h-full object-cover"
            style={{
              filter: playing ? 'brightness(0.8)' : 'brightness(0.6)',
              transform: playing ? 'scale(1.06)' : 'scale(1)',
              transition: 'filter .7s ease, transform .9s ease',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/5 to-transparent" />

          {/* Top bar */}
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#FF0000] flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                  <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/65">
                YouTube Music
              </span>
            </div>
            <a
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)' }}
            >
              <ExternalLink className="w-3 h-3 text-white/65" />
            </a>
          </div>

          {/* Vinyl spin */}
          {playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-14 h-14 rounded-full border-[3px] border-white/10 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle,#111 28%,transparent 72%)',
                  animation: 'ytcard-spin 4s linear infinite',
                }}
              >
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-3.5 pt-3 pb-4">
          {/* Track info + like */}
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex-1 min-w-0 pr-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${playlist.id}-${trackIdx}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-white font-bold text-[13px] leading-snug truncate">{track.title}</p>
                  <p className="text-white/45 text-[11px] mt-0.5 truncate">{track.artist}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <button onClick={() => setLiked((v) => !v)} className="mt-0.5 flex-shrink-0 active:scale-90 transition-transform">
              <Heart className={`w-4 h-4 transition-colors duration-200 ${liked ? 'fill-red-500 text-red-500' : 'text-white/30'}`} />
            </button>
          </div>

          {/* Progress */}
          <div
            className="relative h-[3px] rounded-full cursor-pointer group mb-1"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            onClick={handleSeek}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${progress}%`, background: playlist.accentColor, transition: 'width .3s linear' }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 5px)` }}
            />
          </div>
          <div className="flex justify-between mb-2.5">
            <span className="text-[9px] text-white/30 font-mono">{fmt(curSec)}</span>
            <span className="text-[9px] text-white/30 font-mono">{durSec ? fmt(durSec) : track.duration}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button onClick={() => setShuffle((v) => !v)} className="flex flex-col items-center gap-0.5">
              <Shuffle className={`w-3.5 h-3.5 transition-colors ${shuffle ? 'text-white' : 'text-white/28'}`} />
              {shuffle && <span className="w-1 h-1 rounded-full" style={{ background: playlist.accentColor }} />}
            </button>

            <button onClick={handlePrev} className="text-white/70 hover:text-white active:scale-90 transition-all">
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={!apiReady}
              className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 hover:brightness-110 transition-all disabled:opacity-50"
              style={{
                background: `radial-gradient(circle at 38% 38%,${playlist.accentColor}dd,${playlist.accentColor}88)`,
                boxShadow: `0 3px 16px ${playlist.accentColor}50`,
              }}
            >
              {playing
                ? <Pause className="w-5 h-5 text-white" fill="currentColor" />
                : <Play  className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
              }
            </button>

            <button onClick={handleNext} className="text-white/70 hover:text-white active:scale-90 transition-all">
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>

            <button onClick={() => setRepeat((v) => !v)} className="flex flex-col items-center gap-0.5">
              <Repeat className={`w-3.5 h-3.5 transition-colors ${repeat ? 'text-white' : 'text-white/28'}`} />
              {repeat && <span className="w-1 h-1 rounded-full" style={{ background: playlist.accentColor }} />}
            </button>
          </div>

          {/* Queue toggle */}
          <button
            onClick={() => setQueueOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 mt-3 py-1.5 rounded-lg transition-colors"
            style={{ background: queueOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)' }}
          >
            <ListMusic className="w-3 h-3 text-white/38" />
            <span className="text-[10px] text-white/38 font-medium">
              {playlist.name} · {playlist.tracks.length} songs
            </span>
            <ChevronUp
              className="w-3 h-3 text-white/22 transition-transform duration-300"
              style={{ transform: queueOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
          </button>

          {/* Queue list */}
          <AnimatePresence>
            {queueOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-0.5">
                  {playlist.tracks.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => pickTrack(i)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left"
                      style={{ background: i === trackIdx ? `${playlist.accentColor}1e` : 'transparent' }}
                    >
                      {i === trackIdx && playing ? (
                        <div className="w-5 flex items-end justify-center gap-px h-3.5 flex-shrink-0">
                          {[0, 1, 2].map((b) => (
                            <span key={b} className="w-[3px] rounded-sm"
                              style={{
                                background: playlist.accentColor,
                                height: '100%',
                                animation: `ytcard-eq ${0.5 + b * 0.18}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="w-5 text-center text-[10px] text-white/22 font-mono flex-shrink-0">{i + 1}</span>
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] font-semibold truncate leading-tight"
                          style={{ color: i === trackIdx ? playlist.textColor : 'rgba(255,255,255,0.68)' }}
                        >
                          {t.title}
                        </p>
                        <p className="text-[10px] text-white/28 truncate">{t.artist}</p>
                      </div>

                      <span className="text-[9px] text-white/22 font-mono flex-shrink-0">{t.duration}</span>
                    </button>
                  ))}

                  {/* CTA */}
                  <a
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg,${playlist.accentColor}18,${playlist.accentColor}09)`,
                      border: `1px solid ${playlist.accentColor}2e`,
                    }}
                  >
                    <ArrowUpRight className="w-3 h-3" style={{ color: playlist.accentColor }} />
                    <span className="text-[10px] font-semibold" style={{ color: `${playlist.accentColor}c0` }}>
                      Explore more songs I love →
                    </span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


    </motion.div>
  );
};

const PlaylistCards = () => {
  const { ref, isVisible } = useScrollAnimation(0.05, true);

  return (
    <section className="py-14 md:py-20">
      <style>{`
        @keyframes ytcard-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes ytcard-eq   { 0% { transform:scaleY(.25) } 100% { transform:scaleY(1) } }
      `}</style>

      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div
          ref={ref}
          className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Music2 className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">My Playlists</h3>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm ml-11">
            Songs I have on repeat, play directly here, or open the full playlist on YouTube Music.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-xs sm:max-w-none mx-auto">
          {playlists.map((pl, i) => (
            <PlayerCard key={pl.id} playlist={pl} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaylistCards;