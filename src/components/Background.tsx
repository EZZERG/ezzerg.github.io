'use client'

import { useEffect, useRef } from 'react'

const Background = () => {
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
        color: 0x0,
        shininess: 60.00,
        waveHeight: 20.00,  // Adjust wave height (default: 40)
        waveSpeed: 0.65,    // Adjust wave speed (default: 1)
        zoom: 0.65,         // Adjust zoom level (default: 1)
        backgroundColor: 0x0B1026
      })

      return () => {
        if (effect) effect.destroy()
      }
    }

    // Small delay to ensure scripts are loaded
    const timer = setTimeout(initVanta, 100)
    return () => clearTimeout(timer)
  }, [])

  return <div ref={vantaRef} className="fixed inset-0 -z-10 bg-[#0B1026]" />
}

export default Background
