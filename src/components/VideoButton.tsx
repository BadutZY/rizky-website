import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, Loader2 } from 'lucide-react';

interface VideoButtonProps {
  visible: boolean;
}

const VideoButton = ({ visible }: VideoButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 400);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-5 right-[4.25rem] z-50 flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-xl border border-border/40 transition-all duration-500 outline-none hover:scale-110 hover:border-primary/30 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
        style={{
          boxShadow: isHovered
            ? '0 4px 20px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--border) / 0.3)'
            : '0 2px 12px hsl(var(--background) / 0.3), 0 0 0 1px hsl(var(--border) / 0.2)',
        }}
        aria-label="Watch video"
      >
        <Play
          size={16}
          className="text-muted-foreground transition-all duration-300 ml-0.5"
          style={{
            color: isHovered ? 'hsl(var(--primary))' : undefined,
            filter: isHovered ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none',
          }}
        />
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-12"
          style={{ zIndex: 9999 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with animation */}
          <div
            className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
          />

          {/* Modal card with animation */}
          <div
            className={`relative w-full max-w-4xl transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-6'
            }`}
          >
            {/* Glow behind card */}
            <div
              className={`absolute -inset-3 rounded-3xl bg-primary/10 blur-2xl transition-opacity duration-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-destructive/70" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <span className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <h3 className="text-xs font-medium text-muted-foreground font-mono">secret-video.mp4</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-background/60 border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Video area */}
              <div className="p-4 sm:p-5">
                <div className="relative w-full rounded-xl overflow-hidden bg-muted/50" style={{ aspectRatio: '16/9' }}>
                  {/* Loading spinner */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    src="https://drive.google.com/file/d/19q6lE_auUtgT7H-_RF0jP0KbD-b9vHDV/preview"
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    title="Secret Video"
                    onLoad={() => setIsLoading(false)}
                    style={{
                      /* Hint mobile browsers to use landscape when fullscreen */
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CSS for mobile fullscreen landscape hint */}
      <style>{`
        @media (max-width: 768px) {
          iframe[title="Secret Video"]:-webkit-full-screen {
            width: 100vw !important;
            height: 100vh !important;
          }
          iframe[title="Secret Video"]:fullscreen {
            width: 100vw !important;
            height: 100vh !important;
          }
        }
        @media screen and (orientation: portrait) and (max-width: 768px) {
          iframe[title="Secret Video"]:-webkit-full-screen {
            transform: rotate(90deg);
            transform-origin: center center;
            width: 100vh !important;
            height: 100vw !important;
          }
        }
      `}</style>
    </>
  );
};

export default VideoButton;
