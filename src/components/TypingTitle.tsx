'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

interface TypingTitleProps {
  text: string;
  className?: string;
  startIndex?: number;
}

declare global {
  interface Window {
    Typewriter: any;
  }
}

const TypingTitle = ({ text, className = '', startIndex = 0 }: TypingTitleProps) => {
  const staticRef = useRef<HTMLSpanElement>(null)
  const dynamicRef = useRef<HTMLSpanElement>(null)
  const typewriterRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "-25% 0px" })
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const initTypewriter = () => {
      if (!dynamicRef.current || !staticRef.current || !window.Typewriter) {
        setTimeout(initTypewriter, 100)
        return
      }

      if (typewriterRef.current) {
        typewriterRef.current.stop()
      }

      setIsTyping(true)
      
      // Always include trailing space with the static part
      let splitIndex = startIndex
      if (text[splitIndex - 1] === ' ') splitIndex--
      
      const staticPart = text.slice(0, splitIndex)
      const dynamicPart = text.slice(splitIndex)
      
      staticRef.current.textContent = staticPart
      dynamicRef.current.textContent = ''
      
      typewriterRef.current = new window.Typewriter(dynamicRef.current, {
        delay: 75,
        cursor: '',
        wrapperClassName: 'typewriter-wrapper',
        startDelay: 300,
      })

      typewriterRef.current
        .typeString(dynamicPart)
        .callFunction(() => setIsTyping(false))
        .start()
    }

    if (isInView) {
      initTypewriter()
    } else {
      if (staticRef.current && dynamicRef.current) {
        let splitIndex = startIndex
        if (text[splitIndex - 1] === ' ') splitIndex--
        staticRef.current.textContent = text.slice(0, splitIndex)
        dynamicRef.current.textContent = text.slice(splitIndex)
      }
    }

    return () => {
      if (typewriterRef.current) {
        typewriterRef.current.stop()
        setIsTyping(false)
      }
    }
  }, [isInView, text, startIndex])

  return (
    <h2 className={`${className} relative inline-flex items-center`} ref={containerRef}>
      <span ref={staticRef} className="inline-block whitespace-pre"></span>
      <span ref={dynamicRef} className="inline-block whitespace-pre"></span>
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
