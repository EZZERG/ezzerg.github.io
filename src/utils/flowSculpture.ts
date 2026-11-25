import type { ChapterId, RgbColor } from './scrollChoreography';
import { clamp, lerp, lerpRgb, smoothstep } from './scrollChoreography';
import type { SpatialTrajectoryState } from './trajectoryMotion';

export interface SculpturePose {
  /** Base scene background & fog RGB */
  bgRgb: RgbColor;
  /** Primary sculpted silk surface albedo RGB */
  surfaceRgb: RgbColor;
  /** Luminous studio rim & specular accent RGB */
  accentRgb: RgbColor;
  /** Secondary counter-veil tint RGB */
  veilRgb: RgbColor;
  /** True when overall surface is dark (controls lighting exposure & specular contrast) */
  isDark: boolean;
  /** Wave spatial frequency of the sculpted silk folds */
  foldFreq: number;
  /** Vertical undulation amplitude of the manifold */
  amplitude: number;
  /** Helical / diagonal twist of the flow surface */
  twist: number;
  /** Camera position in 3D space */
  camX: number;
  camY: number;
  camZ: number;
  /** Mesh rotation offsets */
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Visibility opacity weight [0.35..1] (recedes subtly during Publications for gallery legibility) */
  presence: number;
}

export interface ChapterSculpturePreset {
  foldFreq: number;
  amplitude: number;
  twist: number;
  camX: number;
  camY: number;
  camZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  surfaceRgb: RgbColor;
  veilRgb: RgbColor;
}

export const TRAJECTORY_SCULPTURE_PRESETS: Record<string, ChapterSculpturePreset> = {
  'ucl-phd': {
    foldFreq: 1.68,
    amplitude: 1.06,
    twist: 0.56,
    camX: -1.15,
    camY: 0.25,
    camZ: 5.42,
    rotX: -0.44,
    rotY: 0.26,
    rotZ: -0.16,
    surfaceRgb: { r: 16, g: 36, b: 86 },
    veilRgb: { r: 28, g: 68, b: 148 },
  },
  fimatix: {
    foldFreq: 1.85,
    amplitude: 0.94,
    twist: 0.66,
    camX: -0.95,
    camY: -0.18,
    camZ: 5.32,
    rotX: -0.56,
    rotY: -0.18,
    rotZ: 0.12,
    surfaceRgb: { r: 36, g: 34, b: 42 },
    veilRgb: { r: 108, g: 76, b: 30 },
  },
  amazon: {
    foldFreq: 2.35,
    amplitude: 1.12,
    twist: 0.48,
    camX: -1.25,
    camY: 0.32,
    camZ: 5.25,
    rotX: -0.38,
    rotY: 0.32,
    rotZ: -0.22,
    surfaceRgb: { r: 12, g: 56, b: 64 },
    veilRgb: { r: 22, g: 112, b: 118 },
  },
  axa: {
    foldFreq: 1.98,
    amplitude: 1.02,
    twist: 0.88,
    camX: -1.05,
    camY: -0.22,
    camZ: 5.4,
    rotX: -0.52,
    rotY: -0.26,
    rotZ: 0.18,
    surfaceRgb: { r: 64, g: 22, b: 48 },
    veilRgb: { r: 132, g: 46, b: 82 },
  },
  'ens-mva': {
    foldFreq: 1.42,
    amplitude: 0.92,
    twist: 0.46,
    camX: -1.18,
    camY: 0.22,
    camZ: 5.45,
    rotX: -0.44,
    rotY: 0.26,
    rotZ: -0.12,
    surfaceRgb: { r: 230, g: 220, b: 204 },
    veilRgb: { r: 218, g: 178, b: 152 },
  },
  ibm: {
    foldFreq: 1.78,
    amplitude: 0.96,
    twist: 0.42,
    camX: -1.08,
    camY: 0.14,
    camZ: 5.36,
    rotX: -0.58,
    rotY: -0.18,
    rotZ: 0.08,
    surfaceRgb: { r: 16, g: 48, b: 96 },
    veilRgb: { r: 34, g: 102, b: 166 },
  },
  cambridge: {
    foldFreq: 1.62,
    amplitude: 1.04,
    twist: 0.74,
    camX: -1.2,
    camY: -0.14,
    camZ: 5.38,
    rotX: -0.42,
    rotY: 0.3,
    rotZ: -0.18,
    surfaceRgb: { r: 16, g: 58, b: 44 },
    veilRgb: { r: 104, g: 90, b: 30 },
  },
  centrale: {
    foldFreq: 1.38,
    amplitude: 0.88,
    twist: 0.38,
    camX: -1.1,
    camY: 0.2,
    camZ: 5.52,
    rotX: -0.48,
    rotY: 0.18,
    rotZ: -0.08,
    surfaceRgb: { r: 220, g: 214, b: 202 },
    veilRgb: { r: 176, g: 188, b: 216 },
  },
};

export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 59, g: 130, b: 246 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

