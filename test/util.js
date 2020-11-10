/* eslint-disable no-eval */
import chai from 'chai';

import * as util from '../src/util.js';

const { assert } = chai;

describe('util.js', () => {
  describe('random(from, to)', () => {
    const from = -10;
    const to = 10;
    const values = 21;
    const executions = 1000;
    it('should return random integers within the specified range', () => {
      for (let e = 0; e < executions; e += 1) {
        const v = util.random(from, to);
        assert(v >= from);
        assert(v <= to);
      }
    });
    it('should generate all possible values given enough executions', () => {
      const set = new Set();
      for (let e = 0; e < executions; e += 1) {
        set.add(util.random(from, to));
      }
      assert.equal(set.size, values);
    });
    it('should fail with invalid arguments', () => {
      assert.throws(() => util.random(1.1, 2), Error, 'Invalid arguments');
      assert.throws(() => util.random(1, 2.2), Error, 'Invalid arguments');
      assert.throws(() => util.random('1', 2), Error, 'Invalid arguments');
      assert.throws(() => util.random(1, '2'), Error, 'Invalid arguments');
      assert.throws(
        () => util.random(undefined, 2),
        Error,
        'Invalid arguments',
      );
      assert.throws(
        () => util.random(1, undefined),
        Error,
        'Invalid arguments',
      );
    });
  });
  describe('randomColor()', () => {
    const executions = 1000;
    const hex = /#[0-9A-F]{3}/;
    it('should generate valid hex colors (/#[0-9A-F]{3}/)', () => {
      for (let e = 0; e < executions; e += 1) {
        assert(util.randomColor().match(hex));
      }
    });
    it('should generate different hex colors given a small number of executions', () => {
      const set = new Set();
      for (let e = 0; e < executions; e += 1) {
        set.add(util.randomColor().match(hex));
      }
      assert.equal(set.size, executions);
    });
  });
  const conversions = [
    [0, '0'],
    [22.5, 'π / 8'],
    [45, 'π / 4'],
    [90, 'π / 2'],
    [180, 'π'],
    [360, 'π * 2'],
    [720, 'π * 4'],
    [-180, '-π'],
  ];
  describe('toRadians(degrees)', () => {
    for (let v = 0; v < conversions.length; v += 1) {
      const degrees = conversions[v][0];
      const radians = conversions[v][1];
      it(`toRadians(${degrees}) should be equal to ${radians}`, () => {
        assert.equal(
          util.toRadians(degrees),
          eval(radians.replace('π', 'Math.PI')),
        );
      });
    }
    it('should fail with invalid arguments', () => {
      assert.throws(() => util.toRadians('1'), Error, 'Invalid arguments');
      assert.throws(() => util.toRadians(undefined), Error, 'Invalid arguments');
    });
  });
  describe('toDegrees(radians)', () => {
    for (let v = 0; v < conversions.length; v += 1) {
      const degrees = conversions[v][0];
      const radians = conversions[v][1];
      it(`toDegrees(${radians}) should be equal to ${degrees}`, () => {
        assert.equal(
          util.toDegrees(eval(radians.replace('π', 'Math.PI'))),
          degrees,
        );
      });
    }
    it('should fail with invalid arguments', () => {
      assert.throws(() => util.toDegrees('1'), Error, 'Invalid arguments');
      assert.throws(() => util.toDegrees(undefined), Error, 'Invalid arguments');
    });
  });
  describe('adjacent(hypothenuse, degrees)', () => {
    const adjacents = [
      [5, '0', 5],
      [5, 'π / 8', 4.619],
      [5, 'π / 4', 3.535],
      [5, 'π / 2', 0],
      [5, 'π', -5],
      [5, '2 * π', 5],
      [5, '-2 * π', 5],
    ];
    for (let v = 0; v < adjacents.length; v += 1) {
      const hypothenuse = adjacents[v][0];
      const radians = eval(adjacents[v][1].replace('π', 'Math.PI'));
      const adjacent = adjacents[v][2];
      it(`adjacent(${hypothenuse}, ${radians}) should be close to ${adjacent}`, () => {
        assert.closeTo(util.adjacent(hypothenuse, radians), adjacent, 1e-3);
      });
    }
    it('should fail with invalid arguments', () => {
      assert.throws(() => util.adjacent(5, '0'), Error, 'Invalid arguments');
      assert.throws(() => util.adjacent('5', 0), Error, 'Invalid arguments');
      assert.throws(
        () => util.adjacent(5, undefined),
        Error,
        'Invalid arguments',
      );
      assert.throws(
        () => util.adjacent(undefined, 0),
        Error,
        'Invalid arguments',
      );
    });
  });
  const opposites = [
    [5, '0', 0],
    [5, 'π / 8', 1.913],
    [5, 'π / 4', 3.535],
    [5, 'π / 2', 5],
    [5, 'π', 0],
    [5, '2 * π', 0],
    [5, '-2 * π', 0],
  ];
  describe('opposite(hypothenuse, radians)', () => {
    for (let v = 0; v < opposites.length; v += 1) {
      const hypothenuse = opposites[v][0];
      const radians = eval(opposites[v][1].replace('π', 'Math.PI'));
      const opposite = opposites[v][2];
      it(`opposite(${hypothenuse}, ${radians}) should be close to ${opposite}`, () => {
        assert.closeTo(util.opposite(hypothenuse, radians), opposite, 1e-3);
      });
    }
    it('should fail with invalid arguments', () => {
      assert.throws(() => util.opposite(5, '0'), Error, 'Invalid arguments');
      assert.throws(() => util.opposite('5', 0), Error, 'Invalid arguments');
      assert.throws(
        () => util.opposite(5, undefined),
        Error,
        'Invalid arguments',
      );
      assert.throws(
        () => util.opposite(undefined, 0),
        Error,
        'Invalid arguments',
      );
    });
  });
  const coordinates = [
    [0, 100, 0],
    [50, 100, 50],
    [100, 100, 0],
    [200, 100, 0],
    [300, 100, 0],
    [-50, 100, 50],
    [-100, 100, 0],
    [-200, 100, 0],
    [-300, 100, 0],
  ];
  describe('position(coordinates, max)', () => {
    for (let v = 0; v < coordinates.length; v += 1) {
      const coords = coordinates[v][0];
      const max = coordinates[v][1];
      const value = coordinates[v][2];
      it(`position(${coords}, ${max}) should be equal to ${value}`, () => {
        assert.equal(util.position(coords, max), value);
      });
    }
  });
  const collisions = [
    [8, 8, 10, 10, 2, false],
    [9, 9, 10, 10, 2, true],
    [10, 10, 10, 10, 2, true],
    [11, 11, 10, 10, 2, true],
    [12, 12, 10, 10, 2, false],
  ];
  describe('collision(pX, pY, cX, cY, cR)', () => {
    for (let v = 0; v < collisions.length; v += 1) {
      const pX = collisions[v][0];
      const pY = collisions[v][1];
      const cX = collisions[v][2];
      const cY = collisions[v][3];
      const cR = collisions[v][4];
      const value = collisions[v][5];
      it(`collision(${pX}, ${pY}, ${cX}, ${cY}, ${cR}) should be equal to ${value}`, () => {
        assert.equal(util.collision(pX, pY, cX, cY, cR), value);
      });
    }
  });
});
