import { useState, useEffect, useCallback } from 'react';

export const useMouseParallax = (speed = 0.02) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) * speed;
    const y = (e.clientY - window.innerHeight / 2) * speed;
    setPosition({ x, y });
  }, [speed]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return position;
};
