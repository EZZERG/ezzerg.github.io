export type ChapterId = 'hero' | 'about' | 'trajectory' | 'publications' | 'contact';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ChapterSpec {
  id: ChapterId;
  anchor: string;
  index: string;
  label: string;
  bg: RgbColor;
  isDark: boolean;
  weights: {
    posterior: number;
    flowGrid: number;
    lattice: number;
    harmonics: number;
  };
}

export interface SectionBound {
  id: ChapterId;
  top: number;
  height: number;
}

export interface AtmosphereState {
  activeChapter: ChapterId;
  backgroundCss: string;
  backgroundRgb: RgbColor;
  isDarkSurface: boolean;
  progress: number;
  weights: {
    posterior: number;
    flowGrid: number;
    lattice: number;
    harmonics: number;
  };
}

export const CHAPTERS: ChapterSpec[] = [
  {
    id: 'hero',
    anchor: 'hero',
    index: '01',
    label: 'Introduction',
    bg: { r: 9, g: 11, b: 16 }, // #090B10 Deep Ink Obsidian
    isDark: true,
    weights: { posterior: 1, flowGrid: 0, lattice: 0, harmonics: 0 },
  },
  {
    id: 'about',
    anchor: 'about',
    index: '02',
    label: 'About',
    bg: { r: 246, g: 245, b: 241 }, // #F6F5F1 Warm Archival Ivory
    isDark: false,
    weights: { posterior: 0.12, flowGrid: 0.88, lattice: 0, harmonics: 0 },
  },
  {
    id: 'trajectory',
    anchor: 'background',
    index: '03',
    label: 'Background',
    bg: { r: 11, g: 16, b: 27 }, // #0B101B Architectural Midnight
    isDark: true,
    weights: { posterior: 0, flowGrid: 0.1, lattice: 0.9, harmonics: 0 },
  },
  {
    id: 'publications',
    anchor: 'publications',
    index: '04',
    label: 'Publications',
    bg: { r: 244, g: 245, b: 248 }, // #F4F5F8 Crisp Gallery Paper
    isDark: false,
    weights: { posterior: 0, flowGrid: 0.15, lattice: 0, harmonics: 0.85 },
  },
  {
    id: 'contact',
    anchor: 'contact',
    index: '05',
    label: 'Contact',
    bg: { r: 9, g: 11, b: 16 }, // #090B10 Deep Ink Obsidian
    isDark: true,
    weights: { posterior: 0.7, flowGrid: 0, lattice: 0, harmonics: 0.3 },
  },
];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

export function lerpRgb(a: RgbColor, b: RgbColor, t: number): RgbColor {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

export function relativeLuminance(rgb: RgbColor): number {
  const channels = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Computes the continuous scroll atmosphere based on real section positions.
 * Transitions smoothly across a band centered on each chapter entry boundary.
 */
export function computeAtmosphere(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
  bounds: SectionBound[],
): AtmosphereState {
  const safeDocHeight = Math.max(1, documentHeight - viewportHeight);
  const progress = clamp(scrollY / safeDocHeight, 0, 1);

  if (bounds.length === 0) {
    const fallback = CHAPTERS[0];
    return {
      activeChapter: fallback.id,
      backgroundCss: `rgb(${fallback.bg.r}, ${fallback.bg.g}, ${fallback.bg.b})`,
      backgroundRgb: fallback.bg,
      isDarkSurface: fallback.isDark,
      progress,
      weights: { ...fallback.weights },
    };
  }

  const chapterMap = new Map<ChapterId, ChapterSpec>(CHAPTERS.map((c) => [c.id, c]));
  const orderedBounds = [...bounds].sort((a, b) => a.top - b.top);
  const probeY = scrollY + viewportHeight * 0.42;

  let currentIdx = 0;
  for (let i = 0; i < orderedBounds.length; i++) {
    if (probeY >= orderedBounds[i].top) {
      currentIdx = i;
    }
  }

  const currentBound = orderedBounds[currentIdx];
  const currentSpec = chapterMap.get(currentBound.id) ?? CHAPTERS[0];

  let bg = { ...currentSpec.bg };
  let weights = { ...currentSpec.weights };
  let activeChapter: ChapterId = currentSpec.id;

  const nextBound = orderedBounds[currentIdx + 1];
  if (nextBound) {
    const nextSpec = chapterMap.get(nextBound.id);
    if (nextSpec) {
      const transitionHalfBand = Math.max(110, Math.min(240, viewportHeight * 0.26));
      const startTransition = nextBound.top - transitionHalfBand;
      const endTransition = nextBound.top + transitionHalfBand * 0.45;
      const t = smoothstep(startTransition, endTransition, probeY);

      if (t > 0) {
        bg = lerpRgb(currentSpec.bg, nextSpec.bg, t);
        weights = {
          posterior: lerp(currentSpec.weights.posterior, nextSpec.weights.posterior, t),
          flowGrid: lerp(currentSpec.weights.flowGrid, nextSpec.weights.flowGrid, t),
          lattice: lerp(currentSpec.weights.lattice, nextSpec.weights.lattice, t),
          harmonics: lerp(currentSpec.weights.harmonics, nextSpec.weights.harmonics, t),
        };
        if (t >= 0.5) {
          activeChapter = nextSpec.id;
        }
      }
    }
  }

  const isDarkSurface = relativeLuminance(bg) < 0.25;

  return {
    activeChapter,
    backgroundCss: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
    backgroundRgb: bg,
    isDarkSurface,
    progress,
    weights,
  };
}
