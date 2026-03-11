import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, XCircle } from 'lucide-react';

interface AlreadyUnlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeName: string;
}

const AlreadyUnlockedModal = ({ isOpen, onClose, codeName }: AlreadyUnlockedModalProps) => {
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
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setShowContent(false);
    setIsVisible(false);
    setTimeout(onClose, 400);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-6" style={{ zIndex: 99999 }} role="dialog" aria-modal="true">
      <div className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
      <div className={`relative w-full max-w-sm transition-all duration-500 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}`}>
        <div className="absolute -inset-4 rounded-3xl bg-destructive/20 blur-2xl transition-opacity duration-700" style={{ opacity: isVisible ? 1 : 0 }} />
        <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-destructive via-destructive/60 to-destructive" />
          <div className="flex justify-center pt-8 pb-4">
            <div className={`relative w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center transition-all duration-700 delay-200 ${showContent ? 'scale-100 rotate-0' : 'scale-50 rotate-180'}`}>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <div className="px-6 pb-2 text-center">
            <h3 className={`text-lg font-bold text-foreground mb-2 transition-all duration-500 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Already Unlocked</h3>
            <p className={`text-sm text-muted-foreground leading-relaxed transition-all duration-500 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              The easter egg <code className="text-destructive font-mono text-xs">{codeName}</code> has already been activated.
            </p>
          </div>
          <div className={`px-6 py-3 flex justify-center transition-all duration-500 delay-600 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-destructive/60 font-mono"><AlertTriangle className="w-3 h-3" />ERROR: Secret already revealed</span>
          </div>
          <div className="px-6 pb-6 pt-2">
            <button onClick={handleClose} className={`w-full py-3 rounded-xl font-semibold text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-all duration-300 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Got it</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlreadyUnlockedModal;
