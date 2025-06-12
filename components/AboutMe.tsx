'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Section from './Section'

export default function AboutMe() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <Section 
      id="about" 
      title="About Me" 
      className="bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30 dark:from-gray-900/30 dark:via-purple-900/20 dark:to-gray-900/30"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card rounded-xl shadow-lg p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I am a passionate researcher and engineer specializing in speech synthesis and machine learning. 
              With a strong academic foundation from prestigious institutions including Cambridge, École Centrale Paris, 
              and ENS Paris-Saclay, I have dedicated my career to advancing the field of Text-to-Speech (TTS) technology.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Currently at Amazon, I lead innovative projects in neural speech synthesis, focusing on creating 
              more natural and expressive synthetic voices. My work spans from theoretical research to practical 
              implementation, with a particular interest in low-resource TTS systems and prosody modeling.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Beyond my technical work, I am committed to sharing knowledge and contributing to the research 
              community through publications, collaborations, and mentorship. I believe in the transformative 
              power of AI to make technology more accessible and human-centered.
            </p>
          </div>
          
          <motion.div 
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
              <svg className="w-5 h-5 text-amber-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">Machine Learning</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
              <svg className="w-5 h-5 text-amber-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-medium">Speech Synthesis</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
              <svg className="w-5 h-5 text-amber-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium">Research</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
              <svg className="w-5 h-5 text-amber-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-sm font-medium">Software Engineering</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  )
}