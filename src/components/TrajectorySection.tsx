import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CITIES, TRAJECTORY_ENTRIES } from '../data/portfolioData';
import { filterTrajectory, type TrajectoryFilter } from '../utils/publications';
import {
  computeTrajectoryKinematics,
  getMilestoneTargetProgress,
  type SpatialTrajectoryState,
} from '../utils/trajectoryMotion';
import { InstitutionLogo } from './InstitutionLogo';
import { YearOdometer } from './YearOdometer';

const FILTER_OPTIONS: Array<{ id: TrajectoryFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
];

const RULER_TICKS = Array.from({ length: 49 }, (_, i) => i);

export interface TrajectorySculptureSignal {
  kinematics: SpatialTrajectoryState;
  fromEntryId: string;
  toEntryId: string;
  fromAccentHex: string;
  toAccentHex: string;
}

interface TrajectorySectionProps {
  onTrajectoryStateChange?: (signal: TrajectorySculptureSignal) => void;
}

export function TrajectorySection({ onTrajectoryStateChange }: TrajectorySectionProps) {
  const [filter, setFilter] = useState<TrajectoryFilter>('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );

  const runwayRef = useRef<HTMLElement | null>(null);

  const entries = useMemo(() => filterTrajectory(TRAJECTORY_ENTRIES, filter), [filter]);

  // Generous scroll runway so every chapter & sculptural morph feels tactile and deliberate
  const desktopRunwayVh = Math.max(280, entries.length * 64);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      setIsDesktopViewport(window.innerWidth >= 1024);
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const raw = -rect.top / scrollable;
      const clamped = Math.max(0, Math.min(1, raw));
      setScrollProgress((prev) =>
        Math.abs(clamped - prev) > 0.0012 || clamped === 0 || clamped === 1 ? clamped : prev,
      );
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [entries.length]);

  useEffect(() => {
    setMobileIndex(0);
  }, [filter]);

  // Desktop kinematics driven by vertical scroll inside the sticky runway
  const desktopKinematics = useMemo(
    () => computeTrajectoryKinematics(scrollProgress, entries),
    [scrollProgress, entries],
  );

  // Mobile kinematics driven by interactive station index
  const mobileProgress = getMilestoneTargetProgress(mobileIndex, entries.length);
  const mobileKinematics = useMemo(
    () => computeTrajectoryKinematics(mobileProgress, entries),
    [mobileProgress, entries],
  );

  // Sync live Trajectory chapter kinematics & sculptural morph target to App & SculpturalFlowCanvas
  useEffect(() => {
    const activeK = isDesktopViewport ? desktopKinematics : mobileKinematics;
    const fromIdx = Math.max(0, Math.min(entries.length - 1, Math.floor(activeK.continuousIndex)));
    const toIdx = Math.min(entries.length - 1, fromIdx + 1);
    const fromEntry = entries[fromIdx] ?? entries[0];
    const toEntry = entries[toIdx] ?? fromEntry;
    if (!fromEntry || !toEntry) return;

    onTrajectoryStateChange?.({
      kinematics: activeK,
      fromEntryId: fromEntry.id,
      toEntryId: toEntry.id,
      fromAccentHex: fromEntry.theme.accent,
      toAccentHex: toEntry.theme.accent,
    });
  }, [desktopKinematics, mobileKinematics, isDesktopViewport, entries, onTrajectoryStateChange]);

  const activeEntry = entries[desktopKinematics.activeIndex] ?? entries[0];
  const activeCityMeta = CITIES[desktopKinematics.activeCity];
  const isDark = desktopKinematics.isDarkSurface;
  const [bgR, bgG, bgB] = desktopKinematics.backgroundRgb;

  const mobileEntry = entries[mobileIndex] ?? entries[0];
  const mobileCityMeta = CITIES[mobileKinematics.activeCity];
  const mobileIsDark = mobileKinematics.isDarkSurface;
  const [mBgR, mBgG, mBgB] = mobileKinematics.backgroundRgb;

  const jumpToMilestone = (targetIdx: number) => {
    const safeIdx = Math.max(0, Math.min(entries.length - 1, targetIdx));

    if (window.innerWidth < 1024) {
      setMobileIndex(safeIdx);
      return;
    }

    const runway = runwayRef.current;
    if (!runway) return;
    const rect = runway.getBoundingClientRect();
    const runwayTop = rect.top + window.scrollY;
    const scrollableDistance = Math.max(1, runway.offsetHeight - window.innerHeight);
    const targetRatio = getMilestoneTargetProgress(safeIdx, entries.length);
    window.scrollTo({
      top: runwayTop + targetRatio * scrollableDistance,
      behavior: 'smooth',
    });
  };

  // Adaptive polarity classes for seamless Dark <-> Sunlit Archival Vellum inversions
  const primaryText = isDark ? 'text-white' : 'text-slate-950';
  const secondaryText = isDark ? 'text-slate-100' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-700';
  const subtleBorder = isDark ? 'border-white/24' : 'border-slate-900/24';
  const controlBg = isDark ? 'bg-black/52' : 'bg-white/82';

  const desktopScrim = `linear-gradient(180deg, rgba(${bgR},${bgG},${bgB},0.0) 70%, rgba(${bgR},${bgG},${bgB},0.78) 100%), linear-gradient(90deg, rgba(${bgR},${bgG},${bgB},0.94) 0%, rgba(${bgR},${bgG},${bgB},0.82) 44%, rgba(${bgR},${bgG},${bgB},0.28) 68%, rgba(${bgR},${bgG},${bgB},0.05) 100%)`;
  const mobileScrim = `linear-gradient(180deg, rgba(${mBgR},${mBgG},${mBgB},0.90) 0%, rgba(${mBgR},${mBgG},${mBgB},0.62) 26%, rgba(${mBgR},${mBgG},${mBgB},0.90) 58%, rgba(${mBgR},${mBgG},${mBgB},0.96) 100%)`;

  return (
    <section
      id="background"
      ref={runwayRef}
      data-chapter="trajectory"
      data-trajectory-theme={isDark ? 'dark' : 'light'}
      className="relative z-10"
      style={{ ['--runway-vh' as string]: `${desktopRunwayVh}vh` }}
    >
      {/* DESKTOP: Full-Bleed Sculptural Flow Monograph (ZERO CARDS, live 3D silk behind stage) */}
      <div className="hidden lg:block" style={{ height: `${desktopRunwayVh}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between pt-20 pb-7">
          {/* Directional Left-Side Readability Scrim (leaves right 55% open to sculpted 3D silk) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: desktopScrim }}
          />

          {/* Top Editorial Bar: Chapter Registration & Category Filter */}
          <div className="relative z-20 max-w-6xl w-full mx-auto px-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
              <span style={{ color: desktopKinematics.accentHex }} className="font-medium">
                03 · Background
              </span>
              <span aria-hidden="true" className={mutedText}>
                /
              </span>
              <span className={secondaryText}>
                {activeEntry ? activeEntry.theme.placeTag : activeCityMeta.name}
              </span>
            </div>

            <div
              role="group"
              aria-label="Filter background by category"
              className={`inline-flex items-center gap-1 p-1 rounded-lg border shrink-0 ${controlBg} ${subtleBorder}`}
            >
              {FILTER_OPTIONS.map((opt) => {
                const count = filterTrajectory(TRAJECTORY_ENTRIES, opt.id).length;
                const isActive = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(opt.id)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? isDark
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-950 text-white'
                        : isDark
                          ? 'text-slate-200 hover:text-white'
                          : 'text-slate-800 hover:text-slate-950'
                    }`}
                  >
                    {opt.label}{' '}
                    <span className="font-mono tabular-nums opacity-65 ml-0.5">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Full-Bleed Borderless Editorial Stage */}
          <div className="relative z-20 max-w-6xl w-full mx-auto px-8 flex-1 flex items-center">
            <div className="w-full grid grid-cols-12 items-stretch gap-8">
              {/* Left 7 Columns: Monumental Mechanical Year Odometer + Curtain-Mask Editorial Typography */}
              <div className="col-span-7 flex flex-col justify-center">
                {/* Giant Rolling Mechanical Year + Compact Chronology Metadata */}
                <div className="flex items-end gap-6">
                  <YearOdometer
                    year={desktopKinematics.interpolatedYear}
                    accentColor={desktopKinematics.accentHex}
                    className="text-[4.8rem] xl:text-[6.2rem]"
                  />

                  {activeEntry && (
                    <div className="pb-2.5 space-y-1 font-mono text-xs">
                      <p className={`${primaryText} font-medium tabular-nums`}>
                        {activeEntry.years}
                      </p>
                      <p className={mutedText}>
                        {activeEntry.kind === 'education' ? 'Academic' : 'Industry'} ·{' '}
                        {activeEntry.monogram}
                      </p>
                    </div>
                  )}
                </div>

                {/* Self-Drawing Architectural Accent Hairline */}
                <div className={`relative h-px w-full my-6 ${isDark ? 'bg-white/16' : 'bg-slate-900/16'}`}>
                  <motion.div
                    key={`rule-${activeEntry?.id ?? 'none'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 w-36 origin-left"
                    style={{ backgroundColor: desktopKinematics.accentHex }}
                  />
                </div>

                {/* Curtain-Mask Animated Milestone Editorial Copy (No Card Box!) */}
                <div className="min-h-[255px] xl:min-h-[275px]">
                  <AnimatePresence mode="wait">
                    {activeEntry && (
                      <motion.div
                        key={activeEntry.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-4"
                      >
                        <p className={`font-mono text-xs tracking-wider uppercase ${mutedText}`}>
                          {activeEntry.organization} · {activeEntry.city}, {activeEntry.country}
                        </p>

                        <h2
                          className={`font-display text-3xl xl:text-[2.55rem] font-semibold tracking-tight leading-[1.12] ${primaryText}`}
                        >
                          {activeEntry.role}
                        </h2>

                        <p
                          className={`text-base xl:text-[17px] leading-relaxed max-w-xl ${secondaryText}`}
                        >
                          {activeEntry.summary}
                        </p>

                        {activeEntry.supervisors && (
                          <p className={`text-sm ${mutedText}`}>
                            Supervisors:{' '}
                            {activeEntry.supervisors.map((sup, sIdx) => (
                              <span key={sup.name}>
                                <a
                                  href={sup.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-baseline gap-0.5 font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
                                  style={{ color: desktopKinematics.accentHex }}
                                >
                                  <span>{sup.name}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 self-center" aria-hidden="true" />
                                </a>
                                {sIdx < activeEntry.supervisors!.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        )}

                        {/* Unboxed Inline Focus Line */}
                        <div
                          className={`pt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono ${mutedText}`}
                        >
                          {activeEntry.highlights.map((kw, kIdx) => (
                            <span key={kw} className="inline-flex items-center gap-2.5">
                              <span>{kw}</span>
                              {kIdx < activeEntry.highlights.length - 1 && (
                                <span aria-hidden="true" className="opacity-40">
                                  ·
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right 5 Columns: Monumental Institution Emblem over 3D Sculpted Silk + Whisper-Clean Chapter Stamp */}
              <div className="col-span-5 flex flex-col items-end justify-between pb-4 pt-6 text-right">
                {/* Floating Institution Emblem centered visually in the open right sculptural space */}
                <div className="flex-1 w-full flex items-center justify-center pl-4">
                  <AnimatePresence mode="wait">
                    {activeEntry && (
                      <motion.div
                        key={`logo-${activeEntry.id}`}
                        initial={{ opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -14, scale: 0.97 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center"
                      >
                        <InstitutionLogo
                          src={activeEntry.logo.src}
                          alt={activeEntry.organization}
                          width={activeEntry.logo.width}
                          height={activeEntry.logo.height}
                          accentHex={desktopKinematics.accentHex}
                          isDark={isDark}
                          align="center"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div
                  className={`space-y-1.5 font-mono text-xs tabular-nums px-4 py-2.5 rounded-lg border ${
                    isDark
                      ? 'bg-[#090b10]/76 border-white/16'
                      : 'bg-[#f6f5f1]/84 border-slate-900/16'
                  }`}
                >
                  <p style={{ color: desktopKinematics.accentHex }} className="font-medium">
                    Chapter {String(desktopKinematics.activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(entries.length).padStart(2, '0')}
                  </p>
                  <p className={primaryText}>
                    {activeCityMeta.name}, {activeCityMeta.country}
                  </p>
                  <p className={secondaryText}>{activeEntry?.years}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Leica-Style Calibrated Architectural Timeline Ruler & Station Controls */}
          <div className="relative z-20 max-w-6xl w-full mx-auto px-8 space-y-3.5">
            {/* Calibrated Vernier Scale with Live Sweeping Needle */}
            <div aria-hidden="true" className="relative h-5 flex items-end justify-between">
              {RULER_TICKS.map((tick) => {
                const isMajor = tick % 6 === 0;
                return (
                  <span
                    key={tick}
                    className={`w-px transition-colors duration-200 ${
                      isMajor
                        ? isDark
                          ? 'h-3 bg-white/36'
                          : 'h-3 bg-slate-900/36'
                        : isDark
                          ? 'h-1.5 bg-white/16'
                          : 'h-1.5 bg-slate-900/16'
                    }`}
                  />
                );
              })}

              {/* Sweeping Precision Vernier Needle */}
              <div
                className="absolute bottom-0 top-0 w-[2px] -translate-x-1/2 transition-[left] duration-75"
                style={{
                  left: `${scrollProgress * 100}%`,
                  backgroundColor: desktopKinematics.accentHex,
                }}
              >
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: desktopKinematics.accentHex }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-6">
              {/* Clickable Station Tabs */}
              <div
                className="flex items-center gap-1 overflow-x-auto"
                role="tablist"
                aria-label="Background milestones"
              >
                {entries.map((entry, idx) => {
                  const isActive = idx === desktopKinematics.activeIndex;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => jumpToMilestone(idx)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? isDark
                            ? 'text-slate-950 font-semibold'
                            : 'text-white font-semibold'
                          : isDark
                            ? 'text-slate-200 hover:text-white hover:bg-white/12'
                            : 'text-slate-800 hover:text-slate-950 hover:bg-slate-900/10'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: desktopKinematics.accentHex }
                          : undefined
                      }
                    >
                      <span className="tabular-nums opacity-75 mr-1.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{entry.monogram}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Stepper */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => jumpToMilestone(desktopKinematics.activeIndex - 1)}
                  disabled={desktopKinematics.activeIndex === 0}
                  aria-label="Previous milestone"
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border ${controlBg} ${subtleBorder} ${primaryText} hover:opacity-85 disabled:opacity-35 disabled:pointer-events-none transition-opacity`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => jumpToMilestone(desktopKinematics.activeIndex + 1)}
                  disabled={desktopKinematics.activeIndex >= entries.length - 1}
                  aria-label="Next milestone"
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border ${controlBg} ${subtleBorder} ${primaryText} hover:opacity-85 disabled:opacity-35 disabled:pointer-events-none transition-opacity`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET (< lg): Full-Bleed Sculptural Stage (Zero Cards, translucent over live 3D silk) */}
      <div
        className="lg:hidden relative pt-24 pb-16 px-5 sm:px-8"
        style={{ background: mobileScrim }}
      >
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="space-y-4">
            <p
              className="font-mono text-xs tabular-nums font-medium"
              style={{ color: mobileKinematics.accentHex }}
            >
              03 · Background · {mobileEntry ? mobileEntry.theme.placeTag : mobileCityMeta.name}
            </p>

            <div
              role="group"
              aria-label="Filter background by category (mobile)"
              className={`inline-flex items-center gap-1 p-1 rounded-lg border ${
                mobileIsDark
                  ? 'bg-black/28 border-white/16'
                  : 'bg-white/65 border-slate-900/18'
              }`}
            >
              {FILTER_OPTIONS.map((opt) => {
                const count = filterTrajectory(TRAJECTORY_ENTRIES, opt.id).length;
                const isActive = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(opt.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? mobileIsDark
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-950 text-white'
                        : mobileIsDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                    }`}
                  >
                    {opt.label}{' '}
                    <span className="font-mono tabular-nums opacity-65 ml-0.5">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Open Sculptural Breathing Aperture showing the 3D Silk Manifold on Mobile */}
          <div className="h-24 flex items-end justify-between pb-2 border-b border-current/12">
            <span
              className={`font-mono text-xs tabular-nums ${
                mobileIsDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Chapter {String(mobileIndex + 1).padStart(2, '0')} /{' '}
              {String(entries.length).padStart(2, '0')}
            </span>
            <span
              className="font-mono text-xs tabular-nums"
              style={{ color: mobileKinematics.accentHex }}
            >
              {mobileCityMeta.name}, {mobileCityMeta.country}
            </span>
          </div>

          {/* Rolling Year + Borderless Editorial Copy */}
          {mobileEntry && (
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <YearOdometer
                  year={mobileKinematics.interpolatedYear}
                  accentColor={mobileKinematics.accentHex}
                  className="text-6xl"
                />
                <div className="flex flex-col items-end gap-2 pb-1">
                  <InstitutionLogo
                    src={mobileEntry.logo.src}
                    alt={mobileEntry.organization}
                    width={Math.round(mobileEntry.logo.width * 0.44)}
                    height={Math.round(mobileEntry.logo.height * 0.44)}
                    accentHex={mobileKinematics.accentHex}
                    isDark={mobileIsDark}
                    align="right"
                  />
                  <p className={`font-mono text-xs ${mobileIsDark ? 'text-white' : 'text-slate-950'}`}>
                    {mobileEntry.years}
                  </p>
                </div>
              </div>

              <div
                className="h-px w-24"
                style={{ backgroundColor: mobileKinematics.accentHex }}
              />

              <p
                className={`font-mono text-xs uppercase tracking-wider ${
                  mobileIsDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {mobileEntry.organization}
              </p>

              <h3
                className={`font-display text-2xl font-semibold leading-snug ${
                  mobileIsDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                {mobileEntry.role}
              </h3>

              <p
                className={`text-sm leading-relaxed ${
                  mobileIsDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {mobileEntry.summary}
              </p>

              <p
                className={`pt-2 font-mono text-xs ${
                  mobileIsDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {mobileEntry.highlights.join(' · ')}
              </p>
            </div>
          )}

          {/* Mobile Station Strip + Steppers */}
          <div className="pt-4 border-t border-current/15 flex items-center justify-between gap-3">
            <span
              className={`font-mono text-xs tabular-nums ${
                mobileIsDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {String(mobileIndex + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}{' '}
              · {mobileCityMeta.name}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jumpToMilestone(mobileIndex - 1)}
                disabled={mobileIndex === 0}
                aria-label="Previous milestone"
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border disabled:opacity-30 ${
                  mobileIsDark
                    ? 'border-white/18 text-white'
                    : 'border-slate-900/20 text-slate-950'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpToMilestone(mobileIndex + 1)}
                disabled={mobileIndex >= entries.length - 1}
                aria-label="Next milestone"
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border disabled:opacity-30 ${
                  mobileIsDark
                    ? 'border-white/18 text-white'
                    : 'border-slate-900/20 text-slate-950'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
