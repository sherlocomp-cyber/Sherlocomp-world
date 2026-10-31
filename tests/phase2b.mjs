// Uji Node PHASE 2 tahap B (Sickness Kingdom): logika murni saja — tata letak, medan, rencana dekorasi, gambar.
// BUKAN uji WebGL/tampilan/FPS. Jalankan: npm run test:phase2b  (atau: node tests/phase2b.mjs)

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(new URL('file://' + join(ROOT, p)));
const results = [];
function test(name, fn) {
  try { fn(); results.push({ name, ok: true }); } catch (e) { results.push({ name, ok: false, err: e.message }); }
}
const ok = (c, m) => { if (!c) throw new Error(m); };
const eq = (a, b, m = '') => { if (a !== b) throw new Error(`${m} diharapkan ${b}, dapat ${a}`); };
const near = (a, b, t = 1e-9, m = '') => { if (Math.abs(a - b) > t) throw new Error(`${m} diharapkan ≈${b}, dapat ${a}`); };

const L = await imp('src/worlds/sickness-layout.js');
const T = await imp('src/core/terrain-sickness.js');
const P = await imp('src/worlds/sickness-plan.js');
const ART = await imp('src/worlds/sickness-art.js');
const C = await imp('src/core/collision.js');
const cfg = await imp('src/core/config.js');
const plan = P.buildPlan();
const bab3 = JSON.parse(readFileSync(join(ROOT, 'src/data/lessons/bab3-penyakit.json'), 'utf8'));
const allColliders = [...L.FIXED_COLLIDERS, ...plan.colliders];

test('materi: 14 kosakata inti Bab 3 masing-masing punya tepat satu tempat kata', () => {
  const core = bab3.vocab.map((v) => v.id);
  eq(core.length, 14, 'jumlah kosakata inti');
  const placed = L.STATIONS.map((s) => s.vocabId);
  eq(placed.length, 14, 'jumlah tempat');
  eq(new Set(placed).size, placed.length, 'ID ganda di STATIONS;');
  for (const id of core) ok(placed.includes(id), `${id} tidak punya tempat`);
});

test('materi: semua ID di STATIONS ada di database (tidak ada ID karangan)', () => {
  const all = new Set(bab3.vocab.map((v) => v.id));
  for (const s of L.STATIONS) ok(all.has(s.vocabId), `ID tidak dikenal: ${s.vocabId}`);
  for (const z of L.ZONES) for (const id of z.vocab) ok(all.has(id), `ID tidak dikenal di wilayah ${z.id}: ${id}`);
});

test('wilayah: 5 wilayah, sebaran 3/3/3/2/3, kolom wajib terisi', () => {
  eq(L.ZONES.length, 5, 'jumlah wilayah');
  eq(L.ZONES.map((z) => z.vocab.length).join('/'), '3/3/3/2/3', 'sebaran;');
  for (const z of L.ZONES) {
    for (const k of ['id', 'name', 'x', 'z', 'r', 'vocab', 'ground', 'ring', 'landmarkR', 'color', 'starR']) ok(z[k] !== undefined, `${z.id} tanpa ${k}`);
    ok(z.ring + 2 < z.r, `${z.id}: lingkar tempat kata terlalu dekat tepi wilayah`);
    ok(z.ring > z.landmarkR + 2, `${z.id}: tempat kata terlalu dekat landmark`);
  }
});

test('wilayah: semua di dalam dunia, tidak saling tumpang, tidak menimpa hub', () => {
  for (const z of L.ZONES) {
    ok(Math.hypot(z.x, z.z) + z.r < L.WORLD.radius - 8, `${z.id} terlalu dekat tepi`);
    ok(Math.hypot(z.x, z.z) > z.r + L.HUB.r + 6, `${z.id} menimpa hub`);
  }
  for (let i = 0; i < L.ZONES.length; i++) for (let j = i + 1; j < L.ZONES.length; j++) {
    const a = L.ZONES[i], b = L.ZONES[j];
    ok(Math.hypot(a.x - b.x, a.z - b.z) > a.r + b.r + 4, `${a.id} bertumpuk ${b.id}`);
  }
});

test('titik awal: tinggi 0, jauh dari penghalang', () => {
  near(T.heightAt(L.SPAWN.x, L.SPAWN.z), 0, 1e-9);
  for (const c of allColliders) ok(Math.hypot(L.SPAWN.x - c.x, L.SPAWN.z - c.z) > c.r + cfg.PLAYER.radius + 1, `spawn dekat ${c.id || 'dekor'}`);
});

