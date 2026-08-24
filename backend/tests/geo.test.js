const test = require("node:test");
const assert = require("node:assert");
const { haversineDistanceKm } = require("../src/utils/geo");

test("same point is zero distance", () => {
  const distance = haversineDistanceKm(30.35, 76.36, 30.35, 76.36);
  assert.ok(distance < 0.0001);
});

test("one degree of latitude is about 111km, the standard reference figure", () => {
  const distance = haversineDistanceKm(0, 0, 1, 0);
  assert.ok(Math.abs(distance - 111.19) < 1.2);
});

test("distance is symmetric", () => {
  const a = haversineDistanceKm(30.35, 76.36, 30.34, 76.39);
  const b = haversineDistanceKm(30.34, 76.39, 30.35, 76.36);
  assert.strictEqual(a, b);
});

test("farther points give a larger distance", () => {
  const near = haversineDistanceKm(30.35, 76.36, 30.351, 76.361);
  const far = haversineDistanceKm(30.35, 76.36, 30.4, 76.4);
  assert.ok(far > near);
});
