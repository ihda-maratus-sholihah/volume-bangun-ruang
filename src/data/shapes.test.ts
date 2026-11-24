import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVolume, getFormulaSteps, pickPi, SHAPES } from './shapes';

test('all 7 shapes are defined with valid defaults', () => {
  assert.equal(SHAPES.length, 7);
});

test('kubus volume calculation', () => {
  assert.equal(calculateVolume('kubus', { s: 5 }), 125);
  assert.equal(calculateVolume('kubus', { s: 8 }), 512);
});

test('balok volume calculation', () => {
  assert.equal(calculateVolume('balok', { p: 12, l: 6, t: 5 }), 360);
});

test('prisma segitiga volume calculation', () => {
  assert.equal(calculateVolume('prisma_segitiga', { a: 6, ta: 4, t: 15 }), 180);
});

test('limas segiempat volume calculation', () => {
  assert.equal(calculateVolume('limas_segiempat', { p: 9, l: 6, t: 10 }), 180);
});

test('tabung and kerucut use 22/7 for multiples of 7 and maintain 3:1 ratio', () => {
  assert.equal(pickPi(7).isFraction, true);
  assert.equal(pickPi(10).isFraction, false);

  const tabungVol = calculateVolume('tabung', { r: 7, t: 12 });
  const kerucutVol = calculateVolume('kerucut', { r: 7, t: 12 });
  assert.equal(tabungVol, 1848);
  assert.equal(kerucutVol, 616);
  assert.equal(tabungVol / kerucutVol, 3);
});

test('bola volume calculation for r=21', () => {
  assert.equal(calculateVolume('bola', { r: 21 }), 38808);
});

test('formula steps return readable Indonesian steps', () => {
  const steps = getFormulaSteps('balok', { p: 4, l: 3, t: 2 });
  assert.equal(steps.length, 3);
  assert.match(steps[2], /24 cm³/);
});
