// Uji Node PHASE 2 (Animal Kingdom): logika murni saja — tata letak, medan, rencana dekorasi, anggaran.
// BUKAN uji WebGL/tampilan/FPS. Jalankan: npm run test:phase2  (atau: node tests/phase2.mjs)

import { readFileSync } from 'node:fs';
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

const L = await imp('src/worlds/animal-layout.js');
const T = await imp('src/core/terrain-animal.js');
const P = await imp('src/worlds/animal-plan.js');
const B = await imp('src/core/budget.js');
const C = await imp('src/core/collision.js');
const cfg = await imp('src/core/config.js');
const plan = P.buildPlan();
const bab2 = JSON.parse(readFileSync(join(ROOT, 'src/data/lessons/bab2-hewan.json'), 'utf8'));

test('materi: 21 kosakata inti Bab 2 masing-masing punya tepat satu tempat hewan', () => {
  const core = bab2.vocab.map((v) => v.id);
  eq(core.length, 21, 'jumlah kosakata inti');
  const placed = L.STATIONS.map((s) => s.vocabId);
  eq(new Set(placed).size, placed.length, 'ID ganda di STATIONS;');
  for (const id of core) ok(placed.includes(id), `${id} tidak punya tempat`);
});

test('materi: semua ID di STATIONS ada di database (tidak ada ID karangan)', () => {
  const all = new Set([...bab2.vocab, ...(bab2.extra_vocab || [])].map((v) => v.id));
  for (const s of L.STATIONS) ok(all.has(s.vocabId), `ID tidak dikenal: ${s.vocabId}`);
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

test('titik awal: tinggi 0, bukan air, jauh dari penghalang', () => {
  near(T.heightAt(L.SPAWN.x, L.SPAWN.z), 0, 1e-9);
  ok(!T.isWater(L.SPAWN.x, L.SPAWN.z), 'spawn di air');
  for (const c of [...L.FIXED_COLLIDERS, ...plan.colliders]) ok(Math.hypot(L.SPAWN.x - c.x, L.SPAWN.z - c.z) > c.r + cfg.PLAYER.radius + 1, `spawn dekat ${c.id || 'dekor'}`);
});

test('medan: berhingga & deterministik di seluruh dunia; tepi dunia menanjak', () => {
  for (let x = -110; x <= 110; x += 5) for (let z = -110; z <= 110; z += 5) {
    const h = T.heightAt(x, z);
    ok(Number.isFinite(h), `NaN di ${x},${z}`);
    eq(h, T.heightAt(x, z), 'tidak deterministik;');
  }
  ok(T.heightAt(L.WORLD.radius, 0) > 3, 'tepi tidak menanjak');
});

test('danau: pusat adalah air; garis penghalang danau tepat di darat (semua sudut)', () => {
  ok(T.isWater(L.LAKE.x, L.LAKE.z), 'pusat danau bukan air');
  for (let a = 0; a < Math.PI * 2; a += 0.05) {
    const x = L.LAKE.x + Math.cos(a) * L.LAKE.colliderR;
    const z = L.LAKE.z + Math.sin(a) * L.LAKE.colliderR;
    ok(!T.isWater(x, z), `air di luar penghalang danau (sudut ${a.toFixed(2)})`);
  }
});

test('jalan setapak: hub ke tiap wilayah tanpa air dan tanpa tanjakan curam (tiap 0,5 satuan)', () => {
  for (const p of L.PATHS) {
    const len = Math.hypot(p.bx - p.ax, p.bz - p.az);
    let prev = T.heightAt(p.ax, p.az);
    for (let s = 0.5; s <= len; s += 0.5) {
      const x = p.ax + ((p.bx - p.ax) * s) / len;
      const z = p.az + ((p.bz - p.az) * s) / len;
      ok(!T.isWater(x, z), `air di jalan ${p.id} @${s}`);
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

test('tempat hewan, papan, bintang: di darat, di dalam dunia, tidak saling menempel', () => {
  const pts = [
    ...L.STATIONS.map((s) => ({ n: 'station ' + s.vocabId, x: s.x, z: s.z, gap: 2.2 })),
    ...L.ZONE_SIGNS.map((s) => ({ n: 'sign ' + s.zoneId, x: s.x, z: s.z, gap: 1.5 })),
    ...L.STAR_POSITIONS.map((s, i) => ({ n: 'star ' + i, x: s.x, z: s.z, gap: 1.5 })),
  ];
  for (const p of pts) {
    ok(!T.isWater(p.x, p.z), `${p.n} di air`);
    ok(Math.hypot(p.x, p.z) < L.WORLD.radius - 4, `${p.n} di luar dunia`);
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    ok(Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z) > Math.max(pts[i].gap, pts[j].gap), `${pts[i].n} terlalu dekat ${pts[j].n}`);
  }
});

test('bintang: satu per wilayah, tidak berada di dalam penghalang tetap', () => {
  eq(L.STAR_POSITIONS.length, L.ZONES.length, 'jumlah bintang');
  for (const s of L.STAR_POSITIONS) for (const c of [...L.FIXED_COLLIDERS, ...plan.colliders]) {
    ok(Math.hypot(s.x - c.x, s.z - c.z) > c.r + cfg.PLAYER.radius + 0.5, `bintang menempel ${c.id || 'dekor'}`);
  }
});

test('rencana: deterministik (dua kali bangun hasilnya sama)', () => {
  const a = JSON.stringify(P.buildPlan());
  eq(a, JSON.stringify(P.buildPlan()), 'rencana berubah;');
});

test('rencana: semua dekor di darat dan di dalam dunia; jumlah wajar', () => {
  let total = 0;
  for (const [kind, list] of Object.entries(plan.items)) {
    total += list.length;
    for (const it of list) {
      ok(Number.isFinite(it.x) && Number.isFinite(it.z), `${kind} NaN`);
      ok(Math.hypot(it.x, it.z) < L.WORLD.radius, `${kind} di luar dunia`);
      if (kind !== 'reed') ok(!T.isWater(it.x, it.z), `${kind} di air ${it.x.toFixed(1)},${it.z.toFixed(1)}`);
    }
  }
  ok(total > 300 && total < 2000, 'jumlah dekor tidak wajar: ' + total);
  ok(plan.colliders.length < 400, 'terlalu banyak collider: ' + plan.colliders.length);
});

test('rencana: tiap wilayah punya dekor khasnya', () => {
  const near_ = (z, kind) => plan.items[kind].some((it) => Math.hypot(it.x - z.x, it.z - z.z) < z.r + 2);
  const by = Object.fromEntries(L.ZONES.map((z) => [z.id, z]));
  ok(near_(by.savana, 'canopy'), 'savana tanpa akasia');
  ok(near_(by.hutan, 'crown'), 'hutan tanpa pohon');
  ok(near_(by.peternakan, 'post'), 'peternakan tanpa pagar');
  ok(near_(by.peternakan, 'hay'), 'peternakan tanpa jerami');
  ok(near_(by.danau, 'reed'), 'danau tanpa alang-alang');
  ok(near_(by.gurun, 'cactus'), 'gurun tanpa kaktus');
  ok(near_(by['taman-burung'], 'flower'), 'taman burung tanpa bunga');
});

test('pagar peternakan: celah di sisi gerbang (jalan masuk tidak tertutup)', () => {
  const z = L.ZONES.find((q) => q.id === 'peternakan');
  const e = L.entranceAngle(z);
  const gx = z.x + Math.cos(e) * 15, gz = z.z + Math.sin(e) * 15;
  for (const p of plan.items.post) ok(Math.hypot(p.x - gx, p.z - gz) > 1.8, 'tiang menutup celah gerbang');
});

test('tabrakan: pemain tidak bisa berjalan masuk ke air danau', () => {
  const cols = [...L.FIXED_COLLIDERS, ...plan.colliders];
  const p = { x: L.LAKE.x + 12, z: L.LAKE.z };
  for (let i = 0; i < 400; i++) { p.x -= 0.05; C.resolveColliders(p, cfg.PLAYER.radius, cols); }
  ok(!T.isWater(p.x, p.z), 'pemain masuk air');
});

test('zoneAt: pusat wilayah dikenali, hub dikenali, tepi dunia null', () => {
  for (const z of L.ZONES) eq(L.zoneAt(z.x, z.z).id, z.id, 'wilayah');
  eq(L.zoneAt(0, 0).id, 'hub');
  eq(L.zoneAt(95, 0), null);
});

test('anggaran: batas naik dari Low ke High; checkBudget menandai pelanggaran', () => {
  ok(B.PERF_BUDGET.low.drawCalls < B.PERF_BUDGET.medium.drawCalls && B.PERF_BUDGET.medium.drawCalls < B.PERF_BUDGET.high.drawCalls, 'urutan draw call');
  eq(B.checkBudget({ calls: 50, triangles: 1000 }, 'low').ok, true);
  const bad = B.checkBudget({ calls: 999, triangles: 1e7 }, 'low');
  eq(bad.ok, false);
  eq(bad.issues.length, 2, 'jumlah isu');
});

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'LULUS ' : 'GAGAL '} ${r.name}${r.ok ? '' : '\n        → ' + r.err}`);
console.log(`\n${results.length - failed.length}/${results.length} lulus`);
console.log('CATATAN: uji Node (logika murni). Tidak menguji WebGL, tampilan, sentuhan, atau FPS.');
process.exit(failed.length ? 1 : 0);
