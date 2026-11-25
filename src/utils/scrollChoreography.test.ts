import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAPTERS,
  computeAtmosphere,
  lerpRgb,
  relativeLuminance,
  smoothstep,
  type SectionBound,
} from './scrollChoreography';

const MOCK_BOUNDS: SectionBound[] = [
  { id: 'hero', top: 0, height: 900 },
  { id: 'about', top: 900, height: 1100 },
  { id: 'trajectory', top: 2000, height: 3400 },
  { id: 'publications', top: 5400, height: 1400 },
  { id: 'contact', top: 6800, height: 700 },
];

test('smoothstep clamps boundaries cleanly', () => {
  assert.equal(smoothstep(0, 100, -20), 0);
  assert.equal(smoothstep(0, 100, 50), 0.5);
  assert.equal(smoothstep(0, 100, 140), 1);
});

test('lerpRgb interpolates dark to light cleanly', () => {
  const mid = lerpRgb({ r: 0, g: 0, b: 0 }, { r: 200, g: 100, b: 50 }, 0.5);
  assert.deepEqual(mid, { r: 100, g: 50, b: 25 });
});

test('relativeLuminance distinguishes dark obsidian from archival ivory', () => {
  assert.ok(relativeLuminance(CHAPTERS[0].bg) < 0.05);
  assert.ok(relativeLuminance(CHAPTERS[1].bg) > 0.85);
});

test('computeAtmosphere alternates dark/light/dark/light/dark across all 5 chapters', () => {
  const hero = computeAtmosphere(0, 900, 7500, MOCK_BOUNDS);
  assert.equal(hero.activeChapter, 'hero');
  assert.equal(hero.isDarkSurface, true);

  const about = computeAtmosphere(1000, 900, 7500, MOCK_BOUNDS);
  assert.equal(about.activeChapter, 'about');
  assert.equal(about.isDarkSurface, false);

  const trajectory = computeAtmosphere(2500, 900, 7500, MOCK_BOUNDS);
  assert.equal(trajectory.activeChapter, 'trajectory');
  assert.equal(trajectory.isDarkSurface, true);

  const publications = computeAtmosphere(5600, 900, 7500, MOCK_BOUNDS);
  assert.equal(publications.activeChapter, 'publications');
  assert.equal(publications.isDarkSurface, false);

  const contact = computeAtmosphere(6600, 900, 7500, MOCK_BOUNDS);
  assert.equal(contact.activeChapter, 'contact');
  assert.equal(contact.isDarkSurface, true);
  assert.equal(contact.progress, 1);
});

test('computeAtmosphere smoothly blends background near section boundary', () => {
  const mid = computeAtmosphere(470, 900, 7500, MOCK_BOUNDS);
  assert.ok(mid.backgroundRgb.r > CHAPTERS[0].bg.r);
  assert.ok(mid.backgroundRgb.r < CHAPTERS[1].bg.r);
});
