import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-chapter="hero"
      className="relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-16 text-slate-100"
    >
      {/* Balanced nocturnal readability scrim preserving luminous 3D silk crests across the stage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(9,11,16,0.88) 0%, rgba(9,11,16,0.68) 48%, rgba(9,11,16,0.34) 100%)',
        }}
      />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-8 flex-1 flex flex-col justify-center will-change-transform origin-center"
      >
        {/* Split-Screen Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <motion.div
            style={{ y: copyY }}
            className="lg:col-span-7 flex flex-col justify-center py-2"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm font-mono text-slate-200 tracking-wide mb-6 flex flex-wrap items-center gap-x-2.5 gap-y-1"
              >
                <span>University College London</span>
                <span aria-hidden="true">·</span>
                <span>Statistical Science</span>
                <span aria-hidden="true">·</span>
                <span>London, UK</span>
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight leading-[1.06] text-white max-w-2xl"
              >
                About{' '}
                <span className="font-serif italic font-normal text-blue-300">me.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl"
              >
                I am <strong className="font-semibold text-white">{PROFILE.name}</strong> — a PhD
                student in Statistics and Machine Learning at UCL exploring generalizations of
                classical Bayesian inference, following six years as an Applied Scientist at Amazon
                and Fimatix.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#publications"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <span>Explore Publications</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={PROFILE.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#090b10]/55 border border-white/25 text-white text-sm font-medium hover:border-white/45 hover:bg-[#090b10]/75 transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-slate-200" aria-hidden="true" />
                <span>Curriculum Vitae</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-200" aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Parallax Portrait Frame */}
          <motion.div
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="relative w-full min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-white/12 bg-[#111520] flex flex-col justify-end">
              {!imgError ? (
                <img
                  src={PROFILE.profilePhoto}
                  alt="Portrait of Abdelhamid Ezzerg"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
                  <span className="font-display text-5xl font-semibold text-white/80">AE</span>
                </div>
              )}

              {/* Measured bottom contrast scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#090b10]/90 via-[#090b10]/20 to-transparent"
              />

              <div className="relative z-10 p-6">
                <p className="text-sm font-semibold text-white">{PROFILE.name}</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  PhD Researcher, UCL · Ex-Amazon Alexa TTS
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
