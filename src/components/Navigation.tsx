'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'

const navItems = [
  { href: '#main-header', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#employment', label: 'Employment' },
  { href: '#publications', label: 'Publications' }
]

const Navigation = ({ className = '' }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.getElementById('main-header')
      if (headerElement) {
        const headerBottom = headerElement.offsetTop + headerElement.offsetHeight
        setIsHeaderVisible(window.scrollY > headerBottom - 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Add debug log
  useEffect(() => {
    console.log('Navigation active section:', activeSection);
  }, [activeSection]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.querySelector(`[data-section-id="${targetId}"]`);
    
    if (targetElement) {
      // Calculate position to show section from the top
      const offset = window.innerHeight * 0.1; // 10% from top
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className={`hidden lg:block fixed top-20 left-16 z-50 ${className}`}
        style={{ 
          transform: 'rotate(90deg)',
          transformOrigin: 'top left',
          width: 'max-content'
        }}
      >
        <div className="flex backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-white/20 shadow-xl">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className="relative px-4 group whitespace-nowrap"
            >
              {activeSection === href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-white/20 rounded-md"
                  transition={{ 
                    type: "spring", 
                    bounce: 0.15, 
                    duration: 0.5 
                  }}
                />
              )}
              <span className={`
                relative transition-colors duration-300
                ${activeSection === href.slice(1) 
                  ? 'text-white text-lg font-bold font-space' 
                  : 'text-white/70 text-sm font-space'
                }
              `}>
                {label}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile horizontal navigation (shows only when sticky header is not visible) */}
      <nav 
        className={`lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-white/20 shadow-xl">
          {navItems.map(({ href, label }) => {
            const sectionId = href.replace('#', '');
            const isActive = activeSection === sectionId;
            
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => handleClick(e, href)}
                className="relative px-4 whitespace-nowrap"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSectionMobileTop"
                    className="absolute inset-0 bg-white/20 rounded-md"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span 
                  className={`
                    relative transition-all duration-300
                    ${isActive 
                      ? 'text-white font-bold font-space' 
                      : 'text-white/70 font-space'
                    }
                  `}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  )
}

export default Navigation
