/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { ChapterRail } from './components/ChapterRail';
import { ContactSection } from './components/ContactSection';
import { HeroSection } from './components/HeroSection';
import { PublicationsSection } from './components/PublicationsSection';
import { SculpturalFlowCanvas } from './components/SculpturalFlowCanvas';
import { TopNav } from './components/TopNav';
import {
  TrajectorySection,
  type TrajectorySculptureSignal,
} from './components/TrajectorySection';
import { computeFlowSculpturePose, type SculpturePose } from './utils/flowSculpture';
import {
  CHAPTERS,
  computeAtmosphere,
  type AtmosphereState,
  type ChapterId,
  type SectionBound,
} from './utils/scrollChoreography';

const INITIAL_ATMOSPHERE: AtmosphereState = {
  activeChapter: 'hero',
  backgroundCss: 'rgb(9, 11, 16)',
  backgroundRgb: CHAPTERS[0].bg,
  isDarkSurface: true,
  progress: 0,
  weights: { ...CHAPTERS[0].weights },
};

const INITIAL_POSE: SculpturePose = computeFlowSculpturePose(
  'hero',
  INITIAL_ATMOSPHERE.backgroundRgb,
  null,
  'ucl-phd',
  'ucl-phd',
  '#3B82F6',
  '#3B82F6',
);

export default function App() {
  const [atmosphere, setAtmosphere] = useState<AtmosphereState>(INITIAL_ATMOSPHERE);
  const [trajectoryIsDark, setTrajectoryIsDark] = useState(true);

  const atmosphereRef = useRef<AtmosphereState>(INITIAL_ATMOSPHERE);
  const trajectorySignalRef = useRef<TrajectorySculptureSignal | null>(null);
  const sculpturePoseRef = useRef<SculpturePose>(INITIAL_POSE);
  const boundsRef = useRef<SectionBound[]>([]);

  const syncSculpturePose = useCallback(() => {
    const atm = atmosphereRef.current;
    const sig = trajectorySignalRef.current;
    sculpturePoseRef.current = computeFlowSculpturePose(
      atm.activeChapter,
      atm.backgroundRgb,
      sig ? sig.kinematics : null,
      sig ? sig.fromEntryId : 'ucl-phd',
      sig ? sig.toEntryId : 'ucl-phd',
      sig ? sig.fromAccentHex : '#3B82F6',
      sig ? sig.toAccentHex : '#3B82F6',
    );
  }, []);

  const handleTrajectoryStateChange = useCallback(
    (signal: TrajectorySculptureSignal) => {
      trajectorySignalRef.current = signal;
      setTrajectoryIsDark((prev) =>
        prev === signal.kinematics.isDarkSurface ? prev : signal.kinematics.isDarkSurface,
      );
      syncSculpturePose();
    },
    [syncSculpturePose],
  );

  const effectiveIsDarkSurface =
    atmosphere.activeChapter === 'trajectory' ? trajectoryIsDark : atmosphere.isDarkSurface;

  useEffect(() => {
    const measureSections = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
      boundsRef.current = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.dataset.chapter as ChapterId,
          top: rect.top + window.scrollY,
          height: rect.height,
        };
      });
    };

    let scheduled = false;
    const syncAtmosphere = () => {
      scheduled = false;
      const next = computeAtmosphere(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
        boundsRef.current,
      );
      atmosphereRef.current = next;
      syncSculpturePose();
      setAtmosphere((prev) => {
        if (
          prev.activeChapter === next.activeChapter &&
          prev.backgroundCss === next.backgroundCss &&
          prev.isDarkSurface === next.isDarkSurface &&
          Math.abs(prev.progress - next.progress) < 0.004
        ) {
          return prev;
        }
        return next;
      });
    };

    const scheduleSync = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(syncAtmosphere);
      }
    };

    measureSections();
    syncAtmosphere();

    const resizeObserver = new ResizeObserver(() => {
      measureSections();
      scheduleSync();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', measureSections, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', measureSections);
    };
  }, [syncSculpturePose]);

  const shellFallbackBg =
    atmosphere.activeChapter === 'trajectory' && trajectorySignalRef.current
      ? trajectorySignalRef.current.kinematics.backgroundCss
      : atmosphere.backgroundCss;

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-testid="app-shell"
        data-active-chapter={atmosphere.activeChapter}
        data-surface-polarity={effectiveIsDarkSurface ? 'dark' : 'light'}
        className="relative min-h-screen transition-colors duration-200"
        style={{ backgroundColor: shellFallbackBg }}
      >
        <SculpturalFlowCanvas poseRef={sculpturePoseRef} />

        <TopNav
          activeChapter={atmosphere.activeChapter}
          isDarkSurface={effectiveIsDarkSurface}
          progress={atmosphere.progress}
        />

        <ChapterRail
          activeChapter={atmosphere.activeChapter}
          isDarkSurface={effectiveIsDarkSurface}
          progress={atmosphere.progress}
        />

        <main>
          <HeroSection />
          <AboutSection />
          <TrajectorySection onTrajectoryStateChange={handleTrajectoryStateChange} />
          <PublicationsSection />
        </main>

        <ContactSection />
      </div>
    </MotionConfig>
  );
}
