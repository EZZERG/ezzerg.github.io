import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import type { ChapterId } from '../utils/scrollChoreography';

interface TopNavProps {
  activeChapter: ChapterId;
  isDarkSurface: boolean;
  progress: number;
}

const NAV_LINKS: Array<{ id: ChapterId; label: string; href: string }> = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'trajectory', label: 'Background', href: '#background' },
  { id: 'publications', label: 'Publications', href: '#publications' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export function TopNav({ activeChapter, isDarkSurface, progress }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const surfaceClasses = isDarkSurface
    ? 'bg-[#090b10]/92 text-slate-100 border-white/10'
    : 'bg-[#f6f5f1]/94 text-slate-900 border-slate-900/10';

  const linkMuted = isDarkSurface
    ? 'text-slate-300 hover:text-white'
    : 'text-slate-600 hover:text-slate-950';

  const linkActive = isDarkSurface ? 'text-white' : 'text-slate-950';

  const ctaClasses = isDarkSurface
    ? 'bg-white text-slate-950 hover:bg-blue-500 hover:text-white'
    : 'bg-slate-950 text-white hover:bg-blue-600';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 border-b transition-colors duration-300 ${surfaceClasses}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#hero"
          className="font-display text-lg font-semibold tracking-tight whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
        >
          {PROFILE.name}
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => {
            const isActive = activeChapter === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? linkActive : linkMuted
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-blue-500 transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA (plus mobile menu toggle below md) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={PROFILE.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 ${ctaClasses}`}
          >
            <span>Download CV</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors ${
              isDarkSurface
                ? 'border-white/15 text-slate-100 hover:bg-white/10'
                : 'border-slate-900/15 text-slate-900 hover:bg-slate-900/5'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Hairline scroll progress indicator */}
      <div className="h-[2px] w-full bg-transparent overflow-hidden" aria-hidden="true">
        <div
          className="h-full w-full bg-blue-500 origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className={`md:hidden border-b px-5 py-4 space-y-2 transition-colors ${
            isDarkSurface
              ? 'bg-[#090b10]/95 border-white/10 text-slate-100'
              : 'bg-[#f6f5f1]/95 border-slate-900/10 text-slate-900'
          }`}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-base font-medium border-b border-current/10 last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href={PROFILE.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${ctaClasses}`}
            >
              <span>Download CV</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
