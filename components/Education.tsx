'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from 'next-themes'
import Section from './Section'
import type { Education as EducationType, TextContent } from '@/lib/types'
import { useThemedLogo } from '@/lib/useThemedLogo'

export default function Education() {
  const [education, setEducation] = useState<EducationType[]>([])
  
  useEffect(() => {
    const loadEducation = async () => {
      const educationFiles = ['cambridge', 'centrale', 'ens', 'ucl']
      const educationData = await Promise.all(
        educationFiles.map(async (file) => {
          const response = await fetch(`/data/education/${file}.json`)
          return response.json()
        })
      )
      setEducation(educationData.reverse())
    }
    loadEducation()
  }, [])

  return (
    <Section id="education" title="Education" className="bg-gradient-to-br from-amber-100/30 via-orange-50/20 to-amber-100/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-gray-900/30">
      <div className="relative">
        {/* Enhanced Timeline Line */}
        <div className="absolute left-8 md:left-0 top-0 bottom-0 w-1 transform overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-300/50 via-orange-400/50 to-amber-300/50 dark:from-purple-400/50 dark:via-blue-500/50 dark:to-purple-400/50 rounded-full" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent dark:via-purple-300/60 rounded-full"
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        <div className="space-y-16">
          {education.map((edu, index) => (
            <EducationCard key={edu.institution} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function EducationCard({ edu, index }: { edu: EducationType; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const { resolvedTheme } = useTheme()
  const themedLogo = useThemedLogo(edu.logo)
  
  const getHoverGlow = () => {
    return resolvedTheme === 'dark' 
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(147, 51, 234, 0.3)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(245, 158, 11, 0.3)"
  }

  const renderDescription = (description: TextContent[]) => {
    return description.map((item, idx) => {
      if (item.type === 'linebreak') {
        return <br key={idx} />
      }
      
      const content = item.style === 'bold' ? <strong>{item.text}</strong> : item.text
      
      if (item.link) {
        return (
          <a 
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 dark:text-blue-400 hover:underline"
          >
            {content}
          </a>
        )
      }
      
      return <span key={idx}>{content}</span>
    })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex flex-col md:flex-row items-center"
    >
      {/* Enhanced Timeline Node */}
      <motion.div 
        className="absolute left-[0.85rem] md:-left-[19px] transform -translate-x-1/2 md:translate-x-0 top-8 md:top-1/2 md:-translate-y-1/2 z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 dark:from-blue-400 dark:to-purple-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
              <motion.div 
                className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 dark:from-blue-500 dark:to-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          {/* Enhanced pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/20 dark:bg-purple-400/20"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/10 dark:bg-purple-400/10"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3 + 0.5,
            }}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="w-full md:w-[calc(100%-3rem)] md:ml-12 pl-16 md:pl-0"
        initial={{ 
          opacity: 0, 
          x: 100,
          rotateY: 20,
          scale: 0.9
        }}
        animate={inView ? { 
          opacity: 1, 
          x: 0,
          rotateY: 0,
          scale: 1
        } : { 
          opacity: 0, 
          x: 100,
          rotateY: 20,
          scale: 0.9
        }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.15,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        whileHover={{ 
          y: -8,
          scale: 1.02,
          rotateX: 5,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
      >
        <motion.div 
          className="glass-card rounded-xl shadow-lg p-6 group relative overflow-hidden border border-amber-200/20 dark:border-purple-500/20"
          whileHover={{
            boxShadow: getHoverGlow()
          }}
          animate={{
            boxShadow: inView ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background gradient */}
          <motion.div 
            className="absolute inset-0 opacity-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-purple-500/10 dark:via-blue-500/5 dark:to-purple-500/10"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-start gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 relative flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15 + 0.4,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 10,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <Image
                  src={themedLogo}
                  alt={`${edu.institution} logo`}
                  fill
                  className="object-contain"
                />
              </motion.div>
              <div className="flex-1">
                <motion.h3 
                  className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                >
                  {edu.degree}
                </motion.h3>
                <motion.p 
                  className="text-amber-700 dark:text-purple-300 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
                >
                  {edu.institution}
                </motion.p>
                <motion.p 
                  className="text-sm text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.7 }}
                >
                  {edu.years} • {edu.city}, {edu.country}
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.8 }}
            >
              {renderDescription(edu.description)}
            </motion.div>
          </div>
          
        </motion.div>
      </motion.div>
    </motion.div>
  )
}