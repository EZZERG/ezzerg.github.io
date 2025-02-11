'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMenu, IoClose } from 'react-icons/io5'

const HeaderNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '#main-header', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#education', label: 'Education' },
    { href: '#employment', label: 'Employment' },
    { href: '#publications', label: 'Publications' }
  ]

  return (
    <div className="md:hidden absolute top-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/10"
          >
            {menuItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HeaderNavigation
