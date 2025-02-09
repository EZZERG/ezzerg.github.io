'use client'
import { MdEmail } from 'react-icons/md'
import { FaGithub, FaGraduationCap } from 'react-icons/fa'
import TypingTitle from './TypingTitle'

const Header = () => {
  return (
    <header id="main-header" className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] hover:backdrop-blur-xl transition-all duration-300 text-center">
      <div className="flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <TypingTitle
              text="Your Name"
              className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-vt323"
            />
          </div>
          <div>
            <TypingTitle
              text="PhD Candidate in [Your Field]"
              className="text-xl text-gray-200 font-silkscreen"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <a
              href="mailto:your.email@university.edu"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/20 transition-all duration-300"
              aria-label="Email"
            >
              <MdEmail className="w-6 h-6" />
            </a>
            <a
              href="https://scholar.google.com"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/20 transition-all duration-300"
              aria-label="Google Scholar"
            >
              <FaGraduationCap className="w-6 h-6" />
            </a>
            <a
              href="https://github.com"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/20 transition-all duration-300"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
