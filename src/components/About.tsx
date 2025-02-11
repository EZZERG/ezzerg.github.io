'use client'

import { IoPersonOutline } from 'react-icons/io5'
import TypingTitle from './TypingTitle'

const About = () => {
  return (
    <section 
      id="about"
      className="min-h-screen flex items-center py-16"
    >
      <div className="space-y-8 w-full">
        <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/20 shadow-xl 
                    hover:bg-white/[0.15] hover:backdrop-blur-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
            <div className="w-48 h-48 md:w-[40%] md:h-[400px] rounded-2xl overflow-hidden border-4 border-white/20">
              <img
                src="/profile_photo/Profile_photo.jpeg"
                alt="Profile Photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-[55%]">
              <div className="flex items-center gap-3 mb-6">
                <IoPersonOutline className="w-8 h-8 text-teal-400" />
                <TypingTitle 
                  text="About Me"
                  className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 inline-block text-transparent bg-clip-text font-orbitron"
                  startIndex={2}
                />
              </div>
              <p className="text-gray-200 leading-relaxed font-space text-content">
              Welcome to my academic profile! I am currently a PhD student at University College London (UCL),
              where I began my doctoral journey in October 2024 under the supervision of Professors <a href="https://jeremiasknoblauch.github.io/">Jeremias Knoblauch</a> and <a href="https://ilijabogunovic.com/">Ilija Bogunovic</a>. 
              My research focuses on modern Bayesian methods and their applications, an area I find both challenging and exciting.
              Prior to starting my PhD, I worked for six years as an Applied Scientist,
              where I gained valuable experience in Machine Learning projects involving Text-to-Speech synthesis (at Amazon)
              and information extraction from unstructured data (at Fimatix).
               Now, as I progress through my doctoral studies, I'm keen to deepen my understanding of Bayesian statistics and machine learning,
              aiming to contribute to both theoretical advancements and practical applications in the field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
