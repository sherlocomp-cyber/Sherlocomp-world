// Tinggi medan SICKNESS KINGDOM (murni). Hub, wilayah, dan jalan setapak dibuat rata agar mudah
// dimainkan; perbukitan hanya di antaranya; punggung gunung di tepi dunia. Tanpa air.

import { WORLD, HUB, ZONES, distToPath } from '../worlds/sickness-layout.js';

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function heightAt(x, z) {
  const r = Math.hypot(x, z);
  const hills = Math.sin(x * 0.06) * Math.cos(z * 0.062) * 2.2 + Math.sin(x * 0.03 + z * 0.034) * 3.0;

  // bobot rata: 1 di hub / wilayah / jalan setapak, turun halus di sekitarnya
  let w = 1 - smoothstep(HUB.r, HUB.r + 10, r);
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.x, z - zone.z);
    w = Math.max(w, 1 - smoothstep(zone.r * 0.9, zone.r * 0.9 + 12, d));
  }
  w = Math.max(w, 1 - smoothstep(3, 10, distToPath(x, z)));

  let h = hills * smoothstep(16, 44, r) * (1 - w);
  h += Math.max(0, r - (WORLD.radius - 8)) * 0.8; // punggung gunung pembatas
  return h;
}

/** Sickness Kingdom tidak punya air; disediakan agar antarmukanya sama dengan terrain-animal.js. */
export function isWater() {
  return false;
}
