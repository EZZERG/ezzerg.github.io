'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import About from '../components/About'
import Education from '../components/Education'
import Employment from '../components/Employment'
import Publications from '../components/Publications'
import Background from '../components/Background'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <Background />
      <Navigation />
      
      <main className="max-w-4xl mx-auto space-y-[50vh] pt-16 pb-[30vh]">
        <Header />
        <About />
        <Education />
        <Employment />
        <Publications />
      </main>
    </div>
  )
}
