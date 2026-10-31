// Matematika gerak (murni). Konvensi:
//  - kamera berada di belakang pemain pada sudut `yaw`:
//      posisiKamera = target + (sin(yaw), ., cos(yaw)) * jarak
//  - "maju" di layar = arah kamera -> target = (-sin(yaw), -cos(yaw))
//  - model karakter menghadap sumbu +Z saat rotation.y = 0

/** Ubah masukan (mx kanan+, my maju+) menjadi arah dunia (x, z). */
export function moveDirection(yaw, mx, my) {
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);
  return { x: fx * my + rx * mx, z: fz * my + rz * mx };
}

/** Interpolasi sudut lewat jalur terpendek. */
export function lerpAngle(a, b, t) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * Math.min(1, Math.max(0, t));
}

/** Vektor joystick dari selisih piksel; normal ke lingkaran satuan, dengan zona mati. */
export function joystickVector(dx, dy, radius, deadzone = 0.12) {
  const len = Math.hypot(dx, dy);
  if (len === 0) return { x: 0, y: 0 };
  const m = Math.min(1, len / radius);
  if (m < deadzone) return { x: 0, y: 0 };
  const scaled = (m - deadzone) / (1 - deadzone);
  return { x: (dx / len) * scaled, y: (-dy / len) * scaled }; // y layar ke bawah -> maju = +
}
