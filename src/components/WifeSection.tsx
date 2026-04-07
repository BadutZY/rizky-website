import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Calendar, MapPin, Star, Droplets, Ruler, Users, Maximize2, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { createPortal } from 'react-dom';

import kimmy1 from '@/assets/wife/kimmy-1.jpg';
import kimmy2 from '@/assets/wife/kimmy-2.jpg';
import kimmy3 from '@/assets/wife/kimmy-3.jpg';
import kimmy4 from '@/assets/wife/kimmy-4.jpg';
import kimmy5 from '@/assets/wife/kimmy-5.jpg';
import kimmy6 from '@/assets/wife/kimmy-6.jpg';
import idnLogo from '@/assets/icons/idn-logo.png';
import showroomLogo from '@/assets/icons/showroom-logo.png';

const photos = [kimmy1, kimmy2, kimmy3, kimmy4, kimmy5, kimmy6];

const bioData = [
  { icon: Heart, label: 'Name', value: 'Victoria Kimberly Lukitama (Kimmy)' },
  { icon: Calendar, label: 'Birthday', value: 'March 8, 2010 (16 Years)' },
  { icon: MapPin, label: 'Hometown', value: 'Jakarta, Indonesia' },
  { icon: Droplets, label: 'Blood Type', value: 'AB' },
  { icon: Star, label: 'Zodiac', value: 'Pisces' },
  { icon: Ruler, label: 'Height', value: '162 cm' },
  { icon: Users, label: 'Status', value: "BadutZY's Wife" },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/jkt48.kimmy', svg: <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@jkt48.kimmy', svg: <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg> },
  { label: 'X', href: 'https://x.com/Kimmy_JKT48?s=20', svg: <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'Threads', href: 'https://www.threads.com/@jkt48.kimmy', svg: <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.107-1.138 3.455-1.165 1.005-.02 1.925.112 2.748.391.02-.882-.06-1.693-.236-2.412l2.036-.421c.238 1.012.342 2.138.3 3.37l.018.435c.93.494 1.69 1.134 2.273 1.93.825 1.127 1.196 2.457 1.073 3.848-.136 1.533-.745 2.88-1.81 4.003-1.239 1.303-2.904 2.128-4.95 2.45-.535.084-1.09.128-1.658.132zM9.15 15.525c.05.907.578 1.534 1.548 1.837.564.176 1.22.208 1.844.176 1.099-.06 1.942-.467 2.504-1.209.43-.565.734-1.313.893-2.214-.758-.263-1.588-.393-2.484-.377-.964.02-1.784.278-2.376.75-.509.407-.774.932-.742 1.482-.058-.144-.117-.289-.187-.445z"/></svg> },
  { label: 'Showroom', href: 'https://www.showroom-live.com/room/profile?room_id=510073', img: showroomLogo },
  { label: 'IDN Live', href: 'https://www.idn.app/jkt48_kimmy', img: idnLogo },
];

const LightboxModal = ({ isOpen, photos, activeIndex, onClose, onNext, onPrev }: { isOpen: boolean; photos: string[]; activeIndex: number; onClose: () => void; onNext: () => void; onPrev: () => void; }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => { if (isOpen) { document.body.style.overflow = 'hidden'; requestAnimationFrame(() => setIsVisible(true)); } else { setIsVisible(false); } return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  useEffect(() => { setFadeKey(prev => prev + 1); }, [activeIndex]);
  useEffect(() => { if (!isOpen) return; const handleKey = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [isOpen, onPrev, onNext, onClose]);

  const handlePointerDown = (e: React.PointerEvent) => { setSwipeStart(e.clientX); setSwipeOffset(0); };
  const handlePointerMove = (e: React.PointerEvent) => { if (swipeStart === null) return; setSwipeOffset(e.clientX - swipeStart); };
  const handlePointerUp = () => { if (swipeStart === null) return; if (swipeOffset > 60) onPrev(); else if (swipeOffset < -60) onNext(); setSwipeStart(null); setSwipeOffset(0); };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }} role="dialog" aria-modal="true">
      <div className={`absolute inset-0 bg-background/95 backdrop-blur-xl transition-opacity duration-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-card/80 border border-border/50 flex items-center justify-center hover:bg-card transition-colors"><X className="w-5 h-5 text-foreground" /></button>
      <button onClick={onPrev} className="absolute left-2 md:left-8 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-background/90 border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
      <button onClick={onNext} className="absolute right-2 md:right-8 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-background/90 border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-lg"><ChevronRight className="w-5 h-5 text-foreground" /></button>
      <div className={`relative z-10 max-w-[85vw] md:max-w-[90vw] max-h-[75vh] md:max-h-[85vh] select-none transition-all duration-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} style={{ touchAction: 'pan-y' }}>
        <img key={fadeKey} src={photos[activeIndex]} alt={`Kimmy photo ${activeIndex + 1}`} className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-xl animate-lightbox-fade" style={{ transform: swipeStart !== null ? `translateX(${swipeOffset}px)` : undefined, transition: swipeStart !== null ? 'none' : 'transform 0.3s ease' }} draggable={false} />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-xs font-mono text-muted-foreground">{activeIndex + 1} / {photos.length}</div>
      <style>{`@keyframes lightboxFade { 0% { opacity: 0; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } } .animate-lightbox-fade { animation: lightboxFade 0.35s ease-out; }`}</style>
    </div>,
    document.body
  );
};

