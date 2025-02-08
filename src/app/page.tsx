'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8 text-white">
      {/* Header Section */}
      <header className="relative w-full min-h-[60vh] flex items-center justify-center mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-playfair bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              [Your Name]
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-gray-200 font-raleway">
              PhD Candidate in [Your Field]
            </p>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-raleway">
              Exploring the intersections of [Research Interest 1] and [Research Interest 2] 
              at [Your University]
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-4 right-4 md:right-8 z-50">
        <div className="flex gap-4 text-sm backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#education" className="hover:text-blue-600 transition-colors">Education</a>
          <a href="#employment" className="hover:text-blue-600 transition-colors">Employment</a>
          <a href="#publications" className="hover:text-blue-600 transition-colors">Publications</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-12">
        {/* About Section */}
        <section id="about" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">About Me</h2>
          <p className="text-gray-200 leading-relaxed font-raleway">
            I am a PhD student passionate about [Your Research Area]. My research focuses on [Brief Description]. 
            I am particularly interested in [Specific Interests/Topics].
          </p>
        </section>

        {/* Education Section */}
        <section id="education" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">Education</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-300 font-raleway">PhD in [Your Field]</h3>
              <p className="text-gray-300">University Name • Expected [Year]</p>
              <p className="text-gray-200 mt-2">Thesis: [Your Thesis Title]</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-300 font-raleway">Master's in [Your Field]</h3>
              <p className="text-gray-300">University Name • [Year]</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-300 font-raleway">Bachelor's in [Your Field]</h3>
              <p className="text-gray-300">University Name • [Year]</p>
            </div>
          </div>
        </section>

        {/* Employment Section */}
        <section id="employment" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">Employment</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-300 font-raleway">Research Assistant</h3>
              <p className="text-gray-300">Department • University Name</p>
              <p className="text-gray-200 mt-2">[Brief description of your role and responsibilities]</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-300 font-raleway">Teaching Assistant</h3>
              <p className="text-gray-300">Department • University Name</p>
              <p className="text-gray-200 mt-2">[Brief description of courses and responsibilities]</p>
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300 mb-8">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">Publications</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-200 font-raleway">
                [Author List]. (Year). [Title of the Paper]. 
                <span className="italic">[Journal Name]</span>, 
                [Volume](Issue), [Pages].
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-200 font-raleway">
                [Author List]. (Year). [Title of the Paper]. 
                <span className="italic">[Conference Name]</span>, 
                [Location].
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
