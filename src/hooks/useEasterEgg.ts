import { useState, useCallback } from 'react';

export const useEasterEgg = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  return { isUnlocked, unlock };
};