const WifeSection = () => {
  const [codeOpen, setCodeOpen] = useState(false);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.05);
  const { ref: bioRef, isVisible: bioVisible } = useScrollAnimation(0.1);
  const { ref: galleryRef, isVisible: galleryVisible } = useScrollAnimation(0.1);
  const { ref: codeRef, isVisible: codeVisible } = useScrollAnimation(0.1);
  const [activePhoto, setActivePhoto] = useState(0);
  const [prevPhoto, setPrevPhoto] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [codeVisibleLines, setCodeVisibleLines] = useState(0);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crossfadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (codeOpen && codeVisible && codeVisibleLines === 0) {
      let current = 0;
      const total = 15;
      const interval = setInterval(() => {
        current++;
        setCodeVisibleLines(current);
        if (current >= total) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [codeVisible, codeOpen]);

  useEffect(() => {
    if (!codeOpen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setCodeOpen(false);
          setCodeVisibleLines(0);
        }
      },
      { threshold: 0.05 }
    );
    const el = sectionElRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [codeOpen]);

  const changePhoto = useCallback((index: number) => {
    if (index === activePhoto || isCrossfading) return;
    setPrevPhoto(activePhoto); setActivePhoto(index); setIsCrossfading(true);
    if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
    crossfadeTimeoutRef.current = setTimeout(() => { setPrevPhoto(null); setIsCrossfading(false); }, 600);
  }, [activePhoto, isCrossfading]);

  useEffect(() => {
    if (lightboxOpen) return;
    autoSlideRef.current = setInterval(() => {
      setActivePhoto(prev => {
        const next = (prev + 1) % photos.length;
        setPrevPhoto(prev); setIsCrossfading(true);
        if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = setTimeout(() => { setPrevPhoto(null); setIsCrossfading(false); }, 600);
        return next;
      });
    }, 10000);
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [lightboxOpen]);

  const handleThumbnailClick = (index: number) => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); changePhoto(index); };
  const openLightbox = () => { setLightboxIndex(activePhoto); setLightboxOpen(true); };
  const lightboxNext = useCallback(() => { setLightboxIndex(prev => (prev + 1) % photos.length); }, []);
  const lightboxPrev = useCallback(() => { setLightboxIndex(prev => (prev - 1 + photos.length) % photos.length); }, []);

  return (
    <section
      id="wife"
      ref={(el) => { sectionElRef.current = el; }}
      className="section-padding overflow-x-hidden relative"
      role="region"
      aria-labelledby="wife-title"
    >
      <div className="container mx-auto px-5 sm:px-4">
        <div ref={sectionRef} className={`fade-in ${sectionVisible ? 'show' : ''} text-center mb-12 md:mb-16`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Heart className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-primary">My Wife</span>
          </div>
          <h2 id="wife-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Meet <span className="text-gradient">Kimmy</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">The most special person in my life</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div ref={bioRef} className={`fade-in delay-200 ${bioVisible ? 'show' : ''}`}>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border/30">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-wide" style={{ fontVariant: 'small-caps' }}>Kimmy</h3>
                <p className="text-sm text-muted-foreground mt-1 italic">"True Love from BadutZY"</p>
              </div>
              <div className="divide-y divide-border/30">
                {bioData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-500 hover:bg-primary/5 ${bioVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: bioVisible ? `${index * 80}ms` : '0ms' }}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{item.label}</dt>
                        <dd className="text-sm text-foreground font-medium">{item.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-6">
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Jikoshoukai</p>
                  <p className="text-sm text-foreground/80 italic">"Baby hamster yang lincah, aku akan berlari-lari di pikiranmu!"</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">Kimmy's Social Media</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {socialLinks.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300" aria-label={link.label}>
                      {link.svg ? link.svg : <img src={link.img} alt={link.label} className="w-5 h-5 rounded-sm object-contain" />}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`fade-in delay-300 ${galleryVisible ? 'show' : ''}`}>
            <div ref={codeRef} className="bg-card rounded-xl border border-border overflow-hidden mb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
              <button
                onClick={() => { setCodeOpen(prev => !prev); if (!codeOpen) setCodeVisibleLines(0); }}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/50 cursor-pointer hover:bg-muted/80 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive/70 group-hover:scale-110 transition-transform" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70 group-hover:scale-110 transition-transform delay-75" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70 group-hover:scale-110 transition-transform delay-100" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">about-wife.tsx</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ease-in-out ${codeOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              <div
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                  maxHeight: codeOpen ? '600px' : '0px',
                  opacity: codeOpen ? 1 : 0,
                }}
              >
                <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed">
                  {[
                    <p key="l1"><span className="text-primary">import</span> <span className="text-foreground">{'{ Heart }'}</span> <span className="text-primary">from</span> <span className="text-accent">"love"</span><span className="text-muted-foreground">;</span></p>,
                    <p key="l2">&nbsp;</p>,
                    <p key="l3"><span className="text-primary">const</span> <span className="text-foreground">myWife</span> <span className="text-muted-foreground">=</span> <span className="text-accent">{'{'}</span></p>,
                    <p key="l4" className="pl-4"><span className="text-primary/80">name</span><span className="text-muted-foreground">:</span> <span className="text-accent">"Victoria Kimberly"</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l5" className="pl-4"><span className="text-primary/80">nickname</span><span className="text-muted-foreground">:</span> <span className="text-accent">"Kimmy"</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l6" className="pl-4"><span className="text-primary/80">group</span><span className="text-muted-foreground">:</span> <span className="text-accent">"JKT48"</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l7" className="pl-4"><span className="text-primary/80">team</span><span className="text-muted-foreground">:</span> <span className="text-accent">"Passion"</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l8" className="pl-4"><span className="text-primary/80">status</span><span className="text-muted-foreground">:</span> <span className="text-accent">"Taken by BadutZY"</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l9" className="pl-4"><span className="text-primary/80">love</span><span className="text-muted-foreground">:</span> <span className="text-foreground">Infinity</span><span className="text-muted-foreground">,</span></p>,
                    <p key="l10"><span className="text-accent">{'}'}</span><span className="text-muted-foreground">;</span></p>,
                    <p key="l11">&nbsp;</p>,
                    <p key="l12"><span className="text-primary">export default</span> <span className="text-foreground">myWife</span><span className="text-muted-foreground">;</span></p>,
                  ].map((line, i) => (
                    <div
                      key={i}
                      className={`transition-all duration-300 ${
                        i < codeVisibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                      style={{ transitionDelay: i < codeVisibleLines ? `${i * 50}ms` : '0ms' }}
                    >
                      {line}
                    </div>
                  ))}
                  {codeVisibleLines >= 12 && (
                    <span className="inline-block w-2 h-4 bg-primary/70 animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
            </div>

            <div ref={galleryRef} className="relative rounded-2xl overflow-hidden border border-border/50 shadow-card mb-3 aspect-[4/5] max-h-[540px] mx-auto">
              {prevPhoto !== null && (
                <img
                  src={photos[prevPhoto]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ animation: 'galleryFadeOut 0.6s ease-in-out forwards' }}
                />
              )}
              <img
                key={activePhoto}
                src={photos[activePhoto]}
                alt={`Kimmy photo ${activePhoto + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: prevPhoto !== null ? 'galleryFadeIn 0.6s ease-in-out' : 'none' }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/60 to-transparent" />
              <button onClick={openLightbox} className="absolute bottom-3 left-3 z-10 w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-card hover:scale-110 transition-all duration-300" aria-label="View full size">
                <Maximize2 className="w-3.5 h-3.5 text-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5 max-w-md mx-auto">
              {photos.map((photo, index) => (
                <button key={index} onClick={() => handleThumbnailClick(index)} className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${activePhoto === index ? 'border-primary shadow-glow scale-105' : 'border-border/30 opacity-60 hover:opacity-100 hover:border-border'}`}>
                  <img src={photo} alt={`Kimmy thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Gallery of{' '}<a href="https://jkt48.com/member/detail?member=victoria-kimberly-244&type=JKT48" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Kimmy</a>
            </p>
          </div>
        </div>
      </div>
      <LightboxModal isOpen={lightboxOpen} photos={photos} activeIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} onNext={lightboxNext} onPrev={lightboxPrev} />
      <style>{`
        @keyframes galleryFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes galleryFadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>
    </section>
  );
};

export default WifeSection;