test('medan: berhingga & deterministik di seluruh dunia; tepi dunia menanjak; tanpa air', () => {
  for (let x = -110; x <= 110; x += 5) for (let z = -110; z <= 110; z += 5) {
    const h = T.heightAt(x, z);
    ok(Number.isFinite(h), `NaN di ${x},${z}`);
    eq(h, T.heightAt(x, z), 'tidak deterministik;');
    ok(!T.isWater(x, z), 'air tidak diharapkan');
  }
  ok(T.heightAt(L.WORLD.radius, 0) > 3, 'tepi tidak menanjak');
});

test('hub dan wilayah: rata (selisih tinggi kecil) di tempat pemain berjalan', () => {
  for (const z of [L.HUB, ...L.ZONES]) {
    for (let a = 0; a < Math.PI * 2; a += 0.4) for (const f of [0, 0.4, 0.8]) {
      const h = T.heightAt(z.x + Math.cos(a) * z.r * f, z.z + Math.sin(a) * z.r * f);
      ok(Math.abs(h) < 0.05, `${z.id} tidak rata: ${h.toFixed(2)}`);
    }
  }
});

test('jalan setapak: hub ke tiap wilayah tanpa tanjakan curam (tiap 0,5 satuan)', () => {
  eq(L.PATHS.length, L.ZONES.length, 'jumlah jalan');
  for (const p of L.PATHS) {
    const len = Math.hypot(p.bx - p.ax, p.bz - p.az);
    let prev = T.heightAt(p.ax, p.az);
    for (let s = 0.5; s <= len; s += 0.5) {
      const x = p.ax + ((p.bx - p.ax) * s) / len;
      const z = p.az + ((p.bz - p.az) * s) / len;
      const h = T.heightAt(x, z);
      ok(Math.abs(h - prev) < 0.3, `tanjakan curam di jalan ${p.id} @${s}`);
      prev = h;
    }
  }
});

test('jalan setapak: tidak terhalang penghalang tetap maupun dekor berkolisi', () => {
  const all = [...L.FIXED_COLLIDERS.filter((c) => !c.id.startsWith('station-') && !c.id.startsWith('sign-')), ...plan.colliders];
  for (const p of L.PATHS) {
    const len = Math.hypot(p.bx - p.ax, p.bz - p.az);
    for (let s = 0; s <= len; s += 0.5) {
      const x = p.ax + ((p.bx - p.ax) * s) / len;
      const z = p.az + ((p.bz - p.az) * s) / len;
      for (const c of all) ok(Math.hypot(x - c.x, z - c.z) > c.r + cfg.PLAYER.radius + 0.2, `jalan ${p.id} @${s} terhalang ${c.id || 'dekor'}`);
    }
  }
});

test('tempat kata, papan, bintang: di dalam dunia, tidak saling menempel', () => {
  const pts = [
    ...L.STATIONS.map((s) => ({ n: 'station ' + s.vocabId, x: s.x, z: s.z, gap: 2.2 })),
    ...L.ZONE_SIGNS.map((s) => ({ n: 'sign ' + s.zoneId, x: s.x, z: s.z, gap: 1.5 })),
    ...L.STAR_POSITIONS.map((s, i) => ({ n: 'star ' + i, x: s.x, z: s.z, gap: 1.5 })),
  ];
  for (const p of pts) ok(Math.hypot(p.x, p.z) < L.WORLD.radius - 4, `${p.n} di luar dunia`);
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    ok(Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z) > Math.max(pts[i].gap, pts[j].gap), `${pts[i].n} terlalu dekat ${pts[j].n}`);
  }
});

test('tempat kata: tiap tempat berada di dalam wilayahnya sendiri', () => {
  for (const s of L.STATIONS) {
    const z = L.ZONES.find((q) => q.id === s.zoneId);
    ok(Math.hypot(s.x - z.x, s.z - z.z) < z.r - 2, `${s.vocabId} terlalu dekat tepi wilayah`);
  }
});

test('bintang: satu per wilayah, di dalam wilayahnya, tidak menempel penghalang', () => {
  eq(L.STAR_POSITIONS.length, L.ZONES.length, 'jumlah bintang');
  L.STAR_POSITIONS.forEach((s, i) => {
    const z = L.ZONES[i];
    ok(Math.hypot(s.x - z.x, s.z - z.z) < z.r - 1.5, `bintang ${z.id} di luar wilayah`);
    for (const c of allColliders) ok(Math.hypot(s.x - c.x, s.z - c.z) > c.r + cfg.PLAYER.radius + 0.5, `bintang ${z.id} menempel ${c.id || 'dekor'}`);
  });
});