const SECTION_POSES: Record<Exclude<ChapterId, 'trajectory'>, SculpturePose> = {
  hero: {
    bgRgb: { r: 9, g: 11, b: 16 },
    surfaceRgb: { r: 20, g: 44, b: 96 },
    accentRgb: { r: 59, g: 130, b: 246 },
    veilRgb: { r: 38, g: 82, b: 168 },
    isDark: true,
    foldFreq: 1.62,
    amplitude: 1.06,
    twist: 0.52,
    camX: -0.55,
    camY: 0.22,
    camZ: 5.25,
    rotX: -0.42,
    rotY: 0.26,
    rotZ: -0.15,
    presence: 1,
  },
  about: {
    bgRgb: { r: 246, g: 245, b: 241 },
    surfaceRgb: { r: 232, g: 228, b: 220 },
    accentRgb: { r: 37, g: 99, b: 235 },
    veilRgb: { r: 212, g: 220, b: 236 },
    isDark: false,
    foldFreq: 1.18,
    amplitude: 0.82,
    twist: 0.32,
    camX: 0.65,
    camY: -0.12,
    camZ: 6.05,
    rotX: -0.54,
    rotY: -0.16,
    rotZ: 0.1,
    presence: 0.84,
  },
  publications: {
    bgRgb: { r: 244, g: 245, b: 248 },
    surfaceRgb: { r: 234, g: 238, b: 244 },
    accentRgb: { r: 37, g: 99, b: 235 },
    veilRgb: { r: 216, g: 224, b: 238 },
    isDark: false,
    foldFreq: 0.92,
    amplitude: 0.54,
    twist: 0.2,
    camX: 0.2,
    camY: 0.55,
    camZ: 6.75,
    rotX: -0.68,
    rotY: 0.08,
    rotZ: -0.05,
    presence: 0.48,
  },
  contact: {
    bgRgb: { r: 9, g: 11, b: 16 },
    surfaceRgb: { r: 20, g: 36, b: 78 },
    accentRgb: { r: 96, g: 165, b: 250 },
    veilRgb: { r: 38, g: 72, b: 146 },
    isDark: true,
    foldFreq: 1.05,
    amplitude: 0.86,
    twist: 0.28,
    camX: -0.75,
    camY: 0.1,
    camZ: 5.85,
    rotX: -0.4,
    rotY: 0.18,
    rotZ: -0.1,
    presence: 0.95,
  },
};

export function lerpSculpturePose(a: SculpturePose, b: SculpturePose, t: number): SculpturePose {
  const k = clamp(t, 0, 1);
  return {
    bgRgb: lerpRgb(a.bgRgb, b.bgRgb, k),
    surfaceRgb: lerpRgb(a.surfaceRgb, b.surfaceRgb, k),
    accentRgb: lerpRgb(a.accentRgb, b.accentRgb, k),
    veilRgb: lerpRgb(a.veilRgb, b.veilRgb, k),
    isDark: k < 0.5 ? a.isDark : b.isDark,
    foldFreq: lerp(a.foldFreq, b.foldFreq, k),
    amplitude: lerp(a.amplitude, b.amplitude, k),
    twist: lerp(a.twist, b.twist, k),
    camX: lerp(a.camX, b.camX, k),
    camY: lerp(a.camY, b.camY, k),
    camZ: lerp(a.camZ, b.camZ, k),
    rotX: lerp(a.rotX, b.rotX, k),
    rotY: lerp(a.rotY, b.rotY, k),
    rotZ: lerp(a.rotZ, b.rotZ, k),
    presence: lerp(a.presence, b.presence, k),
  };
}

/**
 * Computes the target 3D Sculptural Flow pose for any point in the page scroll,
 * blending smoothly between sections and across all 8 distinct Trajectory chapters.
 */
export function computeFlowSculpturePose(
  activeChapter: ChapterId,
  pageBgRgb: RgbColor,
  trajectoryState: SpatialTrajectoryState | null,
  fromEntryId: string,
  toEntryId: string,
  fromAccentHex: string,
  toAccentHex: string,
): SculpturePose {
  if (activeChapter !== 'trajectory' || !trajectoryState) {
    const base = SECTION_POSES[activeChapter === 'trajectory' ? 'hero' : activeChapter];
    return {
      ...base,
      bgRgb: activeChapter === 'contact' ? base.bgRgb : pageBgRgb,
    };
  }

  const fromPreset = TRAJECTORY_SCULPTURE_PRESETS[fromEntryId] ?? TRAJECTORY_SCULPTURE_PRESETS['ucl-phd'];
  const toPreset = TRAJECTORY_SCULPTURE_PRESETS[toEntryId] ?? fromPreset;
  const f = smoothstep(0, 1, trajectoryState.segmentFraction);

  // Subtle camera pullback breathe mid-transition between milestones
  const midDip = Math.sin(f * Math.PI) * 0.42;

  return {
    bgRgb: {
      r: trajectoryState.backgroundRgb[0],
      g: trajectoryState.backgroundRgb[1],
      b: trajectoryState.backgroundRgb[2],
    },
    surfaceRgb: lerpRgb(fromPreset.surfaceRgb, toPreset.surfaceRgb, f),
    accentRgb: lerpRgb(hexToRgb(fromAccentHex), hexToRgb(toAccentHex), f),
    veilRgb: lerpRgb(fromPreset.veilRgb, toPreset.veilRgb, f),
    isDark: trajectoryState.isDarkSurface,
    foldFreq: lerp(fromPreset.foldFreq, toPreset.foldFreq, f),
    amplitude: lerp(fromPreset.amplitude, toPreset.amplitude, f),
    twist: lerp(fromPreset.twist, toPreset.twist, f),
    camX: lerp(fromPreset.camX, toPreset.camX, f),
    camY: lerp(fromPreset.camY, toPreset.camY, f),
    camZ: lerp(fromPreset.camZ, toPreset.camZ, f) + midDip,
    rotX: lerp(fromPreset.rotX, toPreset.rotX, f),
    rotY: lerp(fromPreset.rotY, toPreset.rotY, f),
    rotZ: lerp(fromPreset.rotZ, toPreset.rotZ, f),
    presence: 1,
  };
}
