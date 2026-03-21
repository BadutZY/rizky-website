import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import kimmy1 from "@/assets/wife/kimmy-1.jpg";
import idnLogo from "@/assets/icons/idn-logo.png";
import showroomLogo from "@/assets/icons/showroom-logo.png";

const IDN_USERNAME = "jkt48_kimmy";
const SHOWROOM_KEY = "JKT48_Kimmy";

const DISPLAY_NAME = "Victoria Kimberly";
const FOLLOWERS    = "150K";
const FOLLOWING    = "49";

type PlatformStatus = {
  isLive:      boolean;
  isChecking:  boolean;
  lastChecked: string | null;
  liveUrl:     string | null;
  streamUrl:   string | null;
  slug:        string | null;
};

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html        = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevHeight   = html.style.height;
    html.style.overflow = "hidden";
    html.style.height   = "100%";
    return () => {
      html.style.overflow = prevOverflow;
      html.style.height   = prevHeight;
    };
  }, [active]);
}

type UrlQuality    = { label: string; url: string };
type HlsQuality    = { index: number; label: string; height: number };

const IconVolume  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const IconMute    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;
const IconExpand  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;
const IconShrink  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>;
const IconPiP     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="2"/><rect x="12" y="13" width="8" height="6" rx="1" fill="currentColor" stroke="none"/></svg>;
const IconRefresh = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const IconTheater = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 2"/></svg>;
const IconQuality = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;

