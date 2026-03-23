import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Shuffle, SkipBack, SkipForward, Repeat, Play, Pause,
  Music2, ExternalLink, Heart, ListMusic, ChevronUp, ArrowUpRight,
} from 'lucide-react';

import ytRaavfyCover    from '@/assets/playlist/yt-music/Rv.jpg';
import ytEnglishCover   from '@/assets/playlist/yt-music/Hendem.jpg';
import ytJkt48Cover     from '@/assets/playlist/yt-music/Jkt.jpg';
import ytIndonesiaCover from '@/assets/playlist/yt-music/Indos.jpg';
import spRaavfyCover    from '@/assets/playlist/spotify/Rv.jfif';
import spEnglishCover   from '@/assets/playlist/spotify/hendem.jfif';
import spJkt48Cover     from '@/assets/playlist/spotify/jkt.jfif';
import spIndonesiaCover from '@/assets/playlist/spotify/indos.jfif';

type Platform = 'youtube' | 'spotify';
interface YTTrack  { title: string; artist: string; duration: string; videoId: string; }
interface SPTrack  { title: string; artist: string; duration: string; trackId: string; }
interface YTPlaylist { id: string; name: string; cover: string; tracks: YTTrack[]; url: string; accentColor: string; textColor: string; }
interface SPPlaylist { id: string; name: string; cover: string; tracks: SPTrack[]; url: string; accentColor: string; textColor: string; }

const SP_GREEN = '#1DB954';

const ytPlaylists: YTPlaylist[] = [
  { id: 'yt-raavfy', name: 'Raavfy Songs', cover: ytRaavfyCover, accentColor: '#7c3aed', textColor: '#ede9fe',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40nnZWNJp_R00Oh0YjojKFR9&si=tjbz3mVDX63s1N8Y',
    tracks: [
      { title: 'Kau Pilih Dia', artist: 'Raavfy, Mas Jordan, Malikoendang', duration: '3:30', videoId: 'nYefp88ahug' },
      { title: 'Persetan', artist: 'Raavfy', duration: '3:10', videoId: '2oQULwdi27I' },
      { title: 'Berubah', artist: 'Raavfy', duration: '3:45', videoId: 'BsBx8TmO0sI' },
    ],
  },
  { id: 'yt-english', name: 'English Songs', cover: ytEnglishCover, accentColor: '#0ea5e9', textColor: '#e0f2fe',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40mkQFJAVQFbS_xCiZz3grK3&si=6dUgLGUTZIR2lu7O',
    tracks: [
      { title: 'Those Eyes', artist: 'New West', duration: '3:10', videoId: 'YPeHGoGhHxg' },
      { title: 'Cut My Fingers Off', artist: 'Ethan Bortnick', duration: '3:05', videoId: 'MX4PW0bHM2w' },
      { title: 'From The Start', artist: 'Laufey', duration: '3:10', videoId: 'GtVxI5E0JHE' },
    ],
  },
  { id: 'yt-jkt48', name: 'JKT48 Songs', cover: ytJkt48Cover, accentColor: '#e11d48', textColor: '#fce7f3',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40lDS5ViQN_vPXduLjPkMoRz&si=cYPB-QJM0PFSuhJP',
    tracks: [
      { title: 'Sahabat atau Cinta', artist: 'JKT48', duration: '4:05', videoId: 'Sq0oSlmbDOc' },
      { title: 'Dai Dai Dai', artist: 'JKT48', duration: '4:20', videoId: '4_LDao9Aop8' },
      { title: 'Ada Aku!', artist: 'JKT48', duration: '3:50', videoId: '093VUafY4Po' },
    ],
  },
  { id: 'yt-indonesia', name: 'Indonesia Songs', cover: ytIndonesiaCover, accentColor: '#d97706', textColor: '#fef3c7',
    url: 'https://music.youtube.com/playlist?list=PLlusqwJxX40m_RClswTPLJx1lMlh5VCO2&si=Akjk12r6W2p5rUIl',
    tracks: [
      { title: 'Di Batas Malam', artist: 'Danilla', duration: '4:10', videoId: 'HYSQ_3Ti86g' },
      { title: 'Pecinta Wanita', artist: 'Irwansyah', duration: '3:55', videoId: 'Figow1PoksI' },
      { title: 'Monolog', artist: 'Pamungkas', duration: '4:30', videoId: 'w_0RyTy-GlA' },
    ],
  },
];

