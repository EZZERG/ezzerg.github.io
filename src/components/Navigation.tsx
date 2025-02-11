'use client'
import { motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'
import { IoHomeOutline, IoPersonOutline, IoSchoolOutline, IoBriefcaseOutline, IoNewspaperOutline } from 'react-icons/io5'

const navItems = [
  { href: '#main-header', label: 'Home', icon: IoHomeOutline },
  { href: '#about', label: 'About', icon: IoPersonOutline },
  { href: '#education', label: 'Education', icon: IoSchoolOutline },
  { href: '#employment', label: 'Employment', icon: IoBriefcaseOutline },
  { href: '#publications', label: 'Publications', icon: IoNewspaperOutline }
]

const Navigation = () => {
  const activeSection = useActiveSection()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(`[data-section-id="${href.slice(1)}"]`)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="hidden lg:block fixed top-20 left-16 z-50"
      style={{ 
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
        width: 'max-content'
      }}
    >
      <div className="flex backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-white/20">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="relative px-4 group"
          >
            {activeSection === href.slice(1) && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-white/20 rounded-md"
              />
            )}
            <span className={`
              relative z-10 flex items-center gap-2
              ${activeSection === href.slice(1) 
                ? 'text-white font-bold' 
                : 'text-white/70'
              }
            `}>
              <Icon className="w-4 h-4" />
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
