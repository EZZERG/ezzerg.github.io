'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MdOutlineEmail } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa'
import { HiOutlineDownload } from 'react-icons/hi'
import { FiGithub } from 'react-icons/fi'
import { LuGraduationCap, LuLinkedin } from 'react-icons/lu'
import HamburgerMenu from './HamburgerMenu'
import { useActiveSection } from '../hooks/useActiveSection'

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#employment', label: 'Employment' },
  { href: '#publications', label: 'Publications' }
]

const StickyHeader = () => {
  const [isVisible, setIsVisible] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/75 border-b border-white/10"
        >
          <div className="max-w-4xl mx-auto px-4 flex flex-col">
            <div className="py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-quantico">
                Abdelhamid Ezzerg
              </h1>
              
              <div className="flex gap-3 items-center">
                <a
                  href="/cv/EZZERG_CV.pdf"
                  download
                  className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300 flex items-center gap-2"
                  aria-label="Download CV"
                >
                  <HiOutlineDownload className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">CV</span>
                </a>
                <a
                  href="mailto:abdelhamid.ezzerg.24@ucl.ac.uk"
                  className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                  aria-label="Email"
                >
                  <MdOutlineEmail className="w-4 h-4" />
                </a>
                <a
                  href="https://scholar.google.com/citations?user=Sltvi4AAAAAJ&hl=en&oi=ao"
                  className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                  aria-label="Google Scholar"
                >
                  <LuGraduationCap className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/EZZERG"
                  className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <FiGithub className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdelhamid-ezzerg-274437a6/"
                  className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <LuLinkedin className="w-4 h-4" />
                </a>
                
                <HamburgerMenu activeSection={activeSection} navItems={navItems} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyHeader
