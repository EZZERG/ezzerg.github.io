'use client'

import { useEffect, useRef } from 'react'
import { motion, MotionValue } from 'framer-motion'

interface BackgroundProps {
  opacity: MotionValue<number>
}

const Background = ({ opacity }: BackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initVanta = () => {
      if (!vantaRef.current || !window.VANTA) return;
      
      const effect = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x14b8a6, // Teal color
        shininess: 60.00,
        waveHeight: 20.00,
        waveSpeed: 0.65,
        zoom: 0.65,
        backgroundColor: 0x000000 // Pure black
      })

      return () => {
        if (effect) effect.destroy()
      }
    }

    // Small delay to ensure scripts are loaded
    const timer = setTimeout(initVanta, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div 
      className="fixed inset-0 -z-10"
      style={{ opacity }}
    >
      <div ref={vantaRef} className="absolute inset-0 bg-gradient-to-br from-black to-teal-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20" />
    </motion.div>
  )
}

export default Background
