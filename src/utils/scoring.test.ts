import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAssessmentScore,
  calculateTotalPoints,
  DEFAULT_PROGRESS,
  evaluateBadges,
  getAssessmentPredicate,
  getStudentRank,
} from './scoring';
import { checkCubeLevelMatch, CUBE_LEVELS, sumGridVolume } from './gameLogic';
import { ASSESSMENT_QUESTIONS } from '../data/assessments';

test('assessment dataset has exactly 10 valid questions', () => {
  assert.equal(ASSESSMENT_QUESTIONS.length, 10);
  for (const q of ASSESSMENT_QUESTIONS) {
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
    assert.ok(q.explanation.length >= 2);
  }
});

test('assessment score and predicate thresholds', () => {
  assert.equal(calculateAssessmentScore(10, 10), 100);
  assert.equal(calculateAssessmentScore(7, 10), 70);
  assert.equal(getAssessmentPredicate(90).tone, 'emerald');
  assert.equal(getAssessmentPredicate(80).tone, 'blue');
  assert.equal(getAssessmentPredicate(60).tone, 'amber');
  assert.equal(getAssessmentPredicate(40).tone, 'rose');
});

test('badge evaluation unlocks milestones accurately', () => {
  const badges = evaluateBadges({
    ...DEFAULT_PROGRESS,
    exploredShapes: ['kubus', 'balok', 'prisma_segitiga', 'limas_segiempat', 'tabung', 'kerucut', 'bola'],
    gameScores: { 1: 120, 2: 0, 3: 150, 4: 0, 5: 0 },
    assessmentBestScore: 100,
  });
  assert.ok(badges.includes('penjelajah_3d'));
  assert.ok(badges.includes('arsitek_kubus'));
  assert.ok(badges.includes('penangkap_kilat'));
  assert.ok(badges.includes('lulus_asesmen'));
  assert.ok(badges.includes('bintang_sempurna'));
});

test('total points and student rank progression', () => {
  const pts = calculateTotalPoints({
    ...DEFAULT_PROGRESS,
    gameScores: { 1: 150, 2: 150, 3: 150, 4: 150, 5: 150 },
    assessmentBestScore: 90,
    unlockedBadges: ['penjelajah_3d', 'lulus_asesmen'],
  });
  assert.ok(pts > 1000);
  assert.equal(getStudentRank(pts), 'Grandmaster Geometri');
});

test('cube builder level verification detects exact cuboid match', () => {
  const level1 = CUBE_LEVELS[0]; // 2x2x2
  const validGrid = [
    [2, 2, 0, 0],
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.equal(sumGridVolume(validGrid), 8);
  const res = checkCubeLevelMatch(validGrid, level1);
  assert.equal(res.isExactShape, true);

  const wrongShapeSameVol = [
    [4, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const res2 = checkCubeLevelMatch(wrongShapeSameVol, level1);
  assert.equal(res2.isExactShape, false);
  assert.equal(res2.isVolumeOnly, true);
});
