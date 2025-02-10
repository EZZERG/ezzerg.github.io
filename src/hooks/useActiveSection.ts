import { useState, useEffect, useRef } from 'react';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);
  const lastActiveSection = useRef('');

  useEffect(() => {
    const getSections = () => {
      return Array.from(document.querySelectorAll('[data-section-id]')).map(section => ({
        id: section.getAttribute('data-section-id') || '',
        rect: section.getBoundingClientRect(),
      }));
    };

    const handleScroll = () => {
      const isScrollingDown = window.scrollY > lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const sections = getSections();

      // Different detection logic based on scroll direction
      if (isScrollingDown) {
        // When scrolling down, look for sections entering the viewport from the bottom
        const entering = sections.find(section => 
          section.rect.top > 0 && 
          section.rect.top < window.innerHeight * 0.6
        );
        if (entering) {
          lastActiveSection.current = entering.id;
          setActiveSection(entering.id);
        }
      } else {
        // When scrolling up, look for sections that are currently centered
        const centered = sections.find(section => 
          section.rect.top < window.innerHeight * 0.4 && 
          section.rect.bottom > window.innerHeight * 0.6
        );
        if (centered) {
          lastActiveSection.current = centered.id;
          setActiveSection(centered.id);
        } else {
          // If no section is centered, find the first visible section from the top
          const visible = sections.find(section => 
            section.rect.top > -window.innerHeight * 0.1 && 
            section.rect.top < window.innerHeight * 0.5
          );
          if (visible) {
            lastActiveSection.current = visible.id;
            setActiveSection(visible.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}
