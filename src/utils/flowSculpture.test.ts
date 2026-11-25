import test from 'node:test';
import assert from 'node:assert/strict';
import { TRAJECTORY_ENTRIES } from '../data/portfolioData';
import { computeTrajectoryKinematics } from './trajectoryMotion';
import {
  computeFlowSculpturePose,
  hexToRgb,
  lerpSculpturePose,
  TRAJECTORY_SCULPTURE_PRESETS,
} from './flowSculpture';

test('hexToRgb converts 6-digit hex codes cleanly', () => {
  assert.deepEqual(hexToRgb('#3B82F6'), { r: 59, g: 130, b: 246 });
  assert.deepEqual(hexToRgb('#C2410C'), { r: 194, g: 65, b: 12 });
});

test('computeFlowSculpturePose adapts presence and polarity across Hero, About, and Publications', () => {
  const hero = computeFlowSculpturePose('hero', { r: 9, g: 11, b: 16 }, null, 'ucl-phd', 'ucl-phd', '#3B82F6', '#3B82F6');
  const about = computeFlowSculpturePose('about', { r: 246, g: 245, b: 241 }, null, 'ucl-phd', 'ucl-phd', '#3B82F6', '#3B82F6');
  const pubs = computeFlowSculpturePose('publications', { r: 244, g: 245, b: 248 }, null, 'ucl-phd', 'ucl-phd', '#3B82F6', '#3B82F6');

  assert.equal(hero.isDark, true);
  assert.equal(about.isDark, false);
  assert.equal(pubs.isDark, false);
  assert.ok(pubs.presence < hero.presence, 'Sculpture should recede gently during Publications');
});

test('computeFlowSculpturePose morphs wave frequency, material palette, and camera breathing across Trajectory chapters', () => {
  const totalSegments = TRAJECTORY_ENTRIES.length - 1;
  // Amazon Alexa TTS (index 2) has high acoustic wave frequency; ENS MVA (index 4) flips to sunlit light paper
  const amzState = computeTrajectoryKinematics(2 / totalSegments, TRAJECTORY_ENTRIES);
  const mvaState = computeTrajectoryKinematics(4 / totalSegments, TRAJECTORY_ENTRIES);
  const midState = computeTrajectoryKinematics(2.5 / totalSegments, TRAJECTORY_ENTRIES);

  const amzPose = computeFlowSculpturePose('trajectory', { r: 6, g: 24, b: 29 }, amzState, 'amazon', 'amazon', '#2DD4BF', '#2DD4BF');
  const mvaPose = computeFlowSculpturePose('trajectory', { r: 244, g: 239, b: 230 }, mvaState, 'ens-mva', 'ens-mva', '#C2410C', '#C2410C');
  const midPose = computeFlowSculpturePose('trajectory', { r: 15, g: 19, b: 25 }, midState, 'amazon', 'axa', '#2DD4BF', '#FB7185');

  assert.ok(amzPose.foldFreq > TRAJECTORY_SCULPTURE_PRESETS['ucl-phd'].foldFreq, 'Amazon Speech chapter has denser acoustic folds');
  assert.equal(mvaPose.isDark, false, 'MVA chapter flips to sunlit alabaster light surface');
  assert.ok(mvaPose.surfaceRgb.r > 200, 'MVA sculpture uses bright alabaster material');
  assert.ok(midPose.camZ > amzPose.camZ, 'Camera smoothly breathes back mid-transition');

  const half = lerpSculpturePose(amzPose, mvaPose, 0.5);
  assert.ok(half.foldFreq < amzPose.foldFreq && half.foldFreq > mvaPose.foldFreq);
});
