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
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'equipment', 'wife', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const scrollContainer = document.querySelector('.fp-container');
    const root = scrollContainer instanceof HTMLElement ? scrollContainer : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible?.target?.id) {
          setActiveSection(mostVisible.target.id);
        }
      },
      {
        root,
        threshold: [0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    setActiveSection(sections[0].id);

    return () => observer.disconnect();
  }, []);

  return activeSection;
};
