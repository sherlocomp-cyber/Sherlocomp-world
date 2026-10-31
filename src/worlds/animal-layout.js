// Tata letak ANIMAL KINGDOM (PHASE 2) — murni, tanpa Three.js, agar bisa diuji di Node.
// Kosakata dirujuk hanya lewat ID (src/data/lessons/bab2-hewan.json). Pengelompokan hewan ke
// wilayah adalah rancangan game (USULAN, D-032), bukan isi buku.
// Arah: -Z = utara (arah kamera awal), +X = timur.

export const WORLD = { radius: 100 };
export const SPAWN = { x: 0, z: 8 };
export const HUB = {
  id: 'hub',
  name: 'Gerbang Kerajaan',
  x: 0,
  z: 0,
  r: 14,
  welcome: 'Gerbang Kerajaan Hewan. Pilih jalan setapak ke salah satu wilayah!',
};
export const MONUMENT = { x: 0, z: -1.5, r: 1.3 };
export const HUB_SIGN = { x: 6, z: -4, r: 0.3 };
export const HUB_MESSAGE =
  'Peta Kerajaan Hewan: Padang Savana di utara, Hutan Rimba di barat laut, Padang Peternakan di timur laut, ' +
  'Danau Biru di barat daya, Padang Pasir di tenggara, Taman Burung di selatan.';

export const PLAYER_R = 0.4;

/** Danau: air di bawah WATER_LEVEL sampai jarak ~8,8; penghalang 9,0 menjaga pemain di darat. */
export const LAKE_COLLIDER_R = 9.0;

export const ZONES = [
  {
    id: 'savana', name: 'Padang Savana', x: 0, z: -62, r: 22,
    vocab: ['b2-v03', 'b2-v04', 'b2-v11', 'b2-v13'],
    ground: '#cdb765', ring: 12, landmarkR: 3.2, color: '#e0a93a',
  },
  {
    id: 'hutan', name: 'Hutan Rimba', x: -60, z: -22, r: 22,
    vocab: ['b2-v17', 'b2-v10', 'b2-v15', 'b2-v07', 'b2-v12'],
    ground: '#3f8a45', ring: 12, landmarkR: 1.3, color: '#2f7a3a',
  },
  {
    id: 'peternakan', name: 'Padang Peternakan', x: 58, z: -24, r: 20,
    vocab: ['b2-v19', 'b2-v08', 'b2-v01', 'b2-x02'],
    ground: '#7fcf5f', ring: 10, landmarkR: 3.6, color: '#d2563b', starR: 11.5,
  },
  {
    id: 'danau', name: 'Danau Biru', x: -46, z: 44, r: 22,
    vocab: ['b2-v06', 'b2-v18', 'b2-v21', 'b2-v02'],
    ground: '#7cc66a', ring: 15, landmarkR: LAKE_COLLIDER_R, color: '#3b8fd6',
  },
  {
    id: 'gurun', name: 'Padang Pasir', x: 54, z: 42, r: 20,
    vocab: ['b2-v09', 'b2-v16', 'b2-v14'],
    ground: '#e3cd8e', ring: 11, landmarkR: 3.8, color: '#d9a05a',
  },
  {
    id: 'taman-burung', name: 'Taman Burung', x: 2, z: 72, r: 16,
    vocab: ['b2-v05', 'b2-v20'],
    ground: '#8fd47a', ring: 8.5, landmarkR: 2.4, color: '#b074e0',
  },
];

export const LAKE = { x: ZONES[3].x, z: ZONES[3].z, colliderR: LAKE_COLLIDER_R, waterR: 14 };

const TAU = Math.PI * 2;

/** Sudut dari pusat wilayah menuju gerbang (hub). */
export function entranceAngle(zone) {
  return Math.atan2(HUB.z - zone.z, HUB.x - zone.x);
}

/** Jalan setapak lurus dari tepi tugu di hub sampai tepi landmark tiap wilayah (berhenti sebelum danau/bangunan). */
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

/** Tempat hewan (pedestal). Hewan sungguhan ditempatkan di PHASE 3. */
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

/** Penghalang tetap (bukan acak). Pohon/batu acak ada di animal-plan.js. */
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
