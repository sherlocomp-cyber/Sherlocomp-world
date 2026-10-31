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
