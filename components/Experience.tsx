'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Section from './Section'
import type { Employment, TextContent } from '@/lib/types'

export default function Experience() {
  const [employment, setEmployment] = useState<Employment[]>([])
  
  useEffect(() => {
    const loadEmployment = async () => {
      const employmentFiles = ['amazon', 'axa', 'fimatix', 'ibm']
      const employmentData = await Promise.all(
        employmentFiles.map(async (file) => {
          const response = await fetch(`/data/employment/${file}.json`)
          return response.json()
        })
      )
      setEmployment(employmentData.sort((a, b) => {
        const yearA = parseInt(a.years.split('-')[0])
        const yearB = parseInt(b.years.split('-')[0])
        return yearB - yearA
      }))
    }
    loadEmployment()
  }, [])

  return (
    <Section id="experience" title="Professional Experience" className="bg-gradient-to-br from-orange-100/30 via-amber-50/20 to-yellow-100/30 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-gray-900/30">
      <div className="relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2"></div>
        
        <div className="space-y-12">
          {employment.map((job, index) => (
            <ExperienceCard key={`${job.employer}-${job.years}`} job={job} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function ExperienceCard({ job, index }: { job: Employment; index: number }) {
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
            className="text-amber-700 dark:text-blue-400 hover:underline"
          >
            {content}
          </a>
        )
      }
      
      return <span key={idx}>{content}</span>
    })
  }
  
  const isEven = index % 2 === 0
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex flex-col md:flex-row items-center ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gray-900 dark:bg-gray-100 rounded-full transform md:-translate-x-1/2"></div>
      
      <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'} pl-16 md:pl-0`}>
        <div className="glass-card glass-card-hover rounded-xl shadow-lg p-6 group">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={job.logo}
                alt={`${job.employer} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{job.employer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {job.years} • {job.city}, {job.country}
              </p>
            </div>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {renderDescription(job.description)}
          </div>
        </div>
      </div>
      
      <div className="hidden md:block md:w-1/2"></div>
    </motion.div>
  )
}