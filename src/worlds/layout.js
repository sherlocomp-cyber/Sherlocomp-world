// Tata letak tetap area bermain PHASE 1 (murni, tanpa Three.js) agar bisa diuji di Node.

export const SPAWN = { x: 0, z: 8 };
export const HUT = { x: 9, z: -8, half: 1.6 };
export const SIGN = { x: 3.5, z: 1 };

export const STAR_POSITIONS = [
  { x: -4, z: -3 },
  { x: 7, z: 3 },
  { x: -12, z: -9 },
  { x: 2, z: -13 },
  { x: -5, z: 13 },
];

/** Lingkaran tabrakan tetap yang tidak dibuat secara acak. */
export const FIXED_COLLIDERS = [
  { id: 'pond', x: -9, z: 6, r: 3.7 },
  { id: 'hut', x: HUT.x, z: HUT.z, r: HUT.half * 1.38 },
  { id: 'sign', x: SIGN.x, z: SIGN.z, r: 0.25 },
];
