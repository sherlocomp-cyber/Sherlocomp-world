// Rencana dekorasi SICKNESS KINGDOM (murni, deterministik, tanpa Three.js).
// Menghasilkan data posisi/ukuran/warna untuk InstancedMesh + lingkaran tabrakan, sehingga bisa
// diuji di Node (jalur setapak bebas, tidak menumpuk landmark/tempat kata/bintang).

import { ZONES, HUB, MONUMENT, STATIONS, ZONE_SIGNS, STAR_POSITIONS, LANDMARKS, HUB_SIGN, distToPath } from './sickness-layout.js';

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

export function buildPlan(seed = 20261031) {
  const rng = mulberry32(seed);
  const colliders = [];
  const items = {
    trunk: [], crown: [], bush: [], flower: [], tuft: [], rock: [],
    bench: [], planter: [], lampHead: [],
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
  const bushAt = (p, colors) => {
    const s = 0.45 + rng() * 0.4;
    items.bush.push({ x: p.x, z: p.z, oy: s * 0.5, sx: s, sy: s * 0.8, sz: s, ry: rng() * 3, c: pick(rng, colors) });
  };
  const flowerAt = (p, colors) => {
    items.flower.push({ x: p.x, z: p.z, oy: 0.14, sx: 1, sy: 1, sz: 1, c: pick(rng, colors) });
  };
  const benchAt = (p) => {
    items.bench.push({ x: p.x, z: p.z, sx: 1, sy: 1, sz: 1, ry: rng() * Math.PI, c: '#8a5f38' });
    colliders.push({ x: p.x, z: p.z, r: 0.8 });
  };
  const lampAt = (p) => {
    items.trunk.push({ x: p.x, z: p.z, sx: 1, sy: 2.4, sz: 1, c: '#8e98a3' });
    items.lampHead.push({ x: p.x, z: p.z, oy: 2.5, sx: 1, sy: 1, sz: 1, c: '#fff3b0' });
    colliders.push({ x: p.x, z: p.z, r: 0.18 });
  };
  const rockAt = (p, color) => {
    const s = 0.5 + rng() * 0.7;
    items.rock.push({ x: p.x, z: p.z, oy: s * 0.35, sx: s, sy: s * 0.7, sz: s, rx: rng() * 3, ry: rng() * 3, rz: rng() * 3, c: color });
    colliders.push({ x: p.x, z: p.z, r: s * 0.85 });
  };

  const GREENS = ['#3f8f45', '#357c3c', '#4aa050'];
  const LEAVES = ['#43a653', '#3a9a4a', '#4fae52'];
  const PASTEL = ['#ff9ec1', '#ffd54a', '#ffffff', '#b58cff'];

  // ---- Rumah Sakit: halaman hijau tenang, pohon, bangku, lampu taman
  {
    const z = byId['rumah-sakit'];
    for (const p of scatter(z, 12, { clearance: 2.2, minR: 0.62 })) solidTree(p, 2.6 + rng() * 1.2, 1.2 + rng() * 0.4, pick(rng, LEAVES), '#7a5232', 1.15);
    for (const p of scatter(z, 30, { clearance: 0.8, solid: false, maxR: 1.05 })) bushAt(p, GREENS);
    for (const p of scatter(z, 60, { clearance: 0.3, solid: false, maxR: 1.05 })) flowerAt(p, PASTEL);
    for (const p of scatter(z, 4, { clearance: 1.6, minR: 0.3, maxR: 0.6 })) benchAt(p);
    for (const p of scatter(z, 6, { clearance: 1.5, minR: 0.4, maxR: 0.85 })) lampAt(p);
  }

  // ---- Apotek: kebun herbal, kotak tanaman
  {
    const z = byId.apotek;
    for (const p of scatter(z, 6, { clearance: 1.6, minR: 0.3, maxR: 0.7 })) {
      items.planter.push({ x: p.x, z: p.z, sx: 1, sy: 1, sz: 1, ry: rng() * Math.PI, c: '#7a5232' });
      colliders.push({ x: p.x, z: p.z, r: 0.8 });
    }
    for (const p of scatter(z, 24, { clearance: 0.8, solid: false, maxR: 1.05 })) bushAt(p, GREENS);
    for (const p of scatter(z, 80, { clearance: 0.25, solid: false, maxR: 1.05 })) {
      items.tuft.push({ x: p.x, z: p.z, sx: 1, sy: 0.6 + rng() * 0.6, sz: 1, ry: rng() * 3, c: pick(rng, ['#5fae55', '#6dbb5e', '#4f9c4a']) });
    }
    for (const p of scatter(z, 40, { clearance: 0.3, solid: false, maxR: 1.05 })) flowerAt(p, ['#ffffff', '#c9a6ff', '#ffd54a']);
    for (const p of scatter(z, 6, { clearance: 2, minR: 0.6 })) solidTree(p, 2.4 + rng() * 0.8, 1.1 + rng() * 0.3, pick(rng, LEAVES), '#7a5232', 1.1);
  }

  // ---- Taman Kepala: pohon rindang, bunga kuning, batu, lampu
  {
    const z = byId['taman-kepala'];
    for (const p of scatter(z, 10, { clearance: 2.2, minR: 0.45 })) solidTree(p, 3 + rng() * 1.4, 1.4 + rng() * 0.6, pick(rng, ['#2f7a3a', '#3a8a40', '#4aa050']), '#6a4528', 1.25);
    for (const p of scatter(z, 80, { clearance: 0.3, solid: false, maxR: 1.05 })) flowerAt(p, ['#ffd54a', '#ff9a4a', '#ffffff']);
    for (const p of scatter(z, 6, { clearance: 1.2, minR: 0.4 })) rockAt(p, '#9aa0a8');
    for (const p of scatter(z, 4, { clearance: 1.5, minR: 0.4, maxR: 0.85 })) lampAt(p);
  }

  // ---- Taman Perut: bunga hangat, semak, bangku
  {
    const z = byId['taman-perut'];
    for (const p of scatter(z, 24, { clearance: 0.8, solid: false, maxR: 1.05 })) bushAt(p, GREENS);
    for (const p of scatter(z, 100, { clearance: 0.3, solid: false, maxR: 1.05 })) flowerAt(p, ['#ff9ec1', '#ff9a4a', '#ffd54a', '#ffffff']);
    for (const p of scatter(z, 3, { clearance: 1.6, minR: 0.35, maxR: 0.65 })) benchAt(p);
    for (const p of scatter(z, 6, { clearance: 2, minR: 0.55 })) solidTree(p, 2.4 + rng() * 0.8, 1.1 + rng() * 0.3, pick(rng, LEAVES), '#7a5232', 1.1);
    for (const p of scatter(z, 3, { clearance: 1.5, minR: 0.4, maxR: 0.85 })) lampAt(p);
  }

  // ---- Taman Flu dan Demam: rumput tinggi, bunga biru-putih
  {
    const z = byId['taman-flu'];
    for (const p of scatter(z, 60, { clearance: 0.25, solid: false, maxR: 1.05 })) {
      items.tuft.push({ x: p.x, z: p.z, sx: 1, sy: 0.9 + rng() * 0.9, sz: 1, ry: rng() * 3, c: pick(rng, ['#8fc86a', '#7fbf5f', '#9ad07a']) });
    }
    for (const p of scatter(z, 70, { clearance: 0.3, solid: false, maxR: 1.05 })) flowerAt(p, ['#7fb6ff', '#ffffff', '#b8d8ff']);
    for (const p of scatter(z, 8, { clearance: 2.2, minR: 0.5 })) solidTree(p, 2.8 + rng() * 1.0, 1.2 + rng() * 0.4, pick(rng, LEAVES), '#7a5232', 1.15);
    for (const p of scatter(z, 16, { clearance: 0.8, solid: false, maxR: 1.05 })) bushAt(p, GREENS);
    for (const p of scatter(z, 2, { clearance: 1.6, minR: 0.35, maxR: 0.65 })) benchAt(p);
  }

  // ---- Hub: bunga melingkar di tepi plaza + lampu plaza
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2 + rng() * 0.1;
    const r = 11.5 + rng() * 2.0;
    const x = Math.cos(a) * r;
    const zz = Math.sin(a) * r;
    if (distToPath(x, zz) < 3) continue;
    flowerAt({ x, z: zz }, ['#ff9ec1', '#ffd54a', '#ffffff', '#b58cff']);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const p = { x: Math.cos(a) * 9.5, z: Math.sin(a) * 9.5 };
    if (free(p.x, p.z, 1.2, PATH_CLEAR)) {
      taken.push({ x: p.x, z: p.z, r: 1.2 });
      lampAt(p);
    }
  }

  return { items, colliders, hub: HUB };
}
