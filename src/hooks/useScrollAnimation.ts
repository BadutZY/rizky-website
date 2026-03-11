import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(threshold = 0.1, sticky = false) => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sticky) {
          if (entry.isIntersecting) setIsVisible(true);
        } else {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold, rootMargin: '-50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, sticky]);

  return { ref, isVisible };
};

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const baseSections = ['home', 'about', 'skills', 'projects', 'equipment', 'wife', 'contact'];
      const sections = baseSections.filter(id => document.getElementById(id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        setActiveSection(sections[sections.length - 1] || 'contact');
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          if (scrollPosition >= element.offsetTop) {
            if (sections[i] === 'wife') {
              setActiveSection('');
            } else {
              setActiveSection(sections[i]);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
};
