import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import type { Publication } from '../data/portfolioData';
import { isSelfAuthor } from '../utils/publications';

interface PublicationModalProps {
  publication: Publication;
  onClose: () => void;
}

export function PublicationModal({ publication, onClose }: PublicationModalProps) {
  const [copied, setCopied] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleCopyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(publication.bibtex);
    } catch {
      // Fallback for non-secure or restricted clipboard contexts
      const textarea = document.createElement('textarea');
      textarea.value = publication.bibtex;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setShowBibtex(true);
    window.setTimeout(() => setCopied(false), 2600);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/86"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111622] border border-white/15 text-slate-100 shadow-2xl"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#111622]/98 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-slate-400">
            <span className="text-blue-400">{publication.venueShort}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{publication.year}</span>
            {publication.isFirstAuthor && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-200">First Author</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close publication details"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3
            id="publication-modal-title"
            className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-snug"
          >
            {publication.title}
          </h3>

          {/* Authors with Abdelhamid Ezzerg highlighted */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {publication.authors.map((author, idx) => {
              const isSelf = isSelfAuthor(author);
              return (
                <span key={`${author}-${idx}`}>
                  <span className={isSelf ? 'text-white font-semibold underline decoration-blue-400 underline-offset-4' : ''}>
                    {author.trim()}
                  </span>
                  {idx < publication.authors.length - 1 ? ', ' : ''}
                </span>
              );
            })}
          </p>

          {/* Scientific figure plate */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#f8f9fb] p-4">
            {!imgError ? (
              <img
                src={publication.previewImage}
                alt={`Architecture diagram for ${publication.title}`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full max-h-72 object-contain mx-auto"
              />
            ) : (
              <div className="h-44 flex items-center justify-center text-slate-500 text-sm font-mono">
                Figure preview unavailable
              </div>
            )}
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-slate-400">Abstract</h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {publication.abstract}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
            <a
              href={publication.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Read on arXiv</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            {publication.url !== publication.arxivUrl && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/15 text-slate-100 text-xs font-medium hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Venue Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyBibtex}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/15 text-slate-100 text-xs font-medium hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>BibTeX Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowBibtex((prev) => !prev)}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 px-2 py-2 transition-colors whitespace-nowrap shrink-0"
            >
              {showBibtex ? 'Hide BibTeX' : 'Inspect BibTeX'}
            </button>
          </div>

          {showBibtex && (
            <pre className="p-4 rounded-xl bg-[#090b10] border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{publication.bibtex}</code>
            </pre>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
