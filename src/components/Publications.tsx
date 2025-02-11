'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section 
      id="publications" 
      className="min-h-screen flex items-center py-16"
    >
      <div className="space-y-8 w-full">
        <div className="overflow-hidden flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-black" strokeWidth={1.5} />
          <TypingTitle 
            text="Publications"
            className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 inline-block text-transparent bg-clip-text font-orbitron"
            startIndex={3}
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
                <div className={`backdrop-blur-md bg-black/40 p-6 rounded-2xl border border-white/20 shadow-xl 
                              hover:bg-black/70 hover:backdrop-blur-xl transition-all duration-300
                              w-full ${expandedIndex === index ? 'h-auto' : 'h-[40vh] min-h-[400px]'}`}>
                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-2xl font-semibold text-teal-300 font-space">
                        {pub.title}
                      </h3>
                      
                      <p className="text-gray-300 mt-2 font-medium font-space">
                        {pub.year} | {pub.venue}
                      </p>
                      
                      <p className="text-gray-200 mt-2 font-space">
                        {pub.authors.join(", ")}
                      </p>
                      
                      <div className="relative flex-1 overflow-hidden">
                        <p className={`text-gray-200 mt-4 leading-relaxed font-space
                                    ${expandedIndex === index ? '' : 'line-clamp-4'}`}>
                          {pub.abstract}
                        </p>
                        
                        {pub.abstract.length > 300 && expandedIndex !== index && (
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex gap-4">
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

                        {pub.abstract.length > 300 && (
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="ml-auto flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            {expandedIndex === index ? (
                              <>
                                Show less <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Read more <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="lg:w-[30vw] max-w-[425px] aspect-[4/3] rounded-lg overflow-hidden bg-white/5 relative flex-shrink-0 self-start">
                      <img
                        src={pub.previewImage}
                        alt={`Preview of ${pub.title}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Publications
