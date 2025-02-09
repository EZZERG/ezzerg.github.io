'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#employment', label: 'Employment' },
  { href: '#publications', label: 'Publications' }
]

const Navigation = ({ className = '', activeSection = '', onSectionChange = (section: string) => {} }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onSectionChange(entry.target.id)
        }
      })
    }, { threshold: 0.5 })

    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => observer.observe(section))

    return () => sections.forEach(section => observer.unobserve(section))
  }, [onSectionChange])

  return (
    <>
      {/* Desktop vertical navigation */}
      <nav 
        className={`hidden lg:block fixed top-20 left-16 z-50 ${className}`}
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
              className="relative px-4 group whitespace-nowrap"
            >
              {activeSection === href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-white/20 rounded-md"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span 
                className={`
                  relative transition-all duration-300
                  ${activeSection === href.slice(1) 
                    ? 'text-white text-lg font-bold font-space drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                    : 'text-white/70 text-sm font-space'
                  }
                `}
              >
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
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="relative px-4 whitespace-nowrap"
            >
              {activeSection === href.slice(1) && (
                <motion.div
                  layoutId="activeSectionMobileTop"
                  className="absolute inset-0 bg-white/20 rounded-md"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span 
                className={`
                  relative transition-all duration-300
                  ${activeSection === href.slice(1) 
                    ? 'text-white font-bold font-space' 
                    : 'text-white/70 font-space'
                  }
                `}
              >
                {label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Navigation
