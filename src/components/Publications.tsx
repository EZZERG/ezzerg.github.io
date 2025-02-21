'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, MouseEvent } from 'react'
import { IoNewspaperOutline } from 'react-icons/io5'
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  X, 
  FileText, 
  Code, 
  Book 
} from 'lucide-react'
import TypingTitle from './TypingTitle'
import BibtexModal from './BibtexModal'
import { Publication } from '@/types/publication'

import paper1 from '@/data/papers/paper_1.json'
import paper2 from '@/data/papers/paper_2.json'
import paper3 from '@/data/papers/paper_3.json'
import paper4 from '@/data/papers/paper_4.json'
import paper5 from '@/data/papers/paper_5.json'
import paper6 from '@/data/papers/paper_6.json'
import paper7 from '@/data/papers/paper_7.json'
import paper8 from '@/data/papers/paper_8.json'

const publicationsData: Publication[] = [paper8, paper7, paper6, paper5, paper4, paper3, paper2, paper1]

const groupPublicationsByYear = (publications: Publication[]) => {
  const grouped = publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<string, Publication[]>);

  return Object.entries(grouped)
    .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA));
};

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
  const [hoveredPublication, setHoveredPublication] = useState<{year: string; index: number} | null>(null)
  const [expandedAuthors, setExpandedAuthors] = useState<Array<{year: string; index: number}>>([])
  const [expandedAbstracts, setExpandedAbstracts] = useState<Array<{year: string; index: number}>>([])
  const [bibtexModal, setBibtexModal] = useState<{ 
    isOpen: boolean; 
    data: { 
      bibtex: string; 
      title: string 
    } 
  }>({
    isOpen: false,
    data: { 
      bibtex: '', 
      title: '' 
    }
  })
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const groupedPublications = groupPublicationsByYear(publicationsData);

  const isExpanded = (year: string, index: number, type: 'authors' | 'abstracts') => {
    const array = type === 'authors' ? expandedAuthors : expandedAbstracts;
    return array.some((item: {year: string; index: number}) => item.year === year && item.index === index);
  };

  const toggleAuthors = (year: string, index: number) => {
    setExpandedAuthors((prev: Array<{year: string; index: number}>) => {
      const exists = prev.some(item => item.year === year && item.index === index);
      if (exists) {
        return prev.filter(item => !(item.year === year && item.index === index));
      }
      return [...prev, { year, index }];
    });
  };

  const toggleAbstract = (year: string, index: number) => {
    setExpandedAbstracts((prev: Array<{year: string; index: number}>) => {
      const exists = prev.some(item => item.year === year && item.index === index);
      if (exists) {
        return prev.filter(item => !(item.year === year && item.index === index));
      }
      return [...prev, { year, index }];
    });
  };

  const showBibtex = (bibtex: string, title: string) => {
    setBibtexModal({ isOpen: true, data: { bibtex, title } });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "..."
  }

  return (
    <>
      <section 
        id="publications" 
        className="min-h-screen flex items-center py-16"
      >
        <div className="space-y-8 w-full">
          <div className="overflow-hidden flex items-center gap-3">
            <IoNewspaperOutline className="w-8 h-8 text-black" />
            <TypingTitle 
              text="Publications"
              className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 inline-block text-transparent bg-clip-text font-orbitron"
              startIndex={3}
            />
          </div>

          <div className="relative">
            <div className="space-y-12">
              {groupPublicationsByYear(publicationsData).map(([year, publications]) => (
                <div key={year} className="space-y-6">
                  <h2 className="text-3xl font-bold text-white/90 font-space border-b-2 border-white/20 pb-3">
                    {year}
                  </h2>
                  
                  {publications.map((pub, index) => (
                    <motion.div
                      key={`${year}-${index}`}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ margin: "-100px", once: false }}
                      className="relative flex items-center"
                      onMouseEnter={() => setHoveredPublication({ year, index })}
                      onMouseLeave={() => setHoveredPublication(null)}
                    >
                      <div className={`backdrop-blur-md bg-black/40 p-6 rounded-2xl border border-white/20 shadow-xl 
                                    hover:bg-black/70 hover:backdrop-blur-xl transition-all duration-300
                                    w-full`}>
                        <div className="flex flex-col items-center lg:items-stretch lg:flex-row gap-6">
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
                              <p className="authors-text mt-2 font-space">
                                {isExpanded(year, index, 'authors')
                                  ? pub.authors.join(", ")
                                  : truncateText(pub.authors.join(", "), 100)}
                                {pub.authors.join(", ").length > 100 && (
                                  <button
                                    onClick={() => toggleAuthors(year, index)}
                                    className="text-teal-400 hover:text-teal-300 transition-colors text-sm ml-1"
                                  >
                                    {isExpanded(year, index, 'authors') ? "Show less" : "Read more"}
                                  </button>
                                )}
                              </p>
                            </div>
                            
                            <div className="relative mt-4">
                              <p className={`text-gray-200 leading-relaxed font-space ${!isExpanded(year, index, 'abstracts') ? 'line-clamp-4' : ''}`}>
                                {pub.abstract}
                              </p>
                              {pub.abstract.length > 300 && (
                                <button
                                  onClick={() => toggleAbstract(year, index)}
                                  className="text-teal-400 hover:text-teal-300 transition-colors text-sm ml-1"
                                >
                                  {isExpanded(year, index, 'abstracts') ? "Show less" : "...Read more"}
                                </button>
                              )}
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                              <div className="flex gap-3">
                                {pub.links.arxiv && (
                                  <a 
                                    href={pub.links.arxiv} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span>arXiv</span>
                                  </a>
                                )}
                                {pub.links.code && (
                                  <a 
                                    href={pub.links.code} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm"
                                  >
                                    <Code className="w-4 h-4" />
                                    <span>Code</span>
                                  </a>
                                )}
                                {pub.bibtex && (
                                  <button
                                    onClick={() => showBibtex(pub.bibtex, pub.title)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm"
                                  >
                                    <Book className="w-4 h-4" />
                                    <span>BibTeX</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:w-[30vw] w-full max-w-[425px] rounded-lg overflow-hidden bg-black/10 relative flex-shrink-0 lg:self-center flex items-center justify-center transition-colors hover:bg-black/20 group">
                            <button
                              onClick={() => setZoomedImage(pub.previewImage)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 hover:text-white"
                              aria-label="Zoom image"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                            <img
                              src={pub.previewImage}
                              alt={`Preview of ${pub.title}`}
                              className="w-auto max-h-[300px] object-contain py-4 px-2"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <BibtexModal
          isOpen={bibtexModal.isOpen}
          onClose={() => setBibtexModal((prev) => ({ ...prev, isOpen: false }))}
          bibtex={bibtexModal.data.bibtex}
          title={bibtexModal.data.title}
        />
      </section>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomedImage(null)}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
              aria-label="Close zoom view"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoomedImage}
              alt="Zoomed preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Publications