test('rencana: deterministik (dua kali bangun hasilnya sama)', () => {
  eq(JSON.stringify(P.buildPlan()), JSON.stringify(P.buildPlan()), 'rencana berubah;');
});

test('rencana: semua dekor berhingga dan di dalam dunia; jumlah wajar', () => {
  let total = 0;
  for (const [kind, list] of Object.entries(plan.items)) {
    total += list.length;
    for (const it of list) {
      ok(Number.isFinite(it.x) && Number.isFinite(it.z), `${kind} NaN`);
      ok(Math.hypot(it.x, it.z) < L.WORLD.radius, `${kind} di luar dunia`);
    }
  }
  ok(total > 300 && total < 2000, 'jumlah dekor tidak wajar: ' + total);
  ok(plan.colliders.length < 400, 'terlalu banyak collider: ' + plan.colliders.length);
});

test('rencana: dekor berkolisi tidak menimpa landmark, tempat kata, papan, atau tugu', () => {
  for (const c of plan.colliders) for (const f of L.FIXED_COLLIDERS) {
    ok(Math.hypot(c.x - f.x, c.z - f.z) > c.r + f.r + 0.2, `dekor menimpa ${f.id}`);
  }
});

test('rencana: tiap wilayah punya dekor khasnya', () => {
  const near_ = (z, kind) => plan.items[kind].some((it) => Math.hypot(it.x - z.x, it.z - z.z) < z.r + 2);
  const by = Object.fromEntries(L.ZONES.map((z) => [z.id, z]));
  ok(near_(by['rumah-sakit'], 'lampHead'), 'rumah sakit tanpa lampu taman');
  ok(near_(by.apotek, 'planter'), 'apotek tanpa kotak tanaman');
  ok(near_(by['taman-kepala'], 'crown'), 'taman kepala tanpa pohon');
  ok(near_(by['taman-perut'], 'bench'), 'taman perut tanpa bangku');
  ok(near_(by['taman-flu'], 'tuft'), 'taman flu tanpa rumput tinggi');
});

test('tabrakan: pemain tidak bisa berjalan menembus landmark dari sisi gerbang', () => {
  for (const z of L.ZONES) {
    const e = L.entranceAngle(z);
    const p = { x: z.x + Math.cos(e) * (z.landmarkR + 1.5), z: z.z + Math.sin(e) * (z.landmarkR + 1.5) };
    for (let i = 0; i < 400; i++) {
      const dx = z.x - p.x, dz = z.z - p.z, d = Math.hypot(dx, dz) || 1;
      p.x += (dx / d) * 0.05;
      p.z += (dz / d) * 0.05;
      C.resolveColliders(p, cfg.PLAYER.radius, allColliders);
    }
    ok(Math.hypot(p.x - z.x, p.z - z.z) >= z.landmarkR + cfg.PLAYER.radius - 0.05, `pemain menembus landmark ${z.id}`);
  }
});

test('zoneAt: pusat wilayah dikenali, hub dikenali, tepi dunia null', () => {
  for (const z of L.ZONES) eq(L.zoneAt(z.x, z.z).id, z.id, 'wilayah');
  eq(L.zoneAt(0, 0).id, 'hub');
  eq(L.zoneAt(95, 0), null);
});

test('gambar kosakata: tiap tempat punya gambar; file ada di repo dan cocok dengan manifest', () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'public/assets/manifest.json'), 'utf8'));
  const byVocab = Object.fromEntries(manifest.assets.filter((a) => a.kind === 'health' && a.vocab_id).map((a) => [a.vocab_id, a.file.split('/').pop()]));
  for (const s of L.STATIONS) {
    const f = ART.healthImageFile(s.vocabId);
    ok(f, 'tidak ada gambar untuk ' + s.vocabId);
    eq(f, byVocab[s.vocabId], 'manifest ' + s.vocabId);
    ok(existsSync(join(ROOT, 'public/assets/images/health', f)), 'file tidak ada: ' + f);
    const sz = ART.healthSize(s.vocabId);
    ok(sz > 0.5 && sz < 4, 'ukuran tidak wajar ' + s.vocabId);
  }
});

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'LULUS ' : 'GAGAL '} ${r.name}${r.ok ? '' : '\n        → ' + r.err}`);
console.log(`\n${results.length - failed.length}/${results.length} lulus`);
console.log('CATATAN: uji Node (logika murni). Tidak menguji WebGL, tampilan, sentuhan, atau FPS.');
process.exit(failed.length ? 1 : 0);
