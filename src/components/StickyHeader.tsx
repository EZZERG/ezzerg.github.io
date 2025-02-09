'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { FaGithub, FaGraduationCap } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi' // Add this import

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#employment', label: 'Employment' },
  { href: '#publications', label: 'Publications' }
]

const StickyHeader = ({ activeSection = '' }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Get the header element and its position
      const headerElement = document.getElementById('main-header')
      if (headerElement) {
        const headerBottom = headerElement.offsetTop + headerElement.offsetHeight
        setIsVisible(window.scrollY > headerBottom - 100) // Adding some offset for smoother transition
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/75 border-b border-white/10"
        >
          <div className="max-w-4xl mx-auto px-4 flex flex-col">
            <div className="py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-vt323">
                Your Name
              </h1>
              
              <div className="flex gap-3">
                <a
                  href="/path-to-your-cv.pdf"
                  download
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                  aria-label="Download CV"
                >
                  <HiDownload className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">CV</span>
                </a>
                <a
                  href="mailto:your.email@university.edu"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="Email"
                >
                  <MdEmail className="w-4 h-4" />
                </a>
                <a
                  href="https://scholar.google.com"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="Google Scholar"
                >
                  <FaGraduationCap className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="lg:hidden pb-3 -mt-1">
              <div className="flex gap-4 justify-start overflow-x-auto scrollbar-hide">
                {navItems.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="relative px-4 py-1.5 whitespace-nowrap"
                  >
                    {activeSection === href.slice(1) && (
                      <motion.div
                        layoutId="activeSectionMobile"
                        className="absolute inset-0 bg-white/20 rounded-md"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <span 
                      className={`
                        relative transition-all duration-300
                        ${activeSection === href.slice(1) 
                          ? 'text-white font-bold' 
                          : 'text-white/70'
                        }
                      `}
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyHeader
