import test from 'node:test';
import assert from 'node:assert/strict';
import { CITIES, TRAJECTORY_ENTRIES } from '../data/portfolioData';
import {
  computeMapCamera,
  computeTrajectoryKinematics,
  getMilestoneTargetProgress,
  getOdometerDigits,
} from './trajectoryMotion';

test('computeTrajectoryKinematics maps start and end progress with chromatic polarity flips', () => {
  const start = computeTrajectoryKinematics(0, TRAJECTORY_ENTRIES);
  assert.equal(start.activeIndex, 0);
  assert.equal(start.activeCity, 'London');
  assert.equal(start.interpolatedYear, 2024);
  assert.equal(start.beaconX, CITIES.London.mapX);
  assert.equal(start.isDarkSurface, true);

  // Entry 4 is ENS Paris-Saclay MVA (Archival Vellum light flip)
  const mvaProgress = getMilestoneTargetProgress(4, TRAJECTORY_ENTRIES.length);
  const mva = computeTrajectoryKinematics(mvaProgress, TRAJECTORY_ENTRIES);
  assert.equal(mva.activeIndex, 4);
  assert.equal(mva.activeCity, 'Paris');
  assert.equal(mva.isDarkSurface, false);
  assert.equal(mva.interpolatedYear, 2016);

  // Final entry is CentraleSupélec (Paris, Limestone light flip)
  const end = computeTrajectoryKinematics(1, TRAJECTORY_ENTRIES);
  assert.equal(end.activeIndex, TRAJECTORY_ENTRIES.length - 1);
  assert.equal(end.activeCity, 'Paris');
  assert.equal(end.interpolatedYear, 2014);
  assert.equal(end.isDarkSurface, false);
});

test('every milestone receives equal scroll distance and never shows misleading intermediate years', () => {
  const n = TRAJECTORY_ENTRIES.length;
  const counts = Array.from({ length: n }, () => 0);
  const samples = 800;

  for (let s = 0; s < samples; s++) {
    const p = (s + 0.5) / samples;
    const state = computeTrajectoryKinematics(p, TRAJECTORY_ENTRIES);
    counts[state.activeIndex] += 1;

    // Year odometer must strictly match the active entry's start year — never an intermediate year like 2021
    assert.equal(state.interpolatedYear, TRAJECTORY_ENTRIES[state.activeIndex].displayYear);
  }

  for (let i = 0; i < n; i++) {
    assert.equal(
      counts[i],
      samples / n,
      `Milestone ${i} (${TRAJECTORY_ENTRIES[i].monogram}) should occupy an equal 1/${n} scroll band`,
    );
  }

  // Specifically check scrolling across Fimatix (2024) -> Amazon (2018): never emits 2019..2023
  for (let p = 1 / n; p < 3 / n; p += 0.005) {
    const state = computeTrajectoryKinematics(p, TRAJECTORY_ENTRIES);
    assert.ok(
      state.interpolatedYear === 2024 || state.interpolatedYear === 2018,
      `Unexpected intermediate year ${state.interpolatedYear} at progress ${p}`,
    );
  }
});

test('computeMapCamera pulls back altitude mid-flight when crossing the English Channel', () => {
  const total = TRAJECTORY_ENTRIES.length;
  // Entry 2 is Amazon (Cambridge, UK), Entry 3 is AXA (Paris, France)
  const atAmazon = computeTrajectoryKinematics(getMilestoneTargetProgress(2, total), TRAJECTORY_ENTRIES);
  const midChannel = computeTrajectoryKinematics(3 / total, TRAJECTORY_ENTRIES);
  const atAxa = computeTrajectoryKinematics(getMilestoneTargetProgress(3, total), TRAJECTORY_ENTRIES);

  const camStart = computeMapCamera(atAmazon);
  const camMid = computeMapCamera(midChannel);
  const camEnd = computeMapCamera(atAxa);

  assert.equal(midChannel.isCrossingChannel, true);
  assert.ok(camMid.zoom < camStart.zoom - 0.35, 'Camera should pull back mid-flight across the Channel');
  assert.ok(camMid.zoom < camEnd.zoom - 0.35, 'Camera should zoom back in upon arriving in Paris');
  assert.ok(camMid.legProgress > 0.45 && camMid.legProgress < 0.55);
});

test('getOdometerDigits splits years accurately into four single-digit drums', () => {
  assert.deepEqual(getOdometerDigits(2024), [2, 0, 2, 4]);
  assert.deepEqual(getOdometerDigits(2018), [2, 0, 1, 8]);
  assert.deepEqual(getOdometerDigits(2014), [2, 0, 1, 4]);
});
