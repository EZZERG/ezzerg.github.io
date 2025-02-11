'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import TypingTitle from './TypingTitle'
import BibtexModal from './BibtexModal'
import { BibTexEntry } from '@/types/publication'

import paper1 from '@/data/papers/paper_1.json'
import paper2 from '@/data/papers/paper_2.json'
import paper3 from '@/data/papers/paper_3.json'
import paper4 from '@/data/papers/paper_4.json'
import paper5 from '@/data/papers/paper_5.json'
import paper6 from '@/data/papers/paper_6.json'
import paper7 from '@/data/papers/paper_7.json'
import paper8 from '@/data/papers/paper_8.json'


const publicationsData = [paper8, paper7, paper6, paper5, paper4, paper3, paper2, paper1]

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
  const [expandedAuthors, setExpandedAuthors] = useState<number[]>([])
  const [expandedAbstracts, setExpandedAbstracts] = useState<number[]>([])
  const [bibtexModal, setBibtexModal] = useState<{ 
    isOpen: boolean; 
    data: { 
      bibtex: BibTexEntry; 
      title: string 
    } 
  }>({
    isOpen: false,
    data: { 
      bibtex: { 
        type: '', 
        key: '', 
        fields: {} 
      }, 
      title: '' 
    }
  })

  const toggleAuthors = (index: number) => {
    setExpandedAuthors(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleAbstract = (index: number) => {
    setExpandedAbstracts(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const showBibtex = (bibtex: BibTexEntry, title: string) => {
    setBibtexModal({ isOpen: true, data: { bibtex, title } })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
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
                              w-full`}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-2xl font-semibold text-teal-300 font-space">
                        {pub.url ? (
                          <a 
                            href={pub.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-teal-200 transition-colors"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </h3>
                      
                      <p className="text-gray-300 mt-2 font-medium font-space">
                        {pub.year} | {pub.venue}
                      </p>
                      
                      <div className="relative">
                        <p className="text-gray-200 mt-2 font-space">
                          {expandedAuthors.includes(index) 
                            ? pub.authors.join(", ")
                            : truncateText(pub.authors.join(", "), 100)}
                          {pub.authors.join(", ").length > 100 && (
                            <button
                              onClick={() => toggleAuthors(index)}
                              className="text-teal-400 hover:text-teal-300 transition-colors text-sm ml-1"
                            >
                              {expandedAuthors.includes(index) ? "Show less" : "Read more"}
                            </button>
                          )}
                        </p>
                      </div>
                      
                      <div className="relative mt-4">
                        <p className={`text-gray-200 leading-relaxed font-space ${!expandedAbstracts.includes(index) ? 'line-clamp-4' : ''}`}>
                          {pub.abstract}
                        </p>
                        {pub.abstract.length > 300 && (
                          <button
                            onClick={() => toggleAbstract(index)}
                            className="text-teal-400 hover:text-teal-300 transition-colors text-sm ml-1"
                          >
                            {expandedAbstracts.includes(index) ? "Show less" : "...Read more"}
                          </button>
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
                          {pub.bibtex && (
                            <button
                              onClick={() => showBibtex(pub.bibtex, pub.title)}
                              className="text-teal-400 hover:text-teal-300 transition-colors"
                            >
                              BibTeX
                            </button>
                          )}
                        </div>
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

      <BibtexModal
        isOpen={bibtexModal.isOpen}
        onClose={() => setBibtexModal(prev => ({ ...prev, isOpen: false }))}
        bibtex={bibtexModal.data.bibtex}
        title={bibtexModal.data.title}
      />
    </section>
  )
}

export default Publications
