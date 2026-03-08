import { useState, useEffect, useRef } from 'react';

export const useTypingEffect = (text: string, speed = 100, delay = 1000) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentIndex = 0;

    const startTyping = () => {
      timeout = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          startTyping();
        } else {
          setIsComplete(true);
        }
      }, speed);
    };

    const initialDelay = setTimeout(() => {
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

export const useScrollTypingEffect = (text: string, isVisible: boolean, speed = 30, delay = 300) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const prevVisible = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentIndex = 0;

    if (isVisible && !prevVisible.current) {
      // Reset and start typing when section becomes visible
      setDisplayText('');
      setIsTyping(true);
      setIsComplete(false);

      const startTyping = () => {
        timeout = setTimeout(() => {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            currentIndex++;
            startTyping();
          } else {
            setIsTyping(false);
            setIsComplete(true);
          }
        }, speed);
      };

      const initialDelay = setTimeout(() => {
        startTyping();
      }, delay);

      prevVisible.current = true;

      return () => {
        clearTimeout(timeout);
        clearTimeout(initialDelay);
      };
    }

    if (!isVisible) {
      prevVisible.current = false;
      setDisplayText('');
      setIsTyping(false);
      setIsComplete(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isVisible, text, speed, delay]);

  return { displayText, isTyping, isComplete };
};
