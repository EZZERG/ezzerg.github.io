'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Section from './Section'
import type { Education as EducationType, TextContent } from '@/lib/types'

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
    <Section id="education" title="Education" className="bg-gray-50 dark:bg-gray-900">
      <div className="space-y-8">
        {education.map((edu, index) => (
          <EducationCard key={edu.institution} edu={edu} index={index} />
        ))}
      </div>
    </Section>
  )
}

function EducationCard({ edu, index }: { edu: EducationType; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

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
            className="text-blue-600 dark:text-blue-400 hover:underline"
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
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 relative">
            <Image
              src={edu.logo}
              alt={`${edu.institution} logo`}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1 md:mt-0">
              <p>{edu.years}</p>
              <p>{edu.city}, {edu.country}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            {renderDescription(edu.description)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}