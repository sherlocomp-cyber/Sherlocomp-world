// Tinggi medan ANIMAL KINGDOM (murni). Hub, wilayah, dan jalan setapak dibuat rata agar mudah
// dimainkan; perbukitan hanya di antaranya; punggung gunung di tepi dunia; danau di Danau Biru.

import { WORLD, HUB, ZONES, LAKE, distToPath } from '../worlds/animal-layout.js';

export const WATER_LEVEL = -0.35;

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function heightAt(x, z) {
  const r = Math.hypot(x, z);
  const hills = Math.sin(x * 0.065) * Math.cos(z * 0.058) * 2.4 + Math.sin(x * 0.028 + z * 0.036) * 3.2;

  // bobot rata: 1 di hub / wilayah / jalan setapak, turun halus di sekitarnya
  let w = 1 - smoothstep(HUB.r, HUB.r + 10, r);
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.x, z - zone.z);
    w = Math.max(w, 1 - smoothstep(zone.r * 0.9, zone.r * 0.9 + 12, d));
  }
  w = Math.max(w, 1 - smoothstep(3, 10, distToPath(x, z)));

  let h = hills * smoothstep(16, 44, r) * (1 - w);
  h += Math.max(0, r - (WORLD.radius - 8)) * 0.8; // punggung gunung pembatas

  const dl = Math.hypot(x - LAKE.x, z - LAKE.z);
  h -= 1.5 * (1 - smoothstep(3, 11.5, dl)); // cekungan danau
  return h;
}

export function isWater(x, z) {
  return heightAt(x, z) < WATER_LEVEL;
}
