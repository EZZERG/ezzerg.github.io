'use client'

import { useEffect, useRef, useState } from 'react'

const Background = () => {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<any>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const interpolateColor = (progress: number) => {
    // Convert from black (0,0,0) to teal (0,128,128)
    const r = 0
    const g = Math.round(128 * progress)
    const b = Math.round(128 * progress)
    return (r << 16) + (g << 8) + b
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(window.scrollY / totalHeight, 1)
      setScrollProgress(progress)
      
      if (effectRef.current) {
        const newColor = interpolateColor(progress)
        effectRef.current.setOptions({
          color: newColor,
          backgroundColor: newColor
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const initVanta = () => {
      if (!vantaRef.current || !window.VANTA) return;
      
      effectRef.current = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x000000,
        shininess: 60.00,
        waveHeight: 20.00,
        waveSpeed: 0.65,
        zoom: 0.65,
        backgroundColor: 0x000000
      })

      return () => {
        if (effectRef.current) effectRef.current.destroy()
      }
    }

    const timer = setTimeout(initVanta, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <div ref={vantaRef} className="absolute inset-0 bg-black" />
    </div>
  )
}

export default Background
