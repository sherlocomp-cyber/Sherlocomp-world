// Fungsi tinggi medan (murni, tanpa Three.js) — dipakai untuk mesh tanah,
// tinggi pijakan pemain, dan penempatan objek. Area tengah rata agar mudah dimainkan.

import { WORLD_RADIUS } from './config.js';

export const POND = { x: -9, z: 6, radius: 4.2 };
export const WATER_LEVEL = -0.35;

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function heightAt(x, z) {
  const r = Math.hypot(x, z);

  // bukit lembut di luar area tengah
  const hills = Math.sin(x * 0.13) * Math.cos(z * 0.11) * 2.2 + Math.sin(x * 0.05 + z * 0.07) * 3.0;
  const hillMask = smoothstep(14, 28, r);
  let h = hills * hillMask;

  // punggung bukit di tepi dunia (pembatas visual)
  h += Math.max(0, r - (WORLD_RADIUS - 6)) * 0.7;

  // kolam
  const dPond = Math.hypot(x - POND.x, z - POND.z);
  h -= 1.1 * (1 - smoothstep(POND.radius * 0.35, POND.radius + 1.2, dPond));

  return h;
}

export function isWater(x, z) {
  return heightAt(x, z) < WATER_LEVEL;
}
