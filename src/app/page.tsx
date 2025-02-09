'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import About from '../components/About'
import Education from '../components/Education'
import Employment from '../components/Employment'
import Publications from '../components/Publications'
import Background from '../components/Background'
import StickyHeader from '../components/StickyHeader'

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 100,
        scale: 0.95,
        rotateX: -10
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotateX: 0
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1.2,
        ease: [0.25, 0.1, 0, 1],
        opacity: { duration: 0.8 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <Background />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <StickyHeader activeSection={activeSection} />
      
      <main className="max-w-4xl mx-auto space-y-[50vh] pt-16 pb-[30vh]">
        <Section>
          <Header />
        </Section>
        <Section>
          <About />
        </Section>
        <Education />
        <Employment />
        <Section>
          <Publications />
        </Section>
      </main>
    </div>
  )
}
