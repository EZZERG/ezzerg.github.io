'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMenu, IoClose, IoHomeOutline, IoPersonOutline, IoSchoolOutline, IoBriefcaseOutline, IoNewspaperOutline } from 'react-icons/io5'

const icons = {
  'main-header': IoHomeOutline,
  'about': IoPersonOutline,
  'education': IoSchoolOutline,
  'employment': IoBriefcaseOutline,
  'publications': IoNewspaperOutline
}

interface HamburgerMenuProps {
  activeSection: string;
  navItems: Array<{ href: string; label: string }>;
}

const HamburgerMenu = ({ activeSection, navItems }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <IoClose className="w-5 h-5" /> : <IoMenu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/10"
          >
            <a
              href="#main-header"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 hover:bg-white/10 transition-colors duration-200 border-b border-white/10"
            >
              <span className={`
                flex items-center gap-2
                ${activeSection === 'main-header' 
                  ? 'text-white font-bold' 
                  : 'text-white/70'
                }
              `}>
                <IoHomeOutline className="w-4 h-4" />
                Home
              </span>
            </a>
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-white/10 transition-colors duration-200"
              >
                <span className={`
                  flex items-center gap-2
                  ${activeSection === href.slice(1) 
                    ? 'text-white font-bold' 
                    : 'text-white/70'
                  }
                `}>
                  {(() => {
                    const Icon = icons[href.slice(1) as keyof typeof icons];
                    return Icon && <Icon className="w-4 h-4" />;
                  })()}
                  {label}
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HamburgerMenu
