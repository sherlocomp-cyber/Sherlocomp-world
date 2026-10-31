// Tabrakan lingkaran 2D (bidang XZ), murni dan bisa diuji di Node.

import { WORLD_RADIUS } from './config.js';

/** Dorong titik (pos.x, pos.z) keluar dari semua lingkaran. Mengubah `pos` langsung. */
export function resolveColliders(pos, radius, colliders) {
  for (let pass = 0; pass < 2; pass++) {
    for (const c of colliders) {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const min = c.r + radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min) {
        const d = Math.sqrt(d2) || 0.0001;
        const push = (min - d) / d;
        pos.x += dx * push;
        pos.z += dz * push;
      }
    }
  }
  return pos;
}

/** Jaga pemain di dalam lingkaran dunia. */
export function clampToWorld(pos, radius, worldRadius = WORLD_RADIUS) {
  const limit = worldRadius - radius;
  const d = Math.hypot(pos.x, pos.z);
  if (d > limit) {
    const k = limit / d;
    pos.x *= k;
    pos.z *= k;
  }
  return pos;
}
