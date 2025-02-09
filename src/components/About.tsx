'use client'

import TypingTitle from './TypingTitle'

const About = () => {
  return (
    <section id="about" className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] hover:backdrop-blur-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20">
          <img
            src="/your-profile-photo.jpg"
            alt="Profile Photo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <TypingTitle 
            text="About Me"
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-orbitron"
          />
          <p className="text-gray-200 leading-relaxed font-space">
            I am a PhD student passionate about [Your Research Area]. My research focuses on [Brief Description]. 
            I am particularly interested in [Specific Interests/Topics].
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
