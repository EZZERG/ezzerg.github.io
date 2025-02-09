'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import TypingTitle from './TypingTitle'

const employmentData = [
  {
    employer: "Current University Name",
    title: "Research Assistant",
    years: "2022 - Present",
    description: "[Brief description of your role and responsibilities, including key projects, achievements, and areas of focus. Consider mentioning specific research areas, publications, or collaborations.]",
    logo: "/institutions/current-employer.svg"
  },
  {
    employer: "Previous University Name",
    title: "Teaching Assistant",
    years: "2020 - 2022",
    description: "[Brief description of courses and responsibilities, including subjects taught, student mentoring, and any curriculum development work. Highlight key achievements and impact on student learning.]",
    logo: "/institutions/previous-employer.svg"
  }
]

const cardVariants = {
  hidden: { 
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
}

const Employment = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [linePosition, setLinePosition] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (timelineRef.current) {
      const position = timelineRef.current.offsetLeft;
      const dotCenteringOffset = 12;
      setLinePosition(position - dotCenteringOffset)
    }
  }, [])

  return (
    <section id="employment" className="space-y-8">
      <div className="overflow-hidden">
        <TypingTitle 
          text="Employment"
          className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 inline-block text-transparent bg-clip-text font-silkscreen"
        />
      </div>
      
      <div className="relative">
        {/* Timeline line with gradient */}
        <div ref={timelineRef} className="absolute left-[11px] top-4 bottom-4 w-[2px]">
          <div className="absolute inset-0 bg-white/20" />
          {hoveredIndex !== null && (
            <div 
              className="absolute top-0 w-full bg-gradient-to-b from-teal-400 to-transparent transition-all duration-300"
              style={{
                height: `${(hoveredIndex + 1) * 100 / employmentData.length}%`,
                opacity: 0.5,
                boxShadow: '0 0 20px 5px rgba(20, 184, 166, 0.5)',
                filter: 'blur(2px)'
              }}
            />
          )}
        </div>
        
        <div className="space-y-6">
          {employmentData.map((job, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-100px", once: false }}
              className="relative flex items-center gap-6 ml-6"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Timeline dot */}
              <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6" 
                style={{ 
                  left: `${linePosition-11}px`,
                  transform: 'translate(-50%, -50%)'
                }}>
                <div 
                  className={`w-3 h-3 bg-teal-400 rounded-full absolute top-1.5 left-1.5 transition-all duration-300
                    ${hoveredIndex === index ? 'animate-glow' : ''}`}
                  style={{ 
                    boxShadow: hoveredIndex === index ? '0 0 20px 5px rgba(20, 184, 166, 0.7)' : 'none',
                    filter: hoveredIndex === index ? 'blur(1px)' : 'none'
                  }} 
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className={`w-full h-full border-2 border-teal-400/50 rounded-full absolute top-0 left-0
                    ${hoveredIndex === index ? 'animate-pulse' : ''}`}
                />
              </div>

              <div className="backdrop-blur-sm bg-black/10 p-6 rounded-2xl border border-white/20 shadow-xl 
                          hover:bg-black/30 transition-all duration-300 hover:backdrop-blur-xl">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 p-4 flex-shrink-0">
                    <img
                      src={job.logo}
                      alt={`${job.employer} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-teal-300 font-space">
                      {job.employer}
                    </h3>
                    <p className="text-xl text-gray-200 mt-1 font-space">
                      {job.title}
                    </p>
                    <p className="text-gray-300 mt-1 font-medium font-space">
                      {job.years}
                    </p>
                    <p className="text-gray-200 mt-4 leading-relaxed font-space">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Employment
