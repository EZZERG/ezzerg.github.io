'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 5,
    delay: Math.random() * 2,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-blue-600/10 dark:to-purple-600/10"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/5 to-transparent dark:via-blue-400/5" />
      
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-300/10 dark:from-purple-600/5 dark:to-pink-600/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400/10 to-amber-400/10 dark:from-blue-600/5 dark:to-cyan-600/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}