'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const educationData = [
  {
    institution: "Current University Name",
    degree: "PhD in [Your Field]",
    years: "2021 - Present",
    description: "Currently researching [Topic] under the supervision of [Professor]. Focus areas include [Area 1], [Area 2], and [Area 3]. Part of the [Lab/Research Group] working on [Project/Initiative].",
    logo: "/institutions/current-university.svg"
  },
  {
    institution: "Previous University Name",
    degree: "Master's in [Your Field]",
    years: "2019 - 2021",
    description: "Completed thesis on [Topic] with focus on [Specific Area]. Participated in [Notable Project/Research].",
    logo: "/institutions/masters-university.svg"
  },
  {
    institution: "First University Name",
    degree: "Bachelor's in [Your Field]",
    years: "2015 - 2019",
    description: "Graduated with honors. Major in [Subject] with minor in [Subject]. Key projects included [Project 1] and [Project 2].",
    logo: "/institutions/bachelors-university.svg"
  }
]

const titleVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

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

const Education = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [linePosition, setLinePosition] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (timelineRef.current) {
      const position = timelineRef.current.offsetLeft;
      const dotCenteringOffset = 12; // Half of dot width (24px/2)
      setLinePosition(position - dotCenteringOffset)
    }
  }, [])

  return (
    <section id="education" className="space-y-8">
      <div className="overflow-hidden">
        <motion.h2 
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair"
        >
          Education
        </motion.h2>
      </div>
      
      <div className="relative">
        {/* Timeline line with gradient */}
        <div ref={timelineRef} className="absolute left-[11px] top-4 bottom-4 w-[2px]">
          <div className="absolute inset-0 bg-white/20" />
          {hoveredIndex !== null && (
            <div 
              className="absolute top-0 w-full bg-gradient-to-b from-blue-400 to-transparent transition-all duration-300"
              style={{
                height: `${(hoveredIndex + 1) * 100 / educationData.length}%`,
                opacity: 0.5,
                boxShadow: '0 0 20px 5px rgba(96, 165, 250, 0.5)',
                filter: 'blur(2px)'
              }}
            />
          )}
        </div>
        
        <div className="space-y-6">
          {educationData.map((edu, index) => (
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
                  transform: 'translate(-50%, -50%)' // Center both horizontally and vertically
                }}>
                <div 
                  className={`w-3 h-3 bg-blue-400 rounded-full absolute top-1.5 left-1.5 transition-all duration-300
                    ${hoveredIndex === index ? 'animate-glow' : ''}`}
                  style={{ 
                    boxShadow: hoveredIndex === index ? '0 0 20px 5px rgba(96, 165, 250, 0.7)' : 'none',
                    filter: hoveredIndex === index ? 'blur(1px)' : 'none'
                  }} 
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className={`w-full h-full border-2 border-blue-400/50 rounded-full absolute top-0 left-0
                    ${hoveredIndex === index ? 'animate-pulse' : ''}`}
                />
              </div>

              <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl 
                          hover:bg-white/[0.15] transition-all duration-300 hover:scale-[1.01] flex-1">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/10 p-4 flex-shrink-0">
                    <img
                      src={edu.logo}
                      alt={`${edu.institution} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-blue-300 font-raleway">
                      {edu.institution}
                    </h3>
                    <p className="text-xl text-gray-200 mt-1 font-raleway">
                      {edu.degree}
                    </p>
                    <p className="text-gray-300 mt-1 font-medium">
                      {edu.years}
                    </p>
                    <p className="text-gray-200 mt-4 leading-relaxed">
                      {edu.description}
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

export default Education
