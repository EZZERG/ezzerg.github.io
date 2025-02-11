'use client'
import { MdOutlineEmail } from 'react-icons/md'
import { FiGithub } from 'react-icons/fi'
import { LuGraduationCap, LuLinkedin } from 'react-icons/lu'
import TypingTitle from './TypingTitle'
import HeaderNavigation from './HeaderNavigation'

const Header = () => {
  return (
    <header 
      id="main-header"
      className="min-h-screen w-full flex items-center justify-center relative"
    >
      <HeaderNavigation />
      <div className="w-[600px] backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] hover:backdrop-blur-xl transition-all duration-300 text-center">
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex flex-col gap-6">
            <div className="h-[3.75rem] relative">
              <TypingTitle
                text="Your Name"
                className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-quantico absolute"
              />
            </div>
            <div className="h-[1.75rem] relative">
              <TypingTitle
                text="PhD Candidate in [Your Field]"
                className="text-xl text-gray-200 font-orbitron absolute"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <a
                href="mailto:your.email@university.edu"
                className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                aria-label="Email"
              >
                <MdOutlineEmail className="w-6 h-6" />
              </a>
              <a
                href="https://scholar.google.com"
                className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                aria-label="Google Scholar"
              >
                <LuGraduationCap className="w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                aria-label="GitHub"
              >
                <FiGithub className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LuLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
