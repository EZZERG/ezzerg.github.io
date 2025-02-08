'use client'

const About = () => {
  return (
    <section id="about" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">About Me</h2>
      <p className="text-gray-200 leading-relaxed font-raleway">
        I am a PhD student passionate about [Your Research Area]. My research focuses on [Brief Description]. 
        I am particularly interested in [Specific Interests/Topics].
      </p>
    </section>
  )
}

export default About
