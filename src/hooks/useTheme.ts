import { useState, useEffect, useCallback } from 'react';

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const THEME_STORAGE_KEY = 'theme';

const readStoredTheme = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch {
    /* localStorage unavailable */
  }
  // fallback to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  return true;
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(readStoredTheme);

  // Apply theme + persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.remove('light');
    else root.classList.add('light');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* ignore quota / privacy mode errors */
    }
  }, [isDark]);

  /**
   * Fallback circular reveal animation for browsers that do NOT
   * support the View Transitions API. We render a temporary
   * full-screen overlay painted with the *next* theme's background
   * color, then expand it from the click origin using the Web
   * Animations API (clip-path). When the animation ends, the new
   * theme is committed and the overlay is removed — keeping the
   * transition smooth on Safari / Firefox too.
   */
  const runFallbackReveal = useCallback((x: number, y: number, nextIsDark: boolean) => {
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483646;
      pointer-events: none; will-change: clip-path;
      background: ${nextIsDark ? 'hsl(0 0% 7%)' : 'hsl(0 0% 98%)'};
    `;
    document.body.appendChild(overlay);

    const anim = overlay.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );

    // Commit theme just before the overlay finishes to avoid flash
    const commitTimer = window.setTimeout(() => {
      setIsDark(nextIsDark);
    }, 500);

    anim.onfinish = () => {
      window.clearTimeout(commitTimer);
      setIsDark(nextIsDark);
      // small RAF delay so the new theme paints behind overlay before removal
      requestAnimationFrame(() => overlay.remove());
    };
    anim.oncancel = () => {
      window.clearTimeout(commitTimer);
      overlay.remove();
    };
  }, []);

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const doc = document as DocWithVT;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setIsDark((p) => !p);
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;

    // Modern path — View Transitions API
    if (doc.startViewTransition) {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      const transition = doc.startViewTransition(() => setIsDark((p) => !p));
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 650,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          /* no-op */
        });
      return;
    }

    // Fallback path — overlay-based circular reveal
    runFallbackReveal(x, y, !isDark);
  }, [isDark, runFallbackReveal]);

  return { isDark, toggleTheme };
};
