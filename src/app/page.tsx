'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import About from '../components/About'
import Education from '../components/Education'
import Employment from '../components/Employment'
import Publications from '../components/Publications'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8 text-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto space-y-12 pt-16">
        <About />
        <Education />
        <Employment />
        <Publications />
      </main>
    </div>
  )
}
