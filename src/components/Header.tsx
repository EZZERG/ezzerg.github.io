'use client'
import { MdEmail } from 'react-icons/md'
import { FaGithub, FaGraduationCap } from 'react-icons/fa'

const Header = () => {
  return (
    <header id="main-header" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300 text-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">
            Your Name
          </h1>
          <p className="text-xl text-gray-200 mb-4 font-raleway">
            PhD Candidate in [Your Field]
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="mailto:your.email@university.edu"
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="Email"
            >
              <MdEmail className="w-6 h-6" />
            </a>
            <a
              href="https://scholar.google.com"
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="Google Scholar"
            >
              <FaGraduationCap className="w-6 h-6" />
            </a>
            <a
              href="https://github.com"
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
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