'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import About from '../components/About'
import Education from '../components/Education'
import Employment from '../components/Employment'
import Publications from '../components/Publications'
import Background from '../components/Background'
import StickyHeader from '../components/StickyHeader'

const ParallaxSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["0%", "50%"],
    { 
      ease: cubicBezier(0.4, 0, 0, 1)
    }
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3],
    [1, 1, 0]
  )

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen"
    >
      <motion.div
        className="sticky top-0 h-screen flex items-center py-16"
        style={{ opacity, y }}
      >
        <div className="w-full">
          {children}
        </div>
      </motion.div>
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
    <div className="text-white">
      <Background />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <StickyHeader activeSection={activeSection} />
      
      <motion.div 
        className="relative w-full"
      >
        <div className="max-w-4xl mx-auto px-4">
          <ParallaxSection>
            <Header />
          </ParallaxSection>
          <ParallaxSection>
            <About />
          </ParallaxSection>
          <ParallaxSection>
            <Education />
          </ParallaxSection>
          <ParallaxSection>
            <Employment />
          </ParallaxSection>
          <ParallaxSection>
            <Publications />
          </ParallaxSection>
        </div>
      </motion.div>
    </div>
  )
}
