'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

interface TypingTitleProps {
  text: string;
  className?: string;
}

declare global {
  interface Window {
    Typewriter: any;
  }
}

const TypingTitle = ({ text, className = '' }: TypingTitleProps) => {
  const elementRef = useRef<HTMLSpanElement>(null)
  const typewriterRef = useRef<any>(null)
  const isInView = useInView(elementRef, { margin: "-25% 0px" })
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const initTypewriter = () => {
      if (!elementRef.current || !window.Typewriter) {
        setTimeout(initTypewriter, 100)
        return
      }

      if (typewriterRef.current) {
        typewriterRef.current.stop()
        elementRef.current.innerHTML = ''
      }

      setIsTyping(true)
      
      typewriterRef.current = new window.Typewriter(elementRef.current, {
        delay: 75,
        cursor: '',
        wrapperClassName: 'typewriter-wrapper',
      })

      typewriterRef.current
        .pauseFor(300)
        .typeString(text)
        .callFunction(() => setIsTyping(false))
        .start()
    }

    if (isInView) {
      initTypewriter()
    } else {
      // Show full text when not in view
      if (elementRef.current) {
        elementRef.current.innerHTML = text
      }
    }

    return () => {
      if (typewriterRef.current) {
        typewriterRef.current.stop()
        setIsTyping(false)
      }
    }
  }, [isInView, text])

  return (
    <h2 className={`${className} relative inline-flex items-center`}>
      <span ref={elementRef}>{text}</span>
      <motion.span 
        className={`
          h-[1.2em] w-[3px]
          ml-[2px] -mb-[2px]
          ${isTyping ? 'opacity-100' : 'opacity-0'}
        `}
        animate={{
          opacity: [1, 0],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        style={{
          background: 'linear-gradient(to right, #60A5FA, #A78BFA)',
        }}
      />
    </h2>
  )
}

export default TypingTitle
