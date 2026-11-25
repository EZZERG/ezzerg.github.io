import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, BookOpen, Search, X } from 'lucide-react';
import { PUBLICATIONS, type Publication } from '../data/publications';
import {
  countByYear,
  filterPublications,
  getAvailableTopics,
  getAvailableYears,
  isSelfAuthor,
  type TopicFilter,
  type YearFilter,
} from '../utils/publications';
import { PublicationModal } from './PublicationModal';

export function PublicationsSection() {
  const [selectedYear, setSelectedYear] = useState<YearFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('all');
  const [firstAuthorOnly, setFirstAuthorOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [activePaper, setActivePaper] = useState<Publication | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const gridRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });

  // Subtle dual-column editorial parallax offset on desktop
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [32, -32]);

  const years = useMemo(() => getAvailableYears(PUBLICATIONS), []);
  const topics = useMemo(() => getAvailableTopics(PUBLICATIONS), []);
  const yearCounts = useMemo(() => countByYear(PUBLICATIONS), []);

  const filtered = useMemo(
    () =>
      filterPublications(PUBLICATIONS, {
        year: selectedYear,
        topic: selectedTopic,
        firstAuthorOnly,
        query,
      }),
    [selectedYear, selectedTopic, firstAuthorOnly, query],
  );

  const leftPapers = filtered.filter((_, idx) => idx % 2 === 0);
  const rightPapers = filtered.filter((_, idx) => idx % 2 === 1);

  const hasActiveFilters =
    selectedYear !== 'all' || selectedTopic !== 'all' || firstAuthorOnly || query.trim().length > 0;

  const resetFilters = () => {
    setSelectedYear('all');
    setSelectedTopic('all');
    setFirstAuthorOnly(false);
    setQuery('');
  };

  const renderPaperCard = (paper: Publication, idx: number) => (
    <motion.article
      key={paper.id}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay: Math.min(idx * 0.05, 0.15),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative rounded-2xl border border-slate-900/12 bg-white/96 hover:border-blue-600/50 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] transition-all duration-300 overflow-hidden flex flex-col"
    >
      <button
        type="button"
        onClick={() => setActivePaper(paper)}
        aria-label={`Inspect paper: ${paper.title}`}
        className="text-left flex-1 flex flex-col p-6 sm:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
      >
        {/* Clean unboxed metadata header */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-700 mb-3">
          <span className="text-blue-700 font-medium">{paper.venueShort}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{paper.year}</span>
          {paper.isFirstAuthor && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-slate-950 font-medium">First Author</span>
            </>
          )}
        </div>

        {/* Paper title */}
        <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-950 group-hover:text-blue-700 transition-colors leading-snug">
          {paper.title}
        </h3>

        {/* Native printed journal diagram plate */}
        <div className="mt-5 w-full h-52 rounded-xl overflow-hidden bg-white border border-slate-900/10 p-3 flex items-center justify-center">
          {!brokenImages[paper.id] ? (
            <img
              src={paper.previewImage}
              alt={`Diagram preview for ${paper.title}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setBrokenImages((prev) => ({ ...prev, [paper.id]: true }))}
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-mono">{paper.venueShort}</span>
            </div>
          )}
        </div>

        {/* Authors line */}
        <p className="mt-4 text-xs text-slate-700 leading-relaxed line-clamp-2">
          {paper.authors.map((author, aIdx) => (
            <span key={`${paper.id}-${aIdx}`}>
              <span className={isSelfAuthor(author) ? 'text-slate-950 font-semibold' : ''}>
                {author.trim()}
              </span>
              {aIdx < paper.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </button>

      {/* Unboxed topics + direct links & reader affordance */}
      <div className="mt-auto px-6 sm:px-7 py-4 flex items-center justify-between gap-3 border-t border-slate-900/10 text-xs">
        <span className="font-mono text-slate-700 truncate">{paper.topics.join(' · ')}</span>
        <div className="flex items-center gap-3.5 shrink-0">
          {paper.url !== paper.arxivUrl && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-mono font-medium text-slate-800 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              <span>Venue</span>
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </a>
          )}
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-mono font-medium text-slate-800 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            <span>arXiv</span>
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setActivePaper(paper)}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-600 whitespace-nowrap"
          >
            <span>Abstract</span>
          </button>
        </div>
      </div>
    </motion.article>
  );

  return (
    <section
      id="publications"
      data-chapter="publications"
      className="relative z-10 py-28 sm:py-36 text-slate-900"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-900/12"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-slate-700 font-medium tabular-nums mb-3">
              04 · Research
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
              Selected{' '}
              <span className="font-serif italic font-normal text-blue-700">Publications</span>
            </h2>
          </div>

          <p className="text-sm text-slate-800 max-w-sm leading-relaxed">
            Select any paper to view its figure, read the abstract, or copy a BibTeX citation.
          </p>
        </motion.div>

        {/* Interactive Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Year Segmented Buttons */}
          <div
            role="group"
            aria-label="Filter publications by year"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-900/6 border border-slate-900/10 self-start"
          >
            <button
              type="button"
              aria-pressed={selectedYear === 'all'}
              onClick={() => setSelectedYear('all')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedYear === 'all'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All Years{' '}
              <span className="font-mono tabular-nums opacity-70 ml-0.5">
                {PUBLICATIONS.length}
              </span>
            </button>

            {years.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span className="font-mono tabular-nums">{year}</span>{' '}
                  <span className="font-mono tabular-nums opacity-70 ml-0.5">
                    {yearCounts[year]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Topic Select, First-Author Toggle, & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pub-topic-select" className="sr-only">
              Filter by research topic
            </label>
            <select
              id="pub-topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as TopicFilter)}
              className="h-10 px-3 rounded-lg bg-white border border-slate-900/12 text-xs font-medium text-slate-800 focus:border-blue-600 cursor-pointer"
            >
              <option value="all">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <button
              type="button"
              aria-pressed={firstAuthorOnly}
              onClick={() => setFirstAuthorOnly((prev) => !prev)}
              className={`h-10 px-3.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                firstAuthorOnly
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-900/12 text-slate-700 hover:text-slate-950 hover:border-slate-900/25'
              }`}
            >
              First Author
            </button>

            <div className="relative flex-1 sm:flex-initial sm:w-56">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="pub-search-input" className="sr-only">
                Search publications
              </label>
              <input
                id="pub-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, venue, author..."
                className="w-full h-10 pl-9 pr-8 rounded-lg bg-white border border-slate-900/12 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear publication search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status summary */}
        <div className="mt-5 flex items-center justify-between text-xs font-mono text-slate-700">
          <span className="tabular-nums" data-testid="publications-count">
            Showing {filtered.length} of {PUBLICATIONS.length} publications
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-blue-700 hover:text-blue-600 underline underline-offset-4 transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Dual-Column Editorial Parallax Monograph Gallery */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-900/12 bg-white/80 p-12 text-center space-y-3">
            <p className="font-display text-xl font-semibold text-slate-950">
              No publications match those criteria.
            </p>
            <p className="text-sm text-slate-600">
              Try clearing your search query or viewing all publication years.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              Show all {PUBLICATIONS.length} papers
            </button>
          </div>
        ) : (
          <div
            ref={gridRef}
            data-testid="publications-grid"
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start"
          >
            <div className="space-y-6 sm:space-y-8">
              {leftPapers.map((paper, idx) => renderPaperCard(paper, idx))}
            </div>
            <motion.div
              style={{ y: rightPapers.length > 0 ? rightColumnY : 0 }}
              className="space-y-6 sm:space-y-8 md:pt-8"
            >
              {rightPapers.map((paper, idx) => renderPaperCard(paper, idx))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Fullscreen Monograph Modal */}
      <AnimatePresence>
        {activePaper && (
          <PublicationModal publication={activePaper} onClose={() => setActivePaper(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
