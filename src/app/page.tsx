'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import About from '../components/About'
import Education from '../components/Education'
import Employment from '../components/Employment'
import Publications from '../components/Publications'
import Background from '../components/Background'
import StickyHeader from '../components/StickyHeader'

const Section = ({ children, id }: { children: React.ReactNode, id?: string }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  )

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center"
      style={{ opacity }}
      data-section-id={id}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="text-white">
      <Background />
      <Navigation />
      <StickyHeader />
      
      <div className="relative w-full">
        <div className="max-w-4xl mx-auto px-4">
          <Section id="main-header">
            <Header />
          </Section>
          <Section id="about">
            <About />
          </Section>
          <Section id="education">
            <Education />
          </Section>
          <Section id="employment">
            <Employment />
          </Section>
          <Section id="publications">
            <Publications />
          </Section>
        </div>
      </div>
    </div>
  )
}