const spPlaylists: SPPlaylist[] = [
  { id: 'sp-raavfy', name: 'Raavfy Songs', cover: spRaavfyCover, accentColor: '#7c3aed', textColor: '#ede9fe',
    url: 'https://open.spotify.com/playlist/68mcR8wRMnnnoa69W85PIH',
    tracks: [
      { title: 'Kau Pilih Dia', artist: 'Raavfy, Mas Jordan, Malikoendang', duration: '3:30', trackId: '4EzaRRchzCQ2iRpWtbjBwD' },
      { title: 'Persetan', artist: 'Raavfy', duration: '3:10', trackId: '4yuMV2AQKsTuUhfxE8Ico9' },
      { title: 'Berubah', artist: 'Raavfy', duration: '3:45', trackId: '6xviSogMq7TaDFYviPh3Xs' },
    ],
  },
  { id: 'sp-english', name: 'English Songs', cover: spEnglishCover, accentColor: '#0ea5e9', textColor: '#e0f2fe',
    url: 'https://open.spotify.com/playlist/3cm56kPrALzrJ2XayLL1Nw',
    tracks: [
      { title: 'Those Eyes', artist: 'New West', duration: '3:10', trackId: '50x1Ic8CaXkYNvjmxe3WXy' },
      { title: 'Cut My Fingers Off', artist: 'Ethan Bortnick', duration: '3:05', trackId: '5ARrWiDDRDocvURbemcnCy' },
      { title: 'From The Start', artist: 'Laufey', duration: '3:10', trackId: '43iIQbw5hx986dUEZbr3eN' },
    ],
  },
  { id: 'sp-jkt48', name: 'JKT48 Songs', cover: spJkt48Cover, accentColor: '#e11d48', textColor: '#fce7f3',
    url: 'https://open.spotify.com/playlist/2NbVci6S6mIHQFabr5AhGI',
    tracks: [
      { title: 'Sahabat atau Cinta', artist: 'JKT48', duration: '4:05', trackId: '6gmPSVwfO97scRd3UnDCUz' },
      { title: 'Dai Dai Dai', artist: 'JKT48', duration: '4:20', trackId: '6LcRqI57FUeEXgLD9fnegZ' },
      { title: 'Ada Aku!', artist: 'JKT48', duration: '3:50', trackId: '5anzL9URc82SrVbJZRFFpe' },
    ],
  },
  { id: 'sp-indonesia', name: 'Indonesia Songs', cover: spIndonesiaCover, accentColor: '#d97706', textColor: '#fef3c7',
    url: 'https://open.spotify.com/playlist/1hbxHHaQq4WHS7znfyvsHz',
    tracks: [
      { title: 'Di Batas Malam', artist: 'Danilla', duration: '4:10', trackId: '57wJkQVl4krsMHaowArNgc' },
      { title: 'Pecinta Wanita', artist: 'Irwansyah', duration: '3:55', trackId: '0sMclGmddV8xeqBgI2k2yB' },
      { title: 'Monolog', artist: 'Pamungkas', duration: '4:30', trackId: '1zu5ZpnrSArdoaT6Qq3yo9' },
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
  s.id = 'yt-iframe-api'; s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
  (window as any).onYouTubeIframeAPIReady = () => { _ytReady = true; _ytQueue.forEach(fn => fn()); _ytQueue.length = 0; };
}

let _spReady = false;
const _spQueue: (() => void)[] = [];
function loadSpotifyApi(cb: () => void) {
  if (_spReady) { cb(); return; }
  _spQueue.push(cb);
  if (document.getElementById('spotify-iframe-api')) return;
  const s = document.createElement('script');
  s.id = 'spotify-iframe-api'; s.src = 'https://open.spotify.com/embed/iframe-api/v1';
  document.head.appendChild(s);
  (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
    (window as any)._SpotifyIFrameAPI = IFrameAPI;
    _spReady = true; _spQueue.forEach(fn => fn()); _spQueue.length = 0;
  };
}

let _activeStop: (() => void) | null = null;

const SpotifyIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const EqBars = ({ color }: { color: string }) => (
  <div className="w-5 flex items-end justify-center gap-px h-3.5 flex-shrink-0">
    {[0, 1, 2].map(b => (
      <span key={b} className="w-[3px] rounded-sm"
        style={{ background: color, height: '100%', animation: `card-eq ${0.5 + b * 0.19}s ease-in-out infinite alternate` }} />
    ))}
  </div>
);

const VinylDisc = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-14 h-14 rounded-full border-[3px] border-white/10 flex items-center justify-center"
      style={{ background: 'radial-gradient(circle,#111 28%,transparent 72%)', animation: 'card-spin 4s linear infinite' }}>
      <div className="w-3 h-3 rounded-full bg-white/20" />
    </div>
  </div>
);

const YTPlayerCard = ({ playlist, index, isVisible }: { playlist: YTPlaylist; index: number; isVisible: boolean }) => {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [curSec, setCurSec] = useState(0);
  const [durSec, setDurSec] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ytRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);
  const trackIdxRef = useRef(0);
  const durSecRef = useRef(0);
  const isDraggingRef = useRef(false);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { trackIdxRef.current = trackIdx; }, [trackIdx]);
  useEffect(() => { durSecRef.current = durSec; }, [durSec]);
  const track = playlist.tracks[trackIdx];
  const fmt = (s: number) => { if (!s || isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };
  const startPoll = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      const p = ytRef.current;
      if (!p?.getCurrentTime) return;
      const c = p.getCurrentTime(), d = p.getDuration();
      if (!isDraggingRef.current) { setCurSec(Math.floor(c)); setProgress(d > 0 ? (c / d) * 100 : 0); }
      setDurSec(Math.floor(d));
    }, 250);
  }, []);
  const stopPoll = useCallback(() => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } }, []);
  const stopThis = useCallback(() => { ytRef.current?.pauseVideo?.(); setPlaying(false); playingRef.current = false; stopPoll(); }, [stopPoll]);
  const handleEnded = useCallback(() => {
    const len = playlist.tracks.length, cur = trackIdxRef.current;
    if (repeatRef.current) { setTimeout(() => { ytRef.current?.seekTo?.(0, true); ytRef.current?.playVideo?.(); }, 50); return; }
    let next: number;
    if (shuffleRef.current) { do { next = Math.floor(Math.random() * len); } while (len > 1 && next === cur); } else next = (cur + 1) % len;
    setTrackIdx(next); trackIdxRef.current = next;
    setTimeout(() => { ytRef.current?.loadVideoById?.(playlist.tracks[next].videoId); }, 80);
  }, [playlist.tracks]);
  useEffect(() => {
    loadYTApi(() => {
      if (!holderRef.current) return;
      ytRef.current = new (window as any).YT.Player(`yt-${playlist.id}`, {
        height: '1', width: '1', videoId: playlist.tracks[0].videoId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, iv_load_policy: 3, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => setApiReady(true),
          onStateChange: (e: any) => {
            const S = (window as any).YT?.PlayerState; if (!S) return;
            if (e.data === S.PLAYING) { setPlaying(true); playingRef.current = true; startPoll(); }
            if (e.data === S.PAUSED || e.data === S.BUFFERING) { setPlaying(false); playingRef.current = false; stopPoll(); }
            if (e.data === S.ENDED) handleEnded();
          },
        },
      });
    });
    return () => { stopPoll(); ytRef.current?.destroy?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!apiReady) return;
    if (playingRef.current) ytRef.current?.loadVideoById?.(track.videoId); else ytRef.current?.cueVideoById?.(track.videoId);
    if (!isDraggingRef.current) { setProgress(0); setCurSec(0); } setDurSec(0);
  }, [trackIdx, apiReady]);
  const handlePlayPause = () => {
    if (!apiReady) return;
    if (playing) { ytRef.current.pauseVideo(); setPlaying(false); playingRef.current = false; }
    else { if (_activeStop && _activeStop !== stopThis) _activeStop(); _activeStop = stopThis; ytRef.current.playVideo(); setPlaying(true); playingRef.current = true; }
  };
  const handlePrev = () => { if (curSec > 3) ytRef.current?.seekTo?.(0, true); else setTrackIdx((trackIdxRef.current - 1 + playlist.tracks.length) % playlist.tracks.length); };
  const handleNext = () => {
    const len = playlist.tracks.length, cur = trackIdxRef.current; let next: number;
    if (shuffleRef.current) { do { next = Math.floor(Math.random() * len); } while (len > 1 && next === cur); } else next = (cur + 1) % len;
    setTrackIdx(next);
  };
  const pickTrack = (i: number) => {
    if (i === trackIdx) { handlePlayPause(); return; } setTrackIdx(i); trackIdxRef.current = i;
    setTimeout(() => { if (_activeStop && _activeStop !== stopThis) _activeStop(); _activeStop = stopThis; ytRef.current?.playVideo?.(); setPlaying(true); playingRef.current = true; }, 120);
  };
  const getBarRatio = (x: number) => { const r = barRef.current?.getBoundingClientRect(); if (!r) return 0; return Math.max(0, Math.min(1, (x - r.left) / r.width)); };
  const handleBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); isDraggingRef.current = true; setIsDragging(true); stopPoll();
    const ratio = getBarRatio(e.clientX); setProgress(ratio * 100); setCurSec(Math.floor(ratio * durSecRef.current));
    const onMove = (me: MouseEvent) => { const r = getBarRatio(me.clientX); setProgress(r * 100); setCurSec(Math.floor(r * durSecRef.current)); };
    const onUp = (me: MouseEvent) => {
      isDraggingRef.current = false; setIsDragging(false); const r = getBarRatio(me.clientX); const s = r * durSecRef.current;
      setProgress(r * 100); setCurSec(Math.floor(s)); ytRef.current?.seekTo?.(s, true); if (playingRef.current) startPoll();
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };
  const handleBarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); isDraggingRef.current = true; setIsDragging(true); stopPoll();
    const ratio = getBarRatio(e.touches[0].clientX); setProgress(ratio * 100); setCurSec(Math.floor(ratio * durSecRef.current));
    const onMove = (te: TouchEvent) => { const r = getBarRatio(te.touches[0].clientX); setProgress(r * 100); setCurSec(Math.floor(r * durSecRef.current)); };
    const onEnd = (te: TouchEvent) => {
      isDraggingRef.current = false; setIsDragging(false); const r = getBarRatio(te.changedTouches[0].clientX); const s = r * durSecRef.current;
      setProgress(r * 100); setCurSec(Math.floor(s)); ytRef.current?.seekTo?.(s, true); if (playingRef.current) startPoll();
      window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: false }); window.addEventListener('touchend', onEnd);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }} transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative select-none">
      <div ref={holderRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}><div id={`yt-${playlist.id}`} /></div>
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg,#1c1c1e 0%,#0d0d0d 100%)', boxShadow: '0 4px 20px 0 #0009' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" style={{ filter: playing ? 'brightness(0.8)' : 'brightness(0.6)', transform: playing ? 'scale(1.06)' : 'scale(1)', transition: 'filter .7s ease, transform .9s ease' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/5 to-transparent" />
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#FF0000] flex items-center justify-center shadow-sm"><svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white"><polygon points="9.5,7.5 16.5,12 9.5,16.5" /></svg></div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/65">YouTube Music</span>
            </div>
            <a href={playlist.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)' }}><ExternalLink className="w-3 h-3 text-white/65" /></a>
          </div>
          {playing && <VinylDisc />}
        </div>
        <div className="px-3.5 pt-3 pb-4">
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex-1 min-w-0 pr-2">
              <AnimatePresence mode="wait">
                <motion.div key={`${playlist.id}-${trackIdx}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
                  <p className="text-white font-bold text-[13px] leading-snug truncate">{track.title}</p>
                  <p className="text-white/45 text-[11px] mt-0.5 truncate">{track.artist}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <button onClick={() => setLiked(v => !v)} className="mt-0.5 flex-shrink-0 active:scale-90 transition-transform"><Heart className={`w-4 h-4 transition-colors duration-200 ${liked ? 'fill-red-500 text-red-500' : 'text-white/30'}`} /></button>
          </div>
          <div ref={barRef} className="relative h-[3px] rounded-full cursor-pointer group mb-1 touch-none" style={{ background: 'rgba(255,255,255,0.12)' }} onMouseDown={handleBarMouseDown} onTouchStart={handleBarTouchStart}>
            <div className="absolute left-0 top-0 h-full rounded-full pointer-events-none" style={{ width: `${progress}%`, background: playlist.accentColor, transition: isDragging ? 'none' : 'width .3s linear' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 pointer-events-none" style={{ left: `calc(${progress}% - 5px)`, opacity: isDragging ? 1 : undefined, transition: isDragging ? 'none' : undefined }} />
          </div>
          <div className="flex justify-between mb-2.5"><span className="text-[9px] text-white/30 font-mono">{fmt(curSec)}</span><span className="text-[9px] text-white/30 font-mono">{durSec ? fmt(durSec) : track.duration}</span></div>
          <div className="flex items-center justify-between">
            <button onClick={() => setShuffle(v => !v)} className="flex flex-col items-center gap-0.5" title={shuffle ? 'Shuffle: ON' : 'Shuffle: OFF'}><Shuffle className={`w-3.5 h-3.5 transition-colors ${shuffle ? 'text-white' : 'text-white/28'}`} />{shuffle && <span className="w-1 h-1 rounded-full" style={{ background: playlist.accentColor }} />}</button>
            <button onClick={handlePrev} className="text-white/70 hover:text-white active:scale-90 transition-all"><SkipBack className="w-5 h-5" fill="currentColor" /></button>
            <button onClick={handlePlayPause} disabled={!apiReady} className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 hover:brightness-110 transition-all disabled:opacity-50" style={{ background: `radial-gradient(circle at 38% 38%,${playlist.accentColor}dd,${playlist.accentColor}88)`, boxShadow: `0 3px 16px ${playlist.accentColor}50` }}>{playing ? <Pause className="w-5 h-5 text-white" fill="currentColor" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />}</button>
            <button onClick={handleNext} className="text-white/70 hover:text-white active:scale-90 transition-all"><SkipForward className="w-5 h-5" fill="currentColor" /></button>
            <button onClick={() => setRepeat(v => !v)} className="flex flex-col items-center gap-0.5" title={repeat ? 'Repeat: ON' : 'Repeat: OFF'}><Repeat className={`w-3.5 h-3.5 transition-colors ${repeat ? 'text-white' : 'text-white/28'}`} />{repeat && <span className="w-1 h-1 rounded-full" style={{ background: playlist.accentColor }} />}</button>
          </div>
          <button onClick={() => setQueueOpen(v => !v)} className="w-full flex items-center justify-center gap-1.5 mt-3 py-1.5 rounded-lg transition-colors" style={{ background: queueOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)' }}>
            <ListMusic className="w-3 h-3 text-white/38" /><span className="text-[10px] text-white/38 font-medium">{playlist.name} · {playlist.tracks.length} songs</span>
            <ChevronUp className="w-3 h-3 text-white/22 transition-transform duration-300" style={{ transform: queueOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </button>
          <AnimatePresence>{queueOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }} className="overflow-hidden"><div className="mt-2 space-y-0.5">{playlist.tracks.map((t, i) => (<button key={i} onClick={() => pickTrack(i)} className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left" style={{ background: i === trackIdx ? `${playlist.accentColor}1e` : 'transparent' }}>{i === trackIdx && playing ? <EqBars color={playlist.accentColor} /> : <span className="w-5 text-center text-[10px] text-white/22 font-mono flex-shrink-0">{i + 1}</span>}<div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate leading-tight" style={{ color: i === trackIdx ? playlist.textColor : 'rgba(255,255,255,0.68)' }}>{t.title}</p><p className="text-[10px] text-white/28 truncate">{t.artist}</p></div><span className="text-[9px] text-white/22 font-mono flex-shrink-0">{t.duration}</span></button>))}<a href={playlist.url} target="_blank" rel="noopener noreferrer" className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: `linear-gradient(135deg,${playlist.accentColor}18,${playlist.accentColor}09)`, border: `1px solid ${playlist.accentColor}2e` }}><ArrowUpRight className="w-3 h-3" style={{ color: playlist.accentColor }} /><span className="text-[10px] font-semibold" style={{ color: `${playlist.accentColor}c0` }}>Explore more songs I love</span></a></div></motion.div>)}</AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const SPPlayerCard = ({ playlist, index, isVisible }: { playlist: SPPlaylist; index: number; isVisible: boolean }) => {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [curMs, setCurMs] = useState(0);
  const [durMs, setDurMs] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const playingRef = useRef(false);
  const trackIdxRef = useRef(0);
  const durMsRef = useRef(0);
  const isDraggingRef = useRef(false);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { trackIdxRef.current = trackIdx; }, [trackIdx]);
  useEffect(() => { durMsRef.current = durMs; }, [durMs]);
  const track = playlist.tracks[trackIdx];
  const fmt = (ms: number) => { if (!ms || isNaN(ms)) return '0:00'; const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const stopThis = useCallback(() => { controllerRef.current?.pause?.(); setPlaying(false); playingRef.current = false; }, []);
  useEffect(() => {
    loadSpotifyApi(() => {
      const IFrameAPI = (window as any)._SpotifyIFrameAPI;
      if (!IFrameAPI || !holderRef.current) return;
      const mountEl = holderRef.current.querySelector(`#sp-embed-${playlist.id}`);
      if (!mountEl) return;
      IFrameAPI.createController(mountEl, { uri: `spotify:track:${playlist.tracks[0].trackId}` }, (controller: any) => {
        controllerRef.current = controller; setApiReady(true);
        controller.addListener('playback_update', (e: any) => {
          const { position, duration, isPaused } = e.data;
          if (!isDraggingRef.current) { setCurMs(position); setProgress(duration > 0 ? (position / duration) * 100 : 0); }
          setDurMs(duration); durMsRef.current = duration;
          const isNowPlaying = !isPaused && duration > 0; setPlaying(isNowPlaying); playingRef.current = isNowPlaying;
          if (!isPaused && duration > 0 && duration - position < 800 && position > 0) {
            const len = playlist.tracks.length, cur = trackIdxRef.current;
            if (repeatRef.current) { setTimeout(() => { controller.seek(0); controller.play(); }, 100); return; }
            let next: number;
            if (shuffleRef.current) { do { next = Math.floor(Math.random() * len); } while (len > 1 && next === cur); } else next = (cur + 1) % len;
            setTrackIdx(next); trackIdxRef.current = next;
            setTimeout(() => { controller.loadUri(`spotify:track:${playlist.tracks[next].trackId}`); setTimeout(() => controller.play(), 400); }, 100);
          }
        });
      });
    });
    return () => { controllerRef.current?.destroy?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!apiReady || !controllerRef.current) return;
    trackIdxRef.current = trackIdx; controllerRef.current.loadUri(`spotify:track:${playlist.tracks[trackIdx].trackId}`);
    if (!isDraggingRef.current) { setProgress(0); setCurMs(0); } setDurMs(0);
    if (playingRef.current) setTimeout(() => controllerRef.current?.play(), 350);
  }, [trackIdx, apiReady]);
  const handlePlayPause = () => {
    if (!apiReady) return;
    if (playing) { controllerRef.current.pause(); setPlaying(false); playingRef.current = false; }
    else { if (_activeStop && _activeStop !== stopThis) _activeStop(); _activeStop = stopThis; controllerRef.current.play(); setPlaying(true); playingRef.current = true; }
  };
  const handlePrev = () => { if (curMs > 3000) controllerRef.current?.seek(0); else setTrackIdx((trackIdxRef.current - 1 + playlist.tracks.length) % playlist.tracks.length); };
  const handleNext = () => {
    const len = playlist.tracks.length, cur = trackIdxRef.current; let next: number;
    if (shuffleRef.current) { do { next = Math.floor(Math.random() * len); } while (len > 1 && next === cur); } else next = (cur + 1) % len;
    setTrackIdx(next);
  };
  const pickTrack = (i: number) => {
    if (i === trackIdx) { handlePlayPause(); return; } setTrackIdx(i); trackIdxRef.current = i;
    setTimeout(() => { if (_activeStop && _activeStop !== stopThis) _activeStop(); _activeStop = stopThis; controllerRef.current?.play(); setPlaying(true); playingRef.current = true; }, 450);
  };
  const getBarRatio = (x: number) => { const r = barRef.current?.getBoundingClientRect(); if (!r) return 0; return Math.max(0, Math.min(1, (x - r.left) / r.width)); };
  const handleBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); isDraggingRef.current = true; setIsDragging(true);
    const ratio = getBarRatio(e.clientX); setProgress(ratio * 100); setCurMs(Math.floor(ratio * durMsRef.current));
    const onMove = (me: MouseEvent) => { const r = getBarRatio(me.clientX); setProgress(r * 100); setCurMs(Math.floor(r * durMsRef.current)); };
    const onUp = (me: MouseEvent) => { isDraggingRef.current = false; setIsDragging(false); const r = getBarRatio(me.clientX); setProgress(r * 100); setCurMs(Math.floor(r * durMsRef.current)); controllerRef.current?.seek(r * durMsRef.current); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };
  const handleBarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); isDraggingRef.current = true; setIsDragging(true);
    const ratio = getBarRatio(e.touches[0].clientX); setProgress(ratio * 100); setCurMs(Math.floor(ratio * durMsRef.current));
    const onMove = (te: TouchEvent) => { const r = getBarRatio(te.touches[0].clientX); setProgress(r * 100); setCurMs(Math.floor(r * durMsRef.current)); };
    const onEnd = (te: TouchEvent) => { isDraggingRef.current = false; setIsDragging(false); const r = getBarRatio(te.changedTouches[0].clientX); setProgress(r * 100); setCurMs(Math.floor(r * durMsRef.current)); controllerRef.current?.seek(r * durMsRef.current); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: false }); window.addEventListener('touchend', onEnd);
  };
  const cardBg = `linear-gradient(160deg, color-mix(in srgb, ${playlist.accentColor} 20%, #1c1c1e) 0%, #0d0d0d 100%)`;
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }} transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative select-none">
      <div className="absolute -inset-[1px] rounded-[22px] opacity-25 blur-[3px] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${playlist.accentColor}88, transparent 65%)` }} />
      <div ref={holderRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden', top: 0, left: 0 }}><div id={`sp-embed-${playlist.id}`} /></div>
      <div className="relative rounded-[20px] overflow-hidden border border-white/[0.07]" style={{ background: cardBg, boxShadow: '0 6px 32px #0008, 0 0 0 1px rgba(255,255,255,0.04)' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" style={{ filter: playing ? 'brightness(0.75) saturate(1.15)' : 'brightness(0.55) saturate(0.85)', transform: playing ? 'scale(1.07)' : 'scale(1)', transition: 'filter .8s ease, transform 1.1s ease' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-25" style={{ background: `linear-gradient(to top, ${playlist.accentColor}55, transparent)` }} />
          <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}><SpotifyIcon size={10} className="text-[#1DB954]" /><span className="text-[9px] font-bold tracking-widest uppercase text-white/65">Spotify</span></div>
            <a href={playlist.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}><ExternalLink className="w-3 h-3 text-white/60" /></a>
          </div>
          {playing && <VinylDisc />}
        </div>
        <div className="px-3.5 pt-3 pb-4">
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex-1 min-w-0 pr-2">
              <AnimatePresence mode="wait"><motion.div key={`${playlist.id}-${trackIdx}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}><p className="text-white font-bold text-[13px] leading-snug truncate">{track.title}</p><p className="text-white/45 text-[11px] mt-0.5 truncate">{track.artist}</p></motion.div></AnimatePresence>
            </div>
            <button onClick={() => setLiked(v => !v)} className="mt-0.5 flex-shrink-0 active:scale-90 transition-transform"><Heart style={{ width: 16, height: 16 }} className={`transition-all duration-200 ${liked ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white/30'}`} /></button>
          </div>
          <div ref={barRef} className="relative h-[3px] rounded-full cursor-pointer group mb-1 touch-none" style={{ background: 'rgba(255,255,255,0.12)' }} onMouseDown={handleBarMouseDown} onTouchStart={handleBarTouchStart}>
            <div className="absolute left-0 top-0 h-full rounded-full pointer-events-none" style={{ width: `${progress}%`, background: SP_GREEN, transition: isDragging ? 'none' : 'width .3s linear' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 pointer-events-none" style={{ left: `calc(${progress}% - 5px)`, opacity: isDragging ? 1 : undefined, transition: isDragging ? 'none' : undefined }} />
          </div>
          <div className="flex justify-between mb-2.5"><span className="text-[9px] text-white/30 font-mono">{fmt(curMs)}</span><span className="text-[9px] text-white/30 font-mono">{durMs ? fmt(durMs) : track.duration}</span></div>
          <div className="flex items-center justify-between">
            <button onClick={() => setShuffle(v => !v)} className="flex flex-col items-center gap-0.5" title={shuffle ? 'Shuffle: ON' : 'Shuffle: OFF'}><Shuffle className={`w-3.5 h-3.5 transition-colors ${shuffle ? 'text-white' : 'text-white/28'}`} />{shuffle && <span className="w-1 h-1 rounded-full" style={{ background: SP_GREEN }} />}</button>
            <button onClick={handlePrev} className="text-white/70 hover:text-white active:scale-90 transition-all"><SkipBack className="w-5 h-5" fill="currentColor" /></button>
            <button onClick={handlePlayPause} disabled={!apiReady} className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 hover:brightness-110 transition-all disabled:opacity-50" style={{ background: `radial-gradient(circle at 38% 38%, ${SP_GREEN}ee, ${SP_GREEN}99)`, boxShadow: `0 3px 18px ${SP_GREEN}55` }}>{playing ? <Pause className="w-5 h-5 text-black" fill="currentColor" /> : <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />}</button>
            <button onClick={handleNext} className="text-white/70 hover:text-white active:scale-90 transition-all"><SkipForward className="w-5 h-5" fill="currentColor" /></button>
            <button onClick={() => setRepeat(v => !v)} className="flex flex-col items-center gap-0.5" title={repeat ? 'Repeat: ON' : 'Repeat: OFF'}><Repeat className={`w-3.5 h-3.5 transition-colors ${repeat ? 'text-white' : 'text-white/28'}`} />{repeat && <span className="w-1 h-1 rounded-full" style={{ background: SP_GREEN }} />}</button>
          </div>
          <button onClick={() => setQueueOpen(v => !v)} className="w-full flex items-center justify-center gap-1.5 mt-3 py-1.5 rounded-lg transition-colors" style={{ background: queueOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)' }}>
            <ListMusic className="w-3 h-3 text-white/38" /><span className="text-[10px] text-white/38 font-medium">{playlist.name} · {playlist.tracks.length} songs</span>
            <ChevronUp className="w-3 h-3 text-white/22 transition-transform duration-300" style={{ transform: queueOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </button>
          <AnimatePresence>{queueOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }} className="overflow-hidden"><div className="mt-2 space-y-0.5">{playlist.tracks.map((t, i) => (<button key={i} onClick={() => pickTrack(i)} className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left" style={{ background: i === trackIdx ? `${playlist.accentColor}1e` : 'transparent' }}>{i === trackIdx && playing ? <EqBars color={SP_GREEN} /> : <span className="w-5 text-center text-[10px] text-white/22 font-mono flex-shrink-0">{i + 1}</span>}<div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate leading-tight" style={{ color: i === trackIdx ? SP_GREEN : 'rgba(255,255,255,0.68)' }}>{t.title}</p><p className="text-[10px] text-white/28 truncate">{t.artist}</p></div><span className="text-[9px] text-white/22 font-mono flex-shrink-0">{t.duration}</span></button>))}<a href={playlist.url} target="_blank" rel="noopener noreferrer" className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: 'linear-gradient(135deg,rgba(29,185,84,0.14),rgba(29,185,84,0.06))', border: '1px solid rgba(29,185,84,0.22)' }}><ArrowUpRight className="w-3 h-3" style={{ color: `${SP_GREEN}cc` }} /><span className="text-[10px] font-semibold" style={{ color: `${SP_GREEN}b0` }}>Explore more songs I love</span></a></div></motion.div>)}</AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const PlatformBtn = ({ platform, active, onClick }: { platform: Platform; active: boolean; onClick: () => void }) => {
  const isYT = platform === 'youtube';
  const color  = isYT ? '#FF0000' : SP_GREEN;
  const label  = isYT ? 'YouTube Music' : 'Spotify';
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[13px] font-semibold tracking-wide transition-all duration-300 overflow-hidden"
      style={{
        background: active ? `${color}15` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${active ? `${color}40` : 'rgba(255,255,255,0.09)'}`,
        color: active ? color : 'rgba(255,255,255,0.38)',
        boxShadow: active ? `0 0 22px ${color}20` : 'none',
      }}>
      {active && <motion.div layoutId="pl-glow" className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 120%, ${color}18, transparent 65%)` }} />}
      <span className="relative flex-shrink-0" style={{ color: active ? color : 'rgba(255,255,255,0.28)' }}>
        {isYT
          ? <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm-1.5 17.25V6.75L18.75 12l-8.25 5.25z"/></svg>
          : <SpotifyIcon size={16} />
        }
      </span>
      <span className="relative">{label}</span>
      {active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />}
    </motion.button>
  );
};

const PlaylistCards = () => {
  const { ref, isVisible } = useScrollAnimation(0.05, true);
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [animKey, setAnimKey] = useState(0);

  const handleSwitch = (p: Platform) => {
    if (p === platform) return;
    setPlatform(p); setAnimKey(k => k + 1);
    if (_activeStop) { _activeStop(); _activeStop = null; }
  };

  const slideX = platform === 'spotify' ? 40 : -40;

  return (
    <section className="py-14 md:py-20">
      <style>{`
        @keyframes card-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes card-eq   { 0% { transform: scaleY(0.25); } 100% { transform: scaleY(1); } }
      `}</style>
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Music2 className="w-4 h-4 text-primary" /></div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">My Playlists</h3>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm ml-11">Songs I have on repeat.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={animKey}
            initial={{ opacity: 0, x: slideX }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideX }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-xs sm:max-w-none mx-auto">
            {platform === 'youtube'
              ? ytPlaylists.map((pl, i) => <YTPlayerCard key={pl.id} playlist={pl} index={i} isVisible={isVisible} />)
              : spPlaylists.map((pl, i) => <SPPlayerCard key={pl.id} playlist={pl} index={i} isVisible={isVisible} />)
            }
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mt-8">
          <PlatformBtn platform="youtube" active={platform === 'youtube'} onClick={() => handleSwitch('youtube')} />
          <PlatformBtn platform="spotify" active={platform === 'spotify'} onClick={() => handleSwitch('spotify')} />
        </div>
      </div>
    </section>
  );
};

export default PlaylistCards;
