import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE, RESEARCH_INTERESTS } from '../data/portfolioData';

interface ScrollPhraseProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

function ScrollPhrase({ children, progress, range }: ScrollPhraseProps) {
  const opacity = useTransform(progress, range, [0.22, 1]);

  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}

export function AboutSection() {
  const manifestoRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: manifestoRef,
    offset: ['start 78%', 'end 52%'],
  });

  return (
    <section
      id="about"
      data-chapter="about"
      className="relative z-10 py-28 sm:py-36 text-slate-900 bg-[#F6F5F1]/62 rounded-t-[2rem] border-t border-slate-900/12 shadow-[0_-24px_70px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Scroll-Illuminated Editorial Bio */}
        <div
          ref={manifestoRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-20 border-b border-slate-900/15"
        >
          <div className="lg:col-span-4 space-y-4">
            <p className="font-mono text-xs text-slate-700 font-medium tabular-nums">02 · About</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
              From applied science to statistical research.
            </h2>
            <p className="text-xs font-mono text-slate-700 pt-2">
              UCL · Department of Statistical Science
            </p>
          </div>

          <div className="lg:col-span-8 space-y-7">
            <p className="font-display text-2xl sm:text-3xl lg:text-[2.05rem] font-medium tracking-tight leading-[1.34] text-slate-950">
              <ScrollPhrase progress={scrollYProgress} range={[0.0, 0.28]}>
                I am a PhD student in Statistical Science at UCL,
              </ScrollPhrase>{' '}
              <ScrollPhrase progress={scrollYProgress} range={[0.2, 0.48]}>
                working on{' '}
                <span className="font-serif italic font-normal text-blue-700">
                  generalized Bayesian methods
                </span>
              </ScrollPhrase>{' '}
              <ScrollPhrase progress={scrollYProgress} range={[0.4, 0.68]}>
                for modern statistical and machine learning problems.
              </ScrollPhrase>
            </p>

            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0.48, 0.85], [0.25, 1]),
                y: useTransform(scrollYProgress, [0.48, 0.85], [14, 0]),
              }}
              className="space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl"
            >
              <p>
                I started my PhD in October 2024 under the supervision of{' '}
                {PROFILE.supervisors.map((sup, idx) => (
                  <span key={sup.name}>
                    <a
                      href={sup.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-0.5 font-medium text-blue-700 underline decoration-blue-700/35 underline-offset-4 hover:decoration-blue-700 transition-colors"
                    >
                      <span>{sup.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 self-center" aria-hidden="true" />
                    </a>
                    {idx === 0 ? ' and ' : ''}
                  </span>
                ))}
                .
              </p>
              <p>
                Before starting my PhD, I spent six years as an Applied Scientist and Data
                Scientist—building generative Text-to-Speech models for{' '}
                <strong className="font-semibold text-slate-950">Amazon Alexa</strong> in Cambridge
                and extracting structured information from unstructured data at{' '}
                <strong className="font-semibold text-slate-950">Fimatix</strong> in London.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Ribbon: Current & Previous Research Interests */}
        <div className="pt-14 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-10">
          {/* Current Interests */}
          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-wider text-blue-700 font-medium">
              Current Interests
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
              {RESEARCH_INTERESTS.current.map((interest, idx) => (
                <motion.div
                  key={`current-${interest.title}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group space-y-2.5"
                >
                  <div className="pb-2.5 border-b border-blue-700/25 group-hover:border-blue-600 transition-colors duration-300">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-slate-950">
                      {interest.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{interest.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Previous Interests */}
          <div className="space-y-5 lg:border-l lg:border-slate-900/12 lg:pl-10">
            <p className="font-mono text-xs uppercase tracking-wider text-slate-600 font-medium">
              Previous Interests
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7">
              {RESEARCH_INTERESTS.previous.map((interest, idx) => (
                <motion.div
                  key={`previous-${interest.title}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group space-y-2.5"
                >
                  <div className="pb-2.5 border-b border-slate-900/15 group-hover:border-slate-900/40 transition-colors duration-300">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-slate-950 whitespace-nowrap">
                      {interest.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{interest.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
