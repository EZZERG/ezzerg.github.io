'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Copy, X } from 'lucide-react'

interface BibtexModalProps {
  isOpen: boolean
  onClose: () => void
  bibtex: string
  title: string
}

const BibtexModal = ({ isOpen, onClose, bibtex, title }: BibtexModalProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibtex);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-5 mx-auto my-auto z-50
                     w-[90vw] max-w-2xl h-fit max-h-[90vh]
                     p-6 rounded-2xl bg-black/90 border border-white/20
                     overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-xl font-semibold text-teal-300">
                Citation for: {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              <pre className="bg-black/50 p-4 rounded-lg text-gray-200 font-mono text-sm whitespace-pre-wrap">
                {bibtex}
              </pre>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="mt-4 self-start inline-flex bg-teal-600 text-white rounded px-3 py-1.5 text-sm hover:bg-teal-500 transition-colors"
            >
              Copy to Clipboard
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BibtexModal
