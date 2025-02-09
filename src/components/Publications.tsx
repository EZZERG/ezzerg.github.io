'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import TypingTitle from './TypingTitle'
import paper1 from '@/data/papers/paper1.json'
import paper2 from '@/data/papers/paper2.json'

const publicationsData = [paper1, paper2]

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

const Publications = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="publications" className="space-y-6">
      <div className="overflow-hidden">
        <TypingTitle 
          text="Publications"
          className="text-4xl font-bold bg-gradient-to-r from-black to-gray-600 inline-block text-transparent bg-clip-text font-silkscreen"
        />
      </div>

      <div className="relative">
        <div className="space-y-6">
          {publicationsData.map((pub, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-100px", once: false }}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="backdrop-blur-sm bg-black/25 p-6 rounded-2xl border border-white/20 shadow-xl 
                          hover:bg-black/50 hover:backdrop-blur-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-teal-300 font-space">
                      {pub.title}
                    </h3>
                    
                    <p className="text-gray-300 mt-2 font-medium font-space">
                      {pub.year} | {pub.venue}
                    </p>
                    
                    <p className="text-gray-200 mt-2 font-space">
                      {pub.authors.join(", ")}
                    </p>
                    
                    <p className="text-gray-200 mt-4 leading-relaxed font-space">
                      {pub.abstract}
                    </p>
                    
                    <div className="flex gap-4 mt-4">
                      {pub.links.arxiv && (
                        <a href={pub.links.arxiv} target="_blank" rel="noopener noreferrer" 
                          className="text-teal-400 hover:text-teal-300 transition-colors">
                          arXiv
                        </a>
                      )}
                      {pub.links.code && (
                        <a href={pub.links.code} target="_blank" rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors">
                          Code
                        </a>
                      )}
                      {pub.links.pdf && (
                        <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors">
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:w-[425px] h-[300px] rounded-lg overflow-hidden bg-white/5 relative">
                    <img
                      src={pub.previewImage}
                      alt={`Preview of ${pub.title}`}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
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

export default Publications
