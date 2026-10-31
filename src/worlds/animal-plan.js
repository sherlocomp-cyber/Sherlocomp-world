// Rencana dekorasi ANIMAL KINGDOM (murni, deterministik, tanpa Three.js).
// Menghasilkan data posisi/ukuran/warna untuk InstancedMesh + lingkaran tabrakan, sehingga bisa
// diuji di Node (jalur setapak bebas, tidak di air, tidak menumpuk landmark).

import { ZONES, HUB, LAKE, MONUMENT, STATIONS, ZONE_SIGNS, STAR_POSITIONS, LANDMARKS, HUB_SIGN, entranceAngle, distToPath } from './animal-layout.js';
import { isWater } from '../core/terrain-animal.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PATH_CLEAR = 3.4; // jarak minimum dekor berkolisi dari garis tengah jalan setapak
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length) % arr.length];

export function buildPlan(seed = 20261101) {
  const rng = mulberry32(seed);
  const colliders = [];
  const items = {
    trunk: [], crown: [], canopy: [], rock: [], tuft: [], reed: [], flower: [],
    cactus: [], arm: [], post: [], rail: [], hay: [], bush: [],
  };

  // lingkaran yang tidak boleh ditimpa dekor
  const taken = [
    { x: MONUMENT.x, z: MONUMENT.z, r: 3 },
    { x: HUB_SIGN.x, z: HUB_SIGN.z, r: 2 },
    ...LANDMARKS.map((l) => ({ x: l.x, z: l.z, r: l.r + 1.5 })),
    ...STATIONS.map((s) => ({ x: s.x, z: s.z, r: 2.2 })),
    ...ZONE_SIGNS.map((s) => ({ x: s.x, z: s.z, r: 2 })),
    ...STAR_POSITIONS.map((s) => ({ x: s.x, z: s.z, r: 1.8 })),
    { x: 0, z: 8, r: 3 }, // titik awal
  ];

  function free(x, z, clearance, corridor) {
    if (isWater(x, z)) return false;
    if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.colliderR + 1.2 + clearance) return false;
    if (distToPath(x, z) < corridor + clearance) return false;
    return taken.every((t) => Math.hypot(t.x - x, t.z - z) > t.r + clearance);
  }

  /** Titik acak di cakram wilayah; `solid` = berkolisi (dijaga jauh dari jalan), selain itu hanya hiasan. */
  function scatter(zone, n, { clearance = 1, minR = 0.12, maxR = 0.95, solid = true } = {}) {
    const out = [];
    for (let i = 0; i < n; i++) {
      for (let tries = 0; tries < 40; tries++) {
        const a = rng() * Math.PI * 2;
        const r = zone.r * (minR + rng() * (maxR - minR));
        const x = zone.x + Math.cos(a) * r;
        const z = zone.z + Math.sin(a) * r;
        if (free(x, z, clearance, solid ? PATH_CLEAR : 1.6)) {
          taken.push({ x, z, r: clearance });
          out.push({ x, z });
          break;
        }
      }
    }
    return out;
  }

  const byId = Object.fromEntries(ZONES.map((z) => [z.id, z]));
  const solidTree = (p, h, crownS, crownC, trunkC = '#7a5232', crownScaleY = 1.2) => {
    items.trunk.push({ x: p.x, z: p.z, sx: 1, sy: h, sz: 1, c: trunkC });
    items.crown.push({ x: p.x, z: p.z, oy: h + 0.55 * crownS, sx: crownS, sy: crownS * crownScaleY, sz: crownS, ry: rng() * 3, c: crownC });
    colliders.push({ x: p.x, z: p.z, r: 0.45 });
  };

  // ---- Padang Savana: akasia, rumput kering, batu
  {
    const z = byId.savana;
    for (const p of scatter(z, 14, { clearance: 3 })) {
      const h = 2.8 + rng() * 1.2;
      items.trunk.push({ x: p.x, z: p.z, sx: 0.8, sy: h, sz: 0.8, c: '#6b4a2a' });
      items.canopy.push({ x: p.x, z: p.z, oy: h + 0.1, sx: 2.3 + rng() * 0.7, sy: 0.55, sz: 2.3 + rng() * 0.7, ry: rng() * 3, c: '#6e9b3c' });
      colliders.push({ x: p.x, z: p.z, r: 0.4 });
    }
    for (const p of scatter(z, 100, { clearance: 0.3, solid: false, maxR: 1.15 })) {
      items.tuft.push({ x: p.x, z: p.z, sx: 1, sy: 0.8 + rng() * 0.8, sz: 1, ry: rng() * 3, c: pick(rng, ['#c9b34e', '#b8a444', '#d6c36a']) });
    }
    for (const p of scatter(z, 10, { clearance: 1.2 })) {
      const s = 0.5 + rng() * 0.8;
      items.rock.push({ x: p.x, z: p.z, oy: s * 0.35, sx: s, sy: s * 0.7, sz: s, rx: rng() * 3, ry: rng() * 3, rz: rng() * 3, c: '#a39a8a' });
      colliders.push({ x: p.x, z: p.z, r: s * 0.85 });
    }
  }

  // ---- Hutan Rimba: pohon rapat, semak
  {
    const z = byId.hutan;
    for (const p of scatter(z, 46, { clearance: 2.0 })) {
      solidTree(p, 3 + rng() * 1.6, 1.4 + rng() * 0.7, pick(rng, ['#2f7a3a', '#2a6a35', '#3a8a40']), '#6a4528', 1.3);
    }
    for (const p of scatter(z, 36, { clearance: 0.8, solid: false, maxR: 1.1 })) {
      const s = 0.45 + rng() * 0.4;
      items.bush.push({ x: p.x, z: p.z, oy: s * 0.5, sx: s, sy: s * 0.8, sz: s, ry: rng() * 3, c: pick(rng, ['#3f8f45', '#357c3c']) });
    }
  }

  // ---- Padang Peternakan: pagar melingkar dengan celah di gerbang, jerami, bunga
  {
    const z = byId.peternakan;
    const e = entranceAngle(z);
    const fenceR = 15;
    const step = 1.5 / fenceR; // sudut per tiang (≈1,5 satuan)
    const n = Math.floor((Math.PI * 2) / step);
    const gap = 0.42; // setengah lebar celah (radian) di sisi gerbang
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const ang = Math.abs(Math.atan2(Math.sin(a - e), Math.cos(a - e)));
      if (ang < gap) continue;
      const x = z.x + Math.cos(a) * fenceR;
      const zz = z.z + Math.sin(a) * fenceR;
      if (distToPath(x, zz) < 2.4) continue;
      items.post.push({ x, z: zz, sx: 1, sy: 1, sz: 1, c: '#8a5f38' });
      colliders.push({ x, z: zz, r: 0.22 });
      const a2 = a + step / 2;
      if (Math.abs(Math.atan2(Math.sin(a2 - e), Math.cos(a2 - e))) >= gap) {
        items.rail.push({
          x: z.x + Math.cos(a2) * fenceR, z: z.z + Math.sin(a2) * fenceR, oy: 0.65, sx: 1, sy: 1, sz: 1, ry: -(a2 + Math.PI / 2), c: '#8a5f38',
        });
      }
    }
    for (const p of scatter(z, 6, { clearance: 1.6, maxR: 0.7 })) {
      items.hay.push({ x: p.x, z: p.z, oy: 0.45, sx: 1, sy: 1, sz: 1, ry: rng() * 3, c: '#d8b95a' });
      colliders.push({ x: p.x, z: p.z, r: 0.65 });
    }
    for (const p of scatter(z, 70, { clearance: 0.3, solid: false, maxR: 1.1 })) {
      items.flower.push({ x: p.x, z: p.z, oy: 0.14, sx: 1, sy: 1, sz: 1, c: pick(rng, ['#ff7aa8', '#ffd54a', '#ffffff']) });
    }
  }

  // ---- Danau Biru: alang-alang di tepi, pohon palem, batu tepi danau
  {
    const z = byId.danau;
    for (let i = 0; i < 70; i++) {
      const a = rng() * Math.PI * 2;
      const r = LAKE.colliderR + 0.2 + rng() * 2.4;
      const x = z.x + Math.cos(a) * r;
      const zz = z.z + Math.sin(a) * r;
      if (isWater(x, zz) || distToPath(x, zz) < 2) continue;
      items.reed.push({ x, z: zz, sx: 1, sy: 0.8 + rng() * 0.9, sz: 1, ry: rng() * 3, c: pick(rng, ['#6fa04a', '#7fb055']) });
    }
    for (const p of scatter(z, 10, { clearance: 2, minR: 0.5 })) {
      solidTree(p, 2.6 + rng() * 1.0, 1.1 + rng() * 0.3, pick(rng, ['#43a653', '#3a9a4a']), '#8a6238', 0.9);
    }
    for (const p of scatter(z, 8, { clearance: 1.2, minR: 0.5 })) {
      const s = 0.45 + rng() * 0.6;
      items.rock.push({ x: p.x, z: p.z, oy: s * 0.35, sx: s, sy: s * 0.7, sz: s, rx: rng() * 3, ry: rng() * 3, rz: rng() * 3, c: '#8c9098' });
      colliders.push({ x: p.x, z: p.z, r: s * 0.85 });
    }
  }

  // ---- Padang Pasir: kaktus, batu pasir
  {
    const z = byId.gurun;
    for (const p of scatter(z, 16, { clearance: 2.2 })) {
      const h = 1.6 + rng() * 1.0;
      items.cactus.push({ x: p.x, z: p.z, sx: 1, sy: h, sz: 1, c: '#4f9a5a' });
      items.arm.push({ x: p.x + 0.5, z: p.z, oy: h * 0.35, sx: 0.7, sy: h * 0.45, sz: 0.7, c: '#4f9a5a' });
      colliders.push({ x: p.x, z: p.z, r: 0.5 });
    }
    for (const p of scatter(z, 9, { clearance: 1.2 })) {
      const s = 0.5 + rng() * 0.7;
      items.rock.push({ x: p.x, z: p.z, oy: s * 0.35, sx: s, sy: s * 0.7, sz: s, rx: rng() * 3, ry: rng() * 3, rz: rng() * 3, c: '#c79a62' });
      colliders.push({ x: p.x, z: p.z, r: s * 0.85 });
    }
    for (const p of scatter(z, 30, { clearance: 0.3, solid: false, maxR: 1.1 })) {
      items.tuft.push({ x: p.x, z: p.z, sx: 1, sy: 0.5 + rng() * 0.4, sz: 1, ry: rng() * 3, c: '#b9a55a' });
    }
  }

  // ---- Taman Burung: hamparan bunga dan pohon kecil
  {
    const z = byId['taman-burung'];
    for (const p of scatter(z, 150, { clearance: 0.3, solid: false, maxR: 1.0 })) {
      items.flower.push({ x: p.x, z: p.z, oy: 0.14, sx: 1, sy: 1, sz: 1, c: pick(rng, ['#ff7aa8', '#b58cff', '#ffd54a', '#ffffff', '#ff9a4a']) });
    }
    for (const p of scatter(z, 10, { clearance: 2.0, minR: 0.35 })) {
      solidTree(p, 1.4 + rng() * 0.6, 0.95 + rng() * 0.3, pick(rng, ['#4fae52', '#5cc060']), '#7a5232', 1.1);
    }
  }

  // ---- Hub: bunga melingkar di tepi plaza
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2 + rng() * 0.1;
    const r = 11.5 + rng() * 2.0;
    const x = Math.cos(a) * r;
    const zz = Math.sin(a) * r;
    if (distToPath(x, zz) < 3) continue;
    items.flower.push({ x, z: zz, oy: 0.14, sx: 1, sy: 1, sz: 1, c: pick(rng, ['#ff7aa8', '#ffd54a', '#ffffff', '#b58cff']) });
  }

  return { items, colliders, hub: HUB };
}
