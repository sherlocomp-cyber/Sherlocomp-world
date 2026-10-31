// Tata letak SICKNESS KINGDOM "Kota Sehat" (PHASE 2 tahap B) — murni, tanpa Three.js, agar bisa diuji di Node.
// Kosakata dirujuk hanya lewat ID (src/data/lessons/bab3-penyakit.json). Pengelompokan 14 kosakata inti ke
// wilayah adalah rancangan game (USULAN, D-038), bukan isi buku.
// Arah: -Z = utara (arah kamera awal), +X = timur. Strukturnya sengaja sejajar animal-layout.js.

export const WORLD = { radius: 100 };
export const SPAWN = { x: 0, z: 8 };
export const HUB = {
  id: 'hub',
  name: 'Gerbang Kota Sehat',
  x: 0,
  z: 0,
  r: 14,
  welcome: 'Gerbang Kota Sehat. Pilih jalan setapak ke salah satu tempat!',
};
export const MONUMENT = { x: 0, z: -1.5, r: 1.3 };
export const HUB_SIGN = { x: 6, z: -4, r: 0.3 };
export const HUB_MESSAGE =
  'Peta Kota Sehat: Rumah Sakit di utara, Apotek di timur laut, Taman Kepala di barat laut, ' +
  'Taman Perut di barat daya, Taman Flu dan Demam di tenggara.';

export const PLAYER_R = 0.4;

export const ZONES = [
  {
    id: 'rumah-sakit', name: 'Rumah Sakit', x: 0, z: -60, r: 22,
    vocab: ['b3-v13', 'b3-v11', 'b3-v12'], // rumah sakit, dokter, perawat
    ground: '#cfe8dc', ring: 13, landmarkR: 6.0, color: '#2fae8f', starR: 17.5,
  },
  {
    id: 'apotek', name: 'Apotek', x: 58, z: -22, r: 20,
    vocab: ['b3-v14', 'b3-v09', 'b3-v10'], // apotek, resep, obat
    ground: '#bfe3a8', ring: 11, landmarkR: 4.5, color: '#3fae6a', starR: 15,
  },
  {
    id: 'taman-kepala', name: 'Taman Kepala', x: -58, z: -20, r: 20,
    vocab: ['b3-v02', 'b3-v08', 'b3-v07'], // sakit kepala, sakit mata, sakit gigi
    ground: '#a9dc8c', ring: 9, landmarkR: 2.4, color: '#e0a93a', starR: 14,
  },
  {
    id: 'taman-perut', name: 'Taman Perut', x: -38, z: 50, r: 20,
    vocab: ['b3-v06', 'b3-v01'], // sakit perut, diare
    ground: '#b8e0a0', ring: 8.5, landmarkR: 2.8, color: '#e08a4a', starR: 13,
  },
  {
    id: 'taman-flu', name: 'Taman Flu dan Demam', x: 40, z: 48, r: 20,
    vocab: ['b3-v03', 'b3-v04', 'b3-v05'], // batuk, flu, demam
    ground: '#c6e8b2', ring: 10, landmarkR: 3.6, color: '#3b8fd6', starR: 15,
  },
];

const TAU = Math.PI * 2;

/** Sudut dari pusat wilayah menuju gerbang (hub). */
export function entranceAngle(zone) {
  return Math.atan2(HUB.z - zone.z, HUB.x - zone.x);
}

/** Jalan setapak lurus dari tepi tugu di hub sampai tepi landmark tiap wilayah. */
export const PATHS = ZONES.map((z) => {
  const e = entranceAngle(z);
  const stop = z.landmarkR + 1.5;
  const bx = z.x + Math.cos(e) * stop;
  const bz = z.z + Math.sin(e) * stop;
  const a = Math.atan2(bz - HUB.z, bx - HUB.x);
  return { id: z.id, ax: HUB.x + Math.cos(a) * 4.5, az: HUB.z + Math.sin(a) * 4.5, bx, bz };
});

export function distToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}

export function distToPath(x, z) {
  let best = Infinity;
  for (const p of PATHS) best = Math.min(best, distToSegment(x, z, p.ax, p.az, p.bx, p.bz));
  return best;
}

function polar(zone, angle, radius) {
  return { x: zone.x + Math.cos(angle) * radius, z: zone.z + Math.sin(angle) * radius };
}

/** Tempat kata (pedestal). Gambar kosakata dipasang di atasnya; tokoh dan animasi = PHASE 3. */
export const STATIONS = ZONES.flatMap((zone) => {
  const e = entranceAngle(zone);
  const n = zone.vocab.length;
  return zone.vocab.map((vocabId, k) => ({
    vocabId,
    zoneId: zone.id,
    ...polar(zone, e + ((k + 0.5) * TAU) / n, zone.ring),
    r: 0.6,
  }));
});

/** Papan wilayah: di sisi jalan masuk, bergeser ke samping agar jalur tidak tertutup. */
export const ZONE_SIGNS = ZONES.map((zone) => {
  const e = entranceAngle(zone);
  const base = polar(zone, e, zone.r * 0.75);
  return { zoneId: zone.id, x: base.x - Math.sin(e) * 2.8, z: base.z + Math.cos(e) * 2.8, r: 0.3, ry: -e + Math.PI / 2 };
});

/** Satu bintang per wilayah, di belakang landmark (sisi berlawanan gerbang). */
export const STAR_POSITIONS = ZONES.map((zone) => polar(zone, entranceAngle(zone) + Math.PI, zone.starR ?? zone.r * 0.72));

export const LANDMARKS = ZONES.map((z) => ({ id: 'landmark-' + z.id, zoneId: z.id, x: z.x, z: z.z, r: z.landmarkR }));

/** Penghalang tetap (bukan acak). Pohon/bangku/lampu acak ada di sickness-plan.js. */
export const FIXED_COLLIDERS = [
  { id: 'monument', x: MONUMENT.x, z: MONUMENT.z, r: MONUMENT.r },
  { id: 'hub-sign', x: HUB_SIGN.x, z: HUB_SIGN.z, r: HUB_SIGN.r },
  ...LANDMARKS.map((l) => ({ id: l.id, x: l.x, z: l.z, r: l.r })),
  ...ZONE_SIGNS.map((s) => ({ id: 'sign-' + s.zoneId, x: s.x, z: s.z, r: s.r })),
  ...STATIONS.map((s) => ({ id: 'station-' + s.vocabId, x: s.x, z: s.z, r: s.r })),
];

/** Wilayah tempat titik berada: wilayah, hub, atau null (jalan/tepi). */
export function zoneAt(x, z) {
  let best = null;
  let bestD = Infinity;
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.x, z - zone.z);
    if (d < zone.r && d < bestD) {
      best = { id: zone.id, name: zone.name, welcome: `Selamat datang di ${zone.name}!` };
      bestD = d;
    }
  }
  if (best) return best;
  if (Math.hypot(x - HUB.x, z - HUB.z) < HUB.r) return { id: HUB.id, name: HUB.name, welcome: HUB.welcome };
  return null;
}
