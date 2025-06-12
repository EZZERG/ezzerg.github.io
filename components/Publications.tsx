'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Section from './Section'
import type { Paper } from '@/lib/types'

export default function Publications() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [filterYear, setFilterYear] = useState<string>('all')
  
  useEffect(() => {
    const loadPapers = async () => {
      const paperNumbers = Array.from({ length: 8 }, (_, i) => i + 1)
      const paperData = await Promise.all(
        paperNumbers.map(async (num) => {
          const response = await fetch(`/data/papers/paper_${num}.json`)
          return response.json()
        })
      )
      setPapers(paperData.sort((a, b) => parseInt(b.year) - parseInt(a.year)))
    }
    loadPapers()
  }, [])

  const years = ['all', ...Array.from(new Set(papers.map(p => p.year))).sort().reverse()]
  const filteredPapers = filterYear === 'all' ? papers : papers.filter(p => p.year === filterYear)

  return (
    <Section id="publications" title="Publications" className="bg-gradient-to-br from-amber-100/30 via-orange-50/20 to-amber-100/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-gray-900/30">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-xl glass-card p-1 shadow-lg">
          {years.map((year) => (
            <motion.button
              key={year}
              onClick={() => setFilterYear(year)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filterYear === year
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-blue-600 dark:to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-800/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year === 'all' ? 'All Years' : year}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredPapers.map((paper, index) => (
            <PublicationCard 
              key={paper.title} 
              paper={paper} 
              index={index} 
              onClick={() => setSelectedPaper(paper)} 
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPaper && (
          <PublicationModal 
            paper={selectedPaper} 
            onClose={() => setSelectedPaper(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  )
}

function PublicationCard({ paper, index, onClick }: { paper: Paper; index: number; onClick: () => void }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -10 }}
      layout
      className="glass-card glass-card-hover rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={paper.previewImage}
          alt={paper.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{paper.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {paper.authors.join(', ')}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-500">{paper.venue}</span>
          <span className="text-gray-500 dark:text-gray-500">{paper.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

function PublicationModal({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/30 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/30 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Paper Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{paper.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {paper.authors.join(', ')}
          </p>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            {paper.venue} • {paper.year}
          </p>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Abstract</h4>
            <p className="text-gray-700 dark:text-gray-300">{paper.abstract}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paper PDF
            </a>
            
            {paper.links.arxiv && (
              <a
                href={paper.links.arxiv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                arXiv
              </a>
            )}
            
            {paper.links.code && (
              <a
                href={paper.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
            )}
          </div>
          
          <details className="mt-6">
            <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              Show BibTeX
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm">
              {paper.bibtex}
            </pre>
          </details>
        </div>
      </motion.div>
    </motion.div>
  )
}