// Matematika kamera orang ketiga (murni; tidak mengimpor Three.js agar bisa diuji di Node).
// Konvensi sama dengan core/movement.js: kamera di belakang pemain pada sudut yaw.

export const CAMERA = {
  distance: 7.5,
  minPitch: 0.1,
  maxPitch: 1.2,
  startPitch: 0.35,
  height: 1.5, // titik yang dilihat kamera, di atas kaki pemain
  minAboveGround: 0.6,
};

export function clampPitch(p) {
  return Math.min(CAMERA.maxPitch, Math.max(CAMERA.minPitch, p));
}

/** Offset kamera dari titik target. */
export function cameraOffset(yaw, pitch, distance = CAMERA.distance) {
  const cp = Math.cos(pitch);
  return {
    x: Math.sin(yaw) * cp * distance,
    y: Math.sin(pitch) * distance,
    z: Math.cos(yaw) * cp * distance,
  };
}

// Penghalang yang cukup besar untuk menutupi pandangan (bangunan, pohon besar, batu besar).
// Tiang pagar, papan, dan jerami (r kecil) tidak menarik kamera.
export const CAMERA_OCCLUDER = { minRadius: 0.7, margin: 0.5, minScale: 0.22 };

/**
 * Seberapa jauh kamera boleh mundur (0.22..1) sebelum menembus penghalang besar.
 * target = titik yang dilihat; off = offset kamera 3D (dari cameraOffset); colliders = lingkaran XZ.
 * Murni (tanpa Three.js). Hasil dipakai: offset * skala.
 */
export function occludeScale(target, off, colliders, opt = CAMERA_OCCLUDER) {
  const dx = off.x;
  const dz = off.z;
  if (dx * dx + dz * dz < 1e-6) return 1; // kamera hampir tegak lurus: tidak ada yang menghalangi
  let best = 1;
  for (const c of colliders) {
    if (c.r < opt.minRadius) continue;
    const R = c.r + opt.margin;
    const px = target.x - c.x;
    const pz = target.z - c.z;
    const a = dx * dx + dz * dz;
    const b = 2 * (px * dx + pz * dz);
    const k = px * px + pz * pz - R * R;
    if (k <= 0) {
      // Target sudah di dalam lingkaran (berdiri menempel). Hanya menarik kamera bila arahnya ke pusat.
      if (b < 0) best = Math.min(best, opt.minScale);
      continue;
    }
    const disc = b * b - 4 * a * k;
    if (disc < 0) continue;
    const t = (-b - Math.sqrt(disc)) / (2 * a); // titik masuk pertama
    if (t > 0 && t < best) best = t;
  }
  return Math.max(opt.minScale, best);
}
