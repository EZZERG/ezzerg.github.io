import { CITIES, type CityKey, type TrajectoryEntry } from '../data/portfolioData';
import { clamp, lerp, lerpRgb, relativeLuminance, smoothstep } from './scrollChoreography';

export interface SpatialTrajectoryState {
  activeIndex: number;
  continuousIndex: number;
  lowerIndex: number;
  upperIndex: number;
  segmentFraction: number;
  activeCity: CityKey;
  fromCity: CityKey;
  toCity: CityKey;
  beaconX: number;
  beaconY: number;
  interpolatedYear: number;
  backgroundCss: string;
  backgroundRgb: [number, number, number];
  isDarkSurface: boolean;
  accentHex: string;
  isCrossingCities: boolean;
  isCrossingChannel: boolean;
}

export interface MapCameraState {
  /** Normalized map center X [0..1] targeted by the camera */
  focusX: number;
  /** Normalized map center Y [0..1] targeted by the camera */
  focusY: number;
  /** Zoom magnification: zooms out smoothly mid-flight between cities, zooms in on arrival */
  zoom: number;
  /** Subtle cartographic bearing shift in degrees */
  bearingDeg: number;
  /** Active geodesic arc reveal [0..1] along the current leg */
  legProgress: number;
}

/**
 * Returns the centered normalized scroll progress [0..1] for a given milestone index
 * when scroll distance is partitioned into strictly equal bands (1/N per milestone).
 */
export function getMilestoneTargetProgress(index: number, total: number): number {
  if (total <= 1) return 0;
  const safeIdx = clamp(Math.round(index), 0, total - 1);
  return clamp((safeIdx + 0.5) / total, 0, 1);
}

/**
 * Pure kinematics for the full-bleed Sculptural Flow Trajectory stage.
 * Partitions normalized vertical scroll progress [0..1] into N strictly equal bands
 * (one per milestone, including first and last) and locks the year odometer to the
 * active milestone's exact start year so scrolling never lingers on misleading
 * intermediate years.
 */
export function computeTrajectoryKinematics(
  progress: number,
  entries: TrajectoryEntry[],
): SpatialTrajectoryState {
  if (entries.length === 0) {
    return {
      activeIndex: 0,
      continuousIndex: 0,
      lowerIndex: 0,
      upperIndex: 0,
      segmentFraction: 0,
      activeCity: 'London',
      fromCity: 'London',
      toCity: 'London',
      beaconX: CITIES.London.mapX,
      beaconY: CITIES.London.mapY,
      interpolatedYear: 2024,
      backgroundCss: 'rgb(8, 13, 26)',
      backgroundRgb: [8, 13, 26],
      isDarkSurface: true,
      accentHex: '#3B82F6',
      isCrossingCities: false,
      isCrossingChannel: false,
    };
  }

  const total = entries.length;
  const maxIdx = Math.max(0, total - 1);
  const clamped = clamp(progress, 0, 1);

  // Strictly equal 1/N scroll slot per entry (first through last)
  const activeIndex = total <= 1 ? 0 : Math.min(maxIdx, Math.floor(clamped * total));
  // Smooth continuous index centered on each equal slot: (i + 0.5)/N -> i
  const continuousIndex = total <= 1 ? 0 : clamp(clamped * total - 0.5, 0, maxIdx);

  const lowerIndex = Math.floor(continuousIndex);
  const upperIndex = Math.min(maxIdx, Math.ceil(continuousIndex));
  const rawFrac = continuousIndex - lowerIndex;
  const easedFrac = smoothstep(0, 1, rawFrac);

  const fromEntry = entries[lowerIndex];
  const toEntry = entries[upperIndex];
  const activeEntry = entries[activeIndex];

  const fromCityMeta = CITIES[fromEntry.city];
  const toCityMeta = CITIES[toEntry.city];

  const fromColor = {
    r: fromEntry.theme.bgRgb[0],
    g: fromEntry.theme.bgRgb[1],
    b: fromEntry.theme.bgRgb[2],
  };
  const toColor = {
    r: toEntry.theme.bgRgb[0],
    g: toEntry.theme.bgRgb[1],
    b: toEntry.theme.bgRgb[2],
  };
  const blended = lerpRgb(fromColor, toColor, easedFrac);
  const bgRgb: [number, number, number] = [blended.r, blended.g, blended.b];
  const isDarkSurface = relativeLuminance(blended) < 0.34;
  const isCrossingCities = fromEntry.city !== toEntry.city;
  const isCrossingChannel = fromCityMeta.country !== toCityMeta.country;

  return {
    activeIndex,
    continuousIndex,
    lowerIndex,
    upperIndex,
    segmentFraction: easedFrac,
    activeCity: activeEntry.city,
    fromCity: fromEntry.city,
    toCity: toEntry.city,
    beaconX: lerp(fromCityMeta.mapX, toCityMeta.mapX, easedFrac),
    beaconY: lerp(fromCityMeta.mapY, toCityMeta.mapY, easedFrac),
    interpolatedYear: activeEntry.displayYear,
    backgroundCss: `rgb(${bgRgb[0]}, ${bgRgb[1]}, ${bgRgb[2]})`,
    backgroundRgb: bgRgb,
    isDarkSurface,
    accentHex: activeEntry.theme.accent,
    isCrossingCities,
    isCrossingChannel,
  };
}

/**
 * Computes the live cinematic camera pan, zoom, and subtle bearing for the
 * UK–English Channel–France vector cartography stage.
 * When traveling between two different cities, the camera smoothly pulls back
 * in altitude mid-flight (sinusoidal zoom dip) so the visitor watches the geodesic
 * arc cross England and the English Channel before zooming cleanly into the destination.
 */
export function computeMapCamera(kinematics: SpatialTrajectoryState): MapCameraState {
  const f = kinematics.segmentFraction;
  // Bell curve peaking at 1.0 at mid-transition (f = 0.5)
  const midFlightAltitude = Math.sin(f * Math.PI);

  const baseZoom = kinematics.activeCity === 'Paris' ? 1.56 : 1.66;
  const pullBack = kinematics.isCrossingChannel
    ? 0.58 * midFlightAltitude
    : kinematics.isCrossingCities
      ? 0.3 * midFlightAltitude
      : 0.08 * midFlightAltitude;

  const zoom = clamp(baseZoom - pullBack, 1.02, 1.8);
  const bearingDeg = kinematics.isCrossingChannel
    ? (kinematics.toCity === 'Paris' ? -3.5 : 3.5) * midFlightAltitude
    : 0;

  return {
    focusX: kinematics.beaconX,
    focusY: kinematics.beaconY,
    zoom,
    bearingDeg,
    legProgress: kinematics.isCrossingCities ? f : 1,
  };
}

/**
 * Extracts four individual decimal digits [0..9] for the mechanical rolling year odometer.
 */
export function getOdometerDigits(year: number): [number, number, number, number] {
  const safe = Math.max(0, Math.min(9999, Math.round(year)));
  const str = String(safe).padStart(4, '0');
  return [Number(str[0]), Number(str[1]), Number(str[2]), Number(str[3])];
}
