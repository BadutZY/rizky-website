import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Eye, Play, Palette } from 'lucide-react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EasterEggModal = ({ isOpen, onClose }: EasterEggModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsVisible(true);
        setTimeout(() => setShowContent(true), 400);
      });
    } else {
      setShowContent(false);
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setShowContent(false);
    setIsVisible(false);
    setTimeout(onClose, 400);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
      >
        {/* Glow effect behind modal */}
        <div
          className={`absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl transition-opacity duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          {/* Icon section */}
          <div className="flex justify-center pt-8 pb-4">
            <div
              className={`relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center transition-all duration-700 delay-200 ${
                showContent ? 'scale-100 rotate-0' : 'scale-50 rotate-180'
              }`}
            >
              <Sparkles className="w-9 h-9 text-primary" />
              {/* Orbiting dots */}
              <span
                className={`absolute w-2.5 h-2.5 rounded-full bg-primary transition-all duration-700 delay-500 ${
                  showContent ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animation: showContent ? 'pulse 2s infinite' : 'none',
                }}
              />
              <span
                className={`absolute w-2 h-2 rounded-full bg-accent transition-all duration-700 delay-700 ${
                  showContent ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  bottom: '-2px',
                  right: '-2px',
                  animation: showContent ? 'pulse 2s infinite 0.5s' : 'none',
                }}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="px-6 pb-2 text-center">
            <h3
              className={`text-xl font-bold text-foreground mb-2 transition-all duration-500 delay-300 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              🔓 Anda membongkar rahasia saya
            </h3>
            <p
              className={`text-sm text-muted-foreground leading-relaxed transition-all duration-500 delay-500 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Easter egg berhasil dibuka! Fitur rahasia sekarang tersedia untukmu.
            </p>
          </div>

          {/* Unlocked features */}
          <div className="px-6 py-4">
            <div
              className={`space-y-2.5 transition-all duration-500 delay-700 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/30">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Theme Toggle</p>
                  <p className="text-xs text-muted-foreground">Ubah tema gelap/terang</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/30">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Video Rahasia</p>
                  <p className="text-xs text-muted-foreground">Tonton video tersembunyi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div
            className={`px-6 pb-2 flex justify-center transition-all duration-500 delay-700 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
              <Eye className="w-3 h-3" />
              Cek pojok kanan atas layar
            </span>
          </div>

          {/* Close button */}
          <div className="px-6 pb-6 pt-3">
            <button
              onClick={handleClose}
              className={`w-full py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 delay-900 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Mengerti!
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EasterEggModal;
