'use client'
import { MdOutlineEmail } from 'react-icons/md'
import { FiGithub } from 'react-icons/fi'
import { LuGraduationCap, LuLinkedin } from 'react-icons/lu'
import { HiOutlineDownload } from 'react-icons/hi'
import TypingTitle from './TypingTitle'
import HeaderNavigation from './HeaderNavigation'

const Header = () => {
  return (
    <header 
      id="main-header"
      className="min-h-screen w-full flex items-center justify-center relative"
    >
      <HeaderNavigation />
      <div className="max-w-[600px] w-[90vw] backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] hover:backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full text-center">
            <div className="min-h-[4rem] inline-block">
              <TypingTitle
                text="Abdelhamid Ezzerg"
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 text-transparent bg-clip-text font-quantico"
                startIndex={4}
              />
            </div>
          </div>
          
          <div className="w-full text-center">
            <div className="min-h-[3rem] sm:min-h-[4rem] inline-block">
              <TypingTitle
                text="PhD Student at University College London - ex Applied Scientist"
                className="text-base sm:text-lg md:text-xl text-gray-200 font-orbitron"
                startIndex={15}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/cv/EZZERG_CV.pdf"
              download
              className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300 flex items-center gap-2"
              aria-label="Download CV"
            >
              <HiOutlineDownload className="w-6 h-6" />
              <span className="text-sm">CV</span>
            </a>
            <a
              href="mailto:abdelhamid.ezzerg.24@ucl.ac.uk"
              className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
              aria-label="Email"
            >
              <MdOutlineEmail className="w-6 h-6" />
            </a>
            <a
              href="https://scholar.google.com/citations?user=Sltvi4AAAAAJ&hl=en&oi=ao"
              className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
              aria-label="Google Scholar"
            >
              <LuGraduationCap className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/EZZERG"
              className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/abdelhamid-ezzerg-274437a6/"
              className="p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <LuLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