const HlsPlayer = ({
  isOpen,
  streamUrl,
  streamQualities,
  liveRoomUrl,
  platformName,
  onClose,
  onRefresh,
}: {
  isOpen:           boolean;
  streamUrl:        string;
  streamQualities:  UrlQuality[];
  liveRoomUrl:      string;
  platformName:     string;
  onClose:          () => void;
  onRefresh:        () => Promise<string | null>;
}) => {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const hlsRef       = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hideTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef  = useRef(false);
  const volTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playerState,       setPlayerState]       = useState<"loading"|"playing"|"error"|"refreshing">("loading");
  const [errorMsg,          setErrorMsg]           = useState("");
  const [isMuted,           setIsMuted]           = useState(false);
  const [volume,            setVolume]            = useState(1);
  const [showVolume,        setShowVolume]        = useState(false);
  const [isFullscreen,      setIsFullscreen]      = useState(false);
  const [isTheater,         setIsTheater]         = useState(false);
  const [showControls,      setShowControls]      = useState(true);
  const [hlsQualities,      setHlsQualities]      = useState<HlsQuality[]>([]);
  const [currentHlsLevel,   setCurrentHlsLevel]   = useState<number>(-1);
  const [activeUrlQuality,  setActiveUrlQuality]  = useState<string>("");
  const [showQuality,       setShowQuality]       = useState(false);
  const [latency,           setLatency]           = useState<number|null>(null);
  const [isPiPActive,       setIsPiPActive]       = useState(false);

  useScrollLock(isOpen);

  const startHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!isHoveringRef.current) setShowControls(false);
    }, 3000);
  }, []);

  const cancelHideTimer = useCallback(() => {
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
  }, []);

  const handleVideoMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    cancelHideTimer();
    setShowControls(true);
  }, [cancelHideTimer]);

  const handleVideoMouseMove = useCallback(() => {
    setShowControls(true);
    startHideTimer();
  }, [startHideTimer]);

  const handleVideoMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    startHideTimer();
  }, [startHideTimer]);

  const handleControlBarEnter = useCallback(() => {
    cancelHideTimer();
    setShowControls(true);
  }, [cancelHideTimer]);

  const handleControlBarLeave = useCallback(() => {
    startHideTimer();
  }, [startHideTimer]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (showQuality) setShowQuality(false); else onClose(); }
      if (e.key === "m" || e.key === "M") toggleMute();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "t" || e.key === "T") setIsTheater(p => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, showQuality]);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnter = () => setIsPiPActive(true);
    const onLeave = () => setIsPiPActive(false);
    video.addEventListener("enterpictureinpicture", onEnter);
    video.addEventListener("leavepictureinpicture",  onLeave);
    return () => { video.removeEventListener("enterpictureinpicture", onEnter); video.removeEventListener("leavepictureinpicture", onLeave); };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.src = ""; }
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setHlsQualities([]); setCurrentHlsLevel(-1); setLatency(null);
      setIsTheater(false); setShowQuality(false); setActiveUrlQuality("");
    }
  }, [isOpen]);

  const loadStream = useCallback(async (url: string) => {
    const video = videoRef.current;
    if (!video) return;
    setPlayerState("loading");
    setHlsQualities([]); setCurrentHlsLevel(-1);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(() => {});
      setPlayerState("playing");
      return;
    }
    try {
      const { default: Hls } = await import("hls.js");
      if (!Hls.isSupported()) { setErrorMsg("Your browser does not support HLS."); setPlayerState("error"); return; }
      if (hlsRef.current) hlsRef.current.destroy();

      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_: any, data: any) => {
        video.play().catch(() => {});
        setPlayerState("playing");
        if (data.levels && data.levels.length > 1) {
          const seen = new Set<string>();
          const levels: HlsQuality[] = data.levels
            .map((lvl: any, i: number) => ({
              index: i,
              label: lvl.height ? `${lvl.height}p` : `Level ${i + 1}`,
              height: lvl.height ?? 0,
            }))
            .sort((a: HlsQuality, b: HlsQuality) => b.height - a.height)
            .filter((l: HlsQuality) => { if (seen.has(l.label)) return false; seen.add(l.label); return true; });
          setHlsQualities(levels);
          setCurrentHlsLevel(-1);
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        try {
          const lat = (hls as any).latency;
          if (lat != null && isFinite(lat)) setLatency(Math.round(lat));
        } catch { /* ignore */ }
      });

      hls.on(Hls.Events.ERROR, (_: any, data: any) => {
        if (data.fatal) {
          setErrorMsg(data.type === "networkError"
            ? "Stream could not be loaded. The token may have expired."
            : "An error occurred while playing the stream.");
          setPlayerState("error");
        }
      });
    } catch {
      setErrorMsg("Failed to load HLS player."); setPlayerState("error");
    }
  }, []);

  useEffect(() => {
    if (isOpen && streamUrl) {
      setErrorMsg("");
      if (streamQualities.length > 0) setActiveUrlQuality(streamUrl);
      loadStream(streamUrl);
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [isOpen, streamUrl, loadStream]);

  const handleRefreshStream = useCallback(async () => {
    setPlayerState("refreshing");
    const newUrl = await onRefresh();
    if (newUrl) { await loadStream(newUrl); }
    else { setErrorMsg("Failed to refresh. Try opening directly on the platform."); setPlayerState("error"); }
  }, [onRefresh, loadStream]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVolume = useCallback((val: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    video.muted  = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) await el.requestFullscreen().catch(() => {});
    else await document.exitFullscreen().catch(() => {});
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) await document.exitPictureInPicture().catch(() => {});
    else await video.requestPictureInPicture().catch(() => {});
  }, []);

  const switchHlsLevel = useCallback((levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    hls.currentLevel = levelIndex;
    setCurrentHlsLevel(levelIndex);
    setShowQuality(false);
  }, []);

  const switchUrlQuality = useCallback((urlQ: UrlQuality) => {
    setActiveUrlQuality(urlQ.url);
    setShowQuality(false);
    loadStream(urlQ.url);
  }, [loadStream]);

  const hasUrlQualities = streamQualities.length > 1;
  const hasHlsQualities = hlsQualities.length > 1;
  const showQualityBtn  = hasUrlQualities || hasHlsQualities;

  const currentQualityLabel = hasUrlQualities
    ? (streamQualities.find(q => q.url === activeUrlQuality)?.label ?? streamQualities[0]?.label ?? "Quality")
    : currentHlsLevel === -1
      ? "Auto"
      : (hlsQualities.find(q => q.index === currentHlsLevel)?.label ?? "Auto");

  const E = {
    easeOut:  [0.0, 0.0, 0.2, 1.0] as [number,number,number,number],
    easeIn:   [0.4, 0.0, 1.0, 1.0] as [number,number,number,number],
    tvOut:    [0.55, 0, 1, 0.45]   as [number,number,number,number],
    spring:   { type: "spring" as const, stiffness: 240, damping: 22, mass: 0.9 },
    springX:  { type: "spring" as const, stiffness: 280, damping: 26, delay: 0.03 },
  };

  const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3,  ease: E.easeOut } },
    exit:    { opacity: 0, transition: { duration: 0.35, ease: E.easeIn, delay: 0.15 } },
  };
  const tvVariants = {
    hidden:  { scaleY: 0.02, scaleX: 0.88, opacity: 1, filter: "brightness(2.5) blur(3px)" },
    visible: {
      scaleY: 1, scaleX: 1, opacity: 1, filter: "brightness(1) blur(0px)",
      transition: {
        scaleY:          E.spring,
        scaleX:          E.springX,
        filter:          { duration: 0.45, ease: E.easeOut, delay: 0.05 },
        opacity:         { duration: 0.01 },
        staggerChildren: 0.07,
        delayChildren:   0.28,
      },
    },
    exit: {
      scaleY: 0.02, scaleX: 0.84, opacity: 0, filter: "brightness(4) blur(6px)",
      transition: {
        scaleY:  { duration: 0.2,  ease: E.tvOut },
        scaleX:  { duration: 0.26, ease: E.tvOut },
        opacity: { duration: 0.16, ease: E.easeIn, delay: 0.15 },
        filter:  { duration: 0.18, ease: E.easeIn },
      },
    },
  };
  const childVariants  = {
    hidden:  { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.26, ease: E.easeOut } },
    exit:    { opacity: 0, y: -6, transition: { duration: 0.12 } },
  };
  const videoVariants  = {
    hidden:  { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1,   transition: { duration: 0.32, ease: E.easeOut } },
    exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
  };
  const footerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, delay: 0.12 } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  };

  const maxW = isTheater ? "max-w-5xl" : "max-w-3xl";

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="hls-overlay"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          style={{ position: "fixed", inset: 0, zIndex: 99999 }}
          className="flex flex-col items-center justify-center p-3 md:p-4"
          onTouchMove={(e) => e.preventDefault()}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            style={{ background: "rgba(0,0,0,0.94)", backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(16px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: E.easeOut }}
            onClick={onClose}
          />

          {/* Ambient glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: 800, height: 450, background: "radial-gradient(ellipse at center,hsl(var(--primary)/0.14) 0%,transparent 70%)", filter: "blur(56px)" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* TV container */}
          <motion.div
            key="hls-content"
            variants={tvVariants}
            initial="hidden" animate="visible" exit="exit"
            className={`relative z-10 w-full ${maxW} transition-all duration-500`}
            style={{ transformOrigin: "center center" }}
          >
            {/* Scan-line on open */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-20 overflow-hidden"
              initial={{ opacity: 1 }} animate={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: E.easeOut, delay: 0.12 }}
            >
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.025) 3px,rgba(255,255,255,0.025) 4px)" }} />
              <motion.div
                style={{ position: "absolute", left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent 0%,hsl(var(--primary)) 50%,transparent 100%)", boxShadow: "0 0 14px hsl(var(--primary))" }}
                initial={{ top: "-2%" }} animate={{ top: "104%" }}
                transition={{ duration: 0.52, ease: "linear", delay: 0.18 }}
              />
            </motion.div>

            {/* ── Top bar ── */}
            <motion.div
              variants={childVariants}
              className="flex items-center justify-between mb-2 px-1"
            >
              <div className="flex items-center gap-2.5">
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  style={{ boxShadow: "0 0 8px #ef4444" }}
                  animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                />
                <span className="text-white font-semibold text-sm tracking-widest uppercase">
                  Live · {platformName}
                </span>
                {latency !== null && playerState === "playing" && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                    {latency}s latency
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                <a
                  href={liveRoomUrl} target="_blank" rel="noopener noreferrer"
                  className="hidden sm:inline-flex text-xs text-white/50 hover:text-white/90 border border-white/12 hover:border-white/28 px-2.5 py-1.5 rounded-full transition-all duration-200"
                >
                  Open in {platformName} ↗
                </a>
                <motion.button
                  onClick={onClose}
                  className="text-xs text-white/50 hover:text-red-400 border border-white/12 hover:border-red-400/40 px-2.5 py-1.5 rounded-full transition-all duration-200"
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                >
                  ✕ Close
                </motion.button>
              </div>
            </motion.div>

            {/* ── Video wrapper ── */}
            <motion.div
              ref={containerRef}
              variants={videoVariants}
              className="w-full aspect-video bg-zinc-950 rounded-2xl overflow-hidden relative shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={handleVideoMouseEnter}
              onMouseMove={handleVideoMouseMove}
              onMouseLeave={handleVideoMouseLeave}
              onClick={() => { setShowQuality(false); }}
            >
              {/* Corner brackets */}
              {["top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl","top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl","bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl","bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl"].map((cls, i) => (
                <motion.div key={i} className={`absolute w-6 h-6 ${cls} pointer-events-none`}
                  style={{ borderColor: "hsl(var(--primary)/0.6)", zIndex: 10 }}
                  initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.28, delay: 0.36 + i * 0.055, ease: E.easeOut }}
                />
              ))}

              {/* Video element — no native controls */}
              <video ref={videoRef} className="w-full h-full" autoPlay playsInline />

              {/* ── Custom control bar ── */}
              <AnimatePresence>
                {showControls && playerState === "playing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: E.easeOut }}
                    className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-10"
                    style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 100%)" }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={handleControlBarEnter}
                    onMouseLeave={handleControlBarLeave}
                  >
                    <div className="flex items-center gap-2">

                      {/* LIVE badge */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-600/90 mr-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span className="text-white text-[10px] font-black tracking-widest">LIVE</span>
                      </div>

                      {/* Volume */}
                      <div className="relative flex items-center gap-1"
                        onMouseEnter={() => { if (volTimerRef.current) clearTimeout(volTimerRef.current); setShowVolume(true); }}
                        onMouseLeave={() => { volTimerRef.current = setTimeout(() => setShowVolume(false), 500); }}
                      >
                        <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150" title={isMuted ? "Unmute (M)" : "Mute (M)"}>
                          {isMuted ? <IconMute /> : <IconVolume />}
                        </button>
                        <AnimatePresence>
                          {showVolume && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 72 }} exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              <input
                                type="range" min={0} max={1} step={0.05}
                                value={isMuted ? 0 : volume}
                                onChange={(e) => handleVolume(parseFloat(e.target.value))}
                                className="w-full h-1 rounded-full cursor-pointer appearance-none"
                                style={{ accentColor: "hsl(var(--primary))", background: `linear-gradient(to right,hsl(var(--primary)) ${(isMuted?0:volume)*100}%,rgba(255,255,255,0.2) ${(isMuted?0:volume)*100}%)` }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Resolution / Quality selector */}
                      {showQualityBtn && (
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowQuality(p => !p); }}
                            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 text-xs font-semibold"
                            title="Quality"
                          >
                            <IconQuality />
                            <span className="hidden sm:inline">{currentQualityLabel}</span>
                          </button>
                          <AnimatePresence>
                            {showQuality && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 6 }}
                                transition={{ duration: 0.16, ease: E.easeOut }}
                                className="absolute bottom-10 right-0 rounded-xl overflow-hidden shadow-2xl min-w-[120px]"
                                style={{ background: "rgba(15,15,15,0.97)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={handleControlBarEnter}
                                onMouseLeave={handleControlBarLeave}
                              >
                                <div className="px-3 py-2 border-b border-white/8">
                                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Quality</p>
                                </div>

                                {/* URL-based quality (Showroom) */}
                                {hasUrlQualities && streamQualities.map((q) => (
                                  <button
                                    key={q.url}
                                    onClick={() => switchUrlQuality(q)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/8 transition-colors duration-150 text-left"
                                  >
                                    <span className={`text-sm font-medium ${activeUrlQuality === q.url ? "text-primary" : "text-white/80"}`}>
                                      {q.label}
                                    </span>
                                    {activeUrlQuality === q.url && (
                                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--primary))" }} />
                                    )}
                                  </button>
                                ))}

                                {/* hls.js adaptive quality (IDN Live) */}
                                {hasHlsQualities && [
                                  { index: -1, label: "Auto", height: 9999 },
                                  ...hlsQualities,
                                ].map((q) => (
                                  <button
                                    key={q.index}
                                    onClick={() => switchHlsLevel(q.index)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/8 transition-colors duration-150 text-left"
                                  >
                                    <span className={`text-sm font-medium ${currentHlsLevel === q.index ? "text-primary" : "text-white/80"}`}>
                                      {q.label}
                                    </span>
                                    {currentHlsLevel === q.index && (
                                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--primary))" }} />
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Refresh */}
                      <button
                        onClick={handleRefreshStream}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
                        title="Refresh stream"
                      >
                        <IconRefresh />
                      </button>

                      {/* Theater mode */}
                      <button
                        onClick={() => setIsTheater(p => !p)}
                        className={`w-8 h-8 hidden sm:flex items-center justify-center rounded-lg transition-all duration-150 ${isTheater ? "text-primary bg-primary/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}
                        title="Theater mode (T)"
                      >
                        <IconTheater />
                      </button>

                      {/* Picture-in-Picture */}
                      {document.pictureInPictureEnabled && (
                        <button
                          onClick={togglePiP}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 ${isPiPActive ? "text-primary bg-primary/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}
                          title="Picture-in-Picture"
                        >
                          <IconPiP />
                        </button>
                      )}

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
                        title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
                      >
                        {isFullscreen ? <IconShrink /> : <IconExpand />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading overlay */}
              {(playerState === "loading" || playerState === "refreshing") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/85 gap-5 z-10">
                  <div className="relative w-16 h-16">
                    <motion.div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "hsl(var(--primary)/0.18)" }} animate={{ scale: [1,1.4,1], opacity: [0.5,0,0.5] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
                    <motion.div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "hsl(var(--primary)/0.1)" }} animate={{ scale: [1,1.7,1], opacity: [0.3,0,0.3] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.3 }} />
                    <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    <motion.div className="absolute inset-0 rounded-full border-t-2" style={{ borderColor: "hsl(var(--primary))" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0 h-0 ml-1" style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid hsl(var(--primary)/0.7)" }} />
                    </div>
                  </div>
                  <motion.p className="text-white/50 text-sm tracking-wide" animate={{ opacity: [0.5,1,0.5] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                    {playerState === "refreshing" ? "Refreshing stream…" : "Connecting to stream…"}
                  </motion.p>
                </div>
              )}

              {/* Error overlay */}
              {playerState === "error" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/92 p-8 text-center gap-4 z-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">⚠</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Stream Error</p>
                    <p className="text-white/40 text-sm">{errorMsg}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <motion.button onClick={handleRefreshStream}
                      className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      Refresh Stream
                    </motion.button>
                    <a href={liveRoomUrl} target="_blank" rel="noopener noreferrer"
                      className="border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/8 transition-colors">
                      Open in {platformName} ↗
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div variants={footerVariants} className="flex items-center justify-between mt-2.5 px-1">
              <p className="text-white/20 text-xs">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/35 text-[10px] font-mono">ESC</kbd> or click backdrop to close
              </p>
              <div className="flex items-center gap-3 text-[11px] text-white/25">
                <span className="hidden sm:inline"><kbd className="px-1 py-0.5 rounded bg-white/8 text-[10px] font-mono">M</kbd> mute</span>
                <span className="hidden sm:inline"><kbd className="px-1 py-0.5 rounded bg-white/8 text-[10px] font-mono">F</kbd> fullscreen</span>
                <span className="hidden sm:inline"><kbd className="px-1 py-0.5 rounded bg-white/8 text-[10px] font-mono">T</kbd> theater</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const SignalWave = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[3px] h-5">
    {[0.4, 0.65, 1, 0.65, 0.4].map((h, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full transition-all duration-500"
        style={{
          height: `${h * 20}px`,
          background: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)",
          animation: active ? `signalPulse 1.2s ease-in-out ${i * 0.12}s infinite` : "none",
        }}
      />
    ))}
    <style>{`
      @keyframes signalPulse {
        0%, 100% { transform: scaleY(1); opacity: 1; }
        50%       { transform: scaleY(0.4); opacity: 0.5; }
      }
    `}</style>
  </div>
);

const PlatformCard = ({
  status, platform, logo, label, profileUrl, displayName,
  onWatch, isLoadingStream, animDelay,
}: {
  status:          PlatformStatus;
  platform:        "idn" | "showroom";
  logo:            string;
  label:           string;
  profileUrl:      string;
  displayName:     string;
  onWatch:         () => void;
  isLoadingStream: boolean;
  animDelay:       number;
}) => {
  const { isLive, isChecking } = status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500"
      style={{
        background:   "hsl(var(--card))",
        borderColor:  isLive ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border) / 0.5)",
        boxShadow:    isLive
          ? "0 0 32px hsl(var(--primary) / 0.12), 0 4px 24px rgba(0,0,0,0.25)"
          : "0 4px 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
        style={{
          background: isLive
            ? "linear-gradient(90deg,transparent 0%,hsl(var(--primary)) 50%,transparent 100%)"
            : "transparent",
        }}
      />

      <div className="p-6 flex flex-col gap-5 flex-1">

        {/* Platform header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background:  isLive ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted) / 0.5)",
                border:      `1px solid ${isLive ? "hsl(var(--primary) / 0.25)" : "hsl(var(--border) / 0.5)"}`,
              }}
            >
              <img src={logo} alt={label} className="w-6 h-6 object-contain rounded-md" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">Platform</p>
              <p className="text-base font-bold text-foreground">{label}</p>
            </div>
          </div>

          {/* Status pill */}
          {isChecking ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Checking</span>
            </div>
          ) : isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/12 border border-red-500/25">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: "0 0 6px #ef4444" }} />
              <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">On Air</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Offline</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30" />

        {/* Card body */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-2">
          {isChecking ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-end gap-[3px] h-6">
                {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
                  <div key={i} className="w-[3px] rounded-full bg-muted/50 animate-pulse"
                    style={{ height: `${h * 24}px`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Checking stream status…</p>
            </div>
          ) : isLive ? (
            <>
              <SignalWave active />
              <div>
                <p className="text-lg font-bold text-foreground leading-tight">{displayName}</p>
                <p className="text-sm text-primary/80 font-medium mt-0.5">is live right now!</p>
              </div>
              <button
                onClick={onWatch}
                disabled={isLoadingStream}
                className="w-full max-w-[220px] inline-flex items-center justify-center gap-2.5 rounded-2xl py-3 px-6 font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60"
                style={{
                  background:  "hsl(var(--primary))",
                  color:       "hsl(var(--primary-foreground))",
                  boxShadow:   "0 4px 20px hsl(var(--primary) / 0.45)",
                }}
              >
                {isLoadingStream ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    <span className="text-lg leading-none">▶</span>
                    Watch Now
                  </>
                )}
              </button>
              {status.liveUrl && (
                <a
                  href={status.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-dotted"
                >
                  Open directly in {label} ↗
                </a>
              )}
            </>
          ) : (
            <>
              <SignalWave active={false} />
              <div>
                <p className="text-base font-semibold text-foreground/70">Currently offline</p>
                <p className="text-xs text-muted-foreground mt-1">No live stream on {label} right now.</p>
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border/60 hover:border-primary/40 text-foreground/60 hover:text-foreground px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200"
              >
                Visit Profile
                <span className="opacity-50">↗</span>
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const KimmyLiveStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [idn, setIdn] = useState<PlatformStatus>({
    isLive: false, isChecking: true, lastChecked: null, liveUrl: null, streamUrl: null, slug: null,
  });
  const [showroom, setShowroom] = useState<PlatformStatus>({
    isLive: false, isChecking: true, lastChecked: null, liveUrl: null, streamUrl: null, slug: null,
  });

  const [activePlayer,       setActivePlayer]       = useState<null | "idn" | "showroom">(null);
  const [activeStreamUrl,    setActiveStreamUrl]    = useState<string>("");
  const [activeStreamQuals,  setActiveStreamQuals]  = useState<UrlQuality[]>([]);
  const [activeLiveUrl,      setActiveLiveUrl]      = useState<string>("");
  const [activePlatform,     setActivePlatform]     = useState<string>("");
  const [isLoadingStream,    setIsLoadingStream]    = useState<"idn" | "showroom" | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const checkIdnStatus = useCallback(async () => {
    setIdn(p => ({ ...p, isChecking: true }));
    try {
      const { data, error } = await supabase.functions.invoke("check-idn-live", {
        body: { username: IDN_USERNAME },
      });
      if (error) throw error;
      const slugMatch = data?.live_url?.match(/\/live\/([\w-]+)/);
      setIdn({
        isLive:      data?.is_live ?? false,
        isChecking:  false,
        lastChecked: data?.checked_at ?? new Date().toISOString(),
        liveUrl:     data?.live_url ?? `https://www.idn.app/${IDN_USERNAME}`,
        streamUrl:   data?.stream_url ?? null,
        slug:        slugMatch ? slugMatch[1] : null,
      });
    } catch (err) {
      console.error("IDN check failed:", err);
      setIdn(p => ({ ...p, isLive: false, isChecking: false }));
    }
  }, []);

  const checkShowroomStatus = useCallback(async () => {
    setShowroom(p => ({ ...p, isChecking: true }));
    try {
      const { data, error } = await supabase.functions.invoke("check-showroom-live", {
        body: { room_url_key: SHOWROOM_KEY },
      });
      if (error) throw error;
      setShowroom({
        isLive:      data?.is_live ?? false,
        isChecking:  false,
        lastChecked: data?.checked_at ?? new Date().toISOString(),
        liveUrl:     data?.is_live
          ? `https://www.showroom-live.com/r/${SHOWROOM_KEY}`  // direct live room when on air
          : `https://www.showroom-live.com/room/profile?room_id=510073`, // profile page when offline
        streamUrl:   data?.stream_url ?? null,
        slug:        null,
      });
    } catch (err) {
      console.error("Showroom check failed:", err);
      setShowroom(p => ({ ...p, isLive: false, isChecking: false }));
    }
  }, []);

  useEffect(() => { checkIdnStatus(); checkShowroomStatus(); }, [checkIdnStatus, checkShowroomStatus]);

  const handleWatchIDN = useCallback(async () => {
    const profileUrl = `https://www.idn.app/${IDN_USERNAME}`;
    if (idn.streamUrl) {
      setActiveStreamUrl(idn.streamUrl);
      setActiveStreamQuals([]);
      setActiveLiveUrl(idn.liveUrl ?? profileUrl);
      setActivePlatform("IDN Live");
      setActivePlayer("idn");
      return;
    }
    if (idn.slug) {
      setIsLoadingStream("idn");
      try {
        const { data, error } = await supabase.functions.invoke("get-idn-stream", {
          body: { username: IDN_USERNAME, slug: idn.slug },
        });
        if (!error && data?.stream_url) {
          setActiveStreamUrl(data.stream_url);
          setActiveStreamQuals([]);
          setActiveLiveUrl(idn.liveUrl ?? profileUrl);
          setActivePlatform("IDN Live");
          setActivePlayer("idn");
        } else {
          window.open(idn.liveUrl ?? profileUrl, "_blank");
        }
      } catch { window.open(idn.liveUrl ?? profileUrl, "_blank"); }
      finally  { setIsLoadingStream(null); }
      return;
    }
    window.open(idn.liveUrl ?? profileUrl, "_blank");
  }, [idn]);

  const handleRefreshIDN = useCallback(async (): Promise<string | null> => {
    if (!idn.slug) return null;
    try {
      const { data, error } = await supabase.functions.invoke("get-idn-stream", {
        body: { username: IDN_USERNAME, slug: idn.slug },
      });
      return (!error && data?.stream_url) ? data.stream_url : null;
    } catch { return null; }
  }, [idn.slug]);

  const handleWatchShowroom = useCallback(async () => {
    const profileUrl = `https://www.showroom-live.com/room/profile?room_id=510073`;
    if (showroom.streamUrl) {
      setActiveStreamUrl(showroom.streamUrl);
      setActiveStreamQuals([]);
      setActiveLiveUrl(showroom.liveUrl ?? profileUrl);
      setActivePlatform("Showroom");
      setActivePlayer("showroom");
      return;
    }
    setIsLoadingStream("showroom");
    try {
      const { data, error } = await supabase.functions.invoke("check-showroom-live", {
        body: { room_url_key: SHOWROOM_KEY },
      });
      if (!error && data?.stream_url) {
        setShowroom(p => ({ ...p, streamUrl: data.stream_url }));

        const quals: UrlQuality[] = [];
        if (data.stream_url)     quals.push({ label: "High",   url: data.stream_url });
        if (data.stream_url_low && data.stream_url_low !== data.stream_url)
          quals.push({ label: "Low",    url: data.stream_url_low });

        setActiveStreamUrl(data.stream_url);
        setActiveStreamQuals(quals);
        setActiveLiveUrl(showroom.liveUrl ?? profileUrl);
        setActivePlatform("Showroom");
        setActivePlayer("showroom");
      } else {
        window.open(profileUrl, "_blank");
      }
    } catch { window.open(profileUrl, "_blank"); }
    finally  { setIsLoadingStream(null); }
  }, [showroom]);

  const handleRefreshShowroom = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("check-showroom-live", {
        body: { room_url_key: SHOWROOM_KEY },
      });
      return (!error && data?.stream_url) ? data.stream_url : null;
    } catch { return null; }
  }, []);

  const closePlayer = useCallback(() => { setActivePlayer(null); }, []);

  const handleRefresh = activePlayer === "idn" ? handleRefreshIDN : handleRefreshShowroom;

  const formatTime = (d: Date) => {
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  };
  const formatDate = (d: Date) => {
    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const isAnyLive      = idn.isLive || showroom.isLive;
  const idnProfileUrl  = `https://www.idn.app/${IDN_USERNAME}`;
  const srProfileUrl   = `https://www.showroom-live.com/room/profile?room_id=510073`;

  return (
    <section className="section-padding overflow-x-hidden relative">
      <div className="container mx-auto px-5 sm:px-4">

        <HlsPlayer
          isOpen={activePlayer !== null}
          streamUrl={activeStreamUrl}
          streamQualities={activeStreamQuals}
          liveRoomUrl={activeLiveUrl}
          platformName={activePlatform}
          onClose={closePlayer}
          onRefresh={handleRefresh}
        />

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-5 transition-all duration-500"
            style={{
              background:  isAnyLive ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
              borderColor: isAnyLive ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border) / 0.5)",
            }}
          >
            {isAnyLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: "0 0 8px #ef4444" }} />
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Kimmy is Live Now</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary) / 0.7)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>Live Status</span>
              </>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Watch Kimmy <span className="text-gradient">Live</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Check in real-time whether Kimmy is live on IDN Live or Showroom, and watch directly from here.
          </p>
        </motion.div>

        {/* Profile Banner */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden mb-6 border transition-all duration-500"
          style={{
            background:   "hsl(var(--card))",
            borderColor:  isAnyLive ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border) / 0.5)",
            boxShadow:    isAnyLive
              ? "0 0 40px hsl(var(--primary) / 0.1), 0 4px 32px rgba(0,0,0,0.2)"
              : "0 4px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* Top glow bar */}
          {isAnyLive && (
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent 0%,hsl(var(--primary)) 50%,transparent 100%)" }}
            />
          )}

          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
              backgroundSize:  "32px 32px",
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-stretch gap-0 p-0">
            {/* Photo */}
            <div className="relative flex-shrink-0 w-full sm:w-48 h-48 sm:h-auto overflow-hidden rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none">
              <img src={kimmy1} alt={DISPLAY_NAME} className="w-full h-full object-cover object-top" />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom,transparent 40%,hsl(var(--card) / 0.6))" }}
              />
              {isAnyLive && (
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span className="text-white text-[10px] font-black tracking-widest">LIVE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between p-6 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">JKT48 Member</p>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{DISPLAY_NAME}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAnyLive
                    ? <span className="text-primary font-semibold">● Currently live!</span>
                    : "No live stream at the moment"}
                </p>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-xl font-bold text-foreground">{FOLLOWING}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Following</p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div>
                  <p className="text-xl font-bold text-foreground">{FOLLOWERS}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Followers</p>
                </div>
                <div className="w-px h-10 bg-border/50 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-xl font-bold text-foreground font-mono tabular-nums">{formatTime(currentTime)}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{formatDate(currentTime)}</p>
                </div>
              </div>

              {/* Mobile clock */}
              <div className="sm:hidden flex items-center gap-2 text-muted-foreground">
                <span className="font-mono tabular-nums text-sm text-foreground/80">{formatTime(currentTime)}</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-xs">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PlatformCard
            status={idn} platform="idn" logo={idnLogo} label="IDN Live"
            profileUrl={idnProfileUrl} displayName={DISPLAY_NAME}
            onWatch={handleWatchIDN} isLoadingStream={isLoadingStream === "idn"}
            animDelay={0.25}
          />
          <PlatformCard
            status={showroom} platform="showroom" logo={showroomLogo} label="Showroom"
            profileUrl={srProfileUrl} displayName={DISPLAY_NAME}
            onWatch={handleWatchShowroom} isLoadingStream={isLoadingStream === "showroom"}
            animDelay={0.4}
          />
        </div>

      </div>
    </section>
  );
};

export default KimmyLiveStatus;