// Uji asap PHASE 1 yang berjalan di Node TANPA Three.js, TANPA browser.
// Menguji logika murni + konsistensi proyek. Ini BUKAN uji tampilan/WebGL/perangkat;
// uji itu harus dilakukan manual di browser (lihat TEST_REPORT.md).
//
// Jalankan:  npm run test:smoke   (atau: node tests/smoke.mjs)

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, err: e.message });
  }
}
function eq(a, b, msg = '') {
  if (a !== b) throw new Error(`${msg} diharapkan ${b}, dapat ${a}`);
}
function near(a, b, tol = 1e-6, msg = '') {
  if (Math.abs(a - b) > tol) throw new Error(`${msg} diharapkan ≈${b}, dapat ${a}`);
}
function ok(cond, msg) {
  if (!cond) throw new Error(msg);
}

const imp = (p) => import(new URL('file://' + join(ROOT, p)));

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const jsFiles = walk(join(ROOT, 'src')).filter((f) => f.endsWith('.js'));

// ------------------------------------------------------------------ sintaks
test('sintaks: semua src/**/*.js lolos node --check', () => {
  for (const f of [...jsFiles, join(ROOT, 'vite.config.js'), join(ROOT, 'tests/smoke.mjs')]) {
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
    } catch (e) {
      throw new Error(`${relative(ROOT, f)}: ${String(e.stderr || e.message).split('\n').slice(0, 4).join(' | ')}`);
    }
  }
});

test('impor relatif: setiap file yang diimpor ada', () => {
  const re = /(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)/g;
  for (const f of jsFiles) {
    const src = readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(src))) {
      const target = resolve(dirname(f), m[1] || m[2]);
      ok(existsSync(target), `${relative(ROOT, f)} mengimpor ${m[1] || m[2]} yang tidak ada`);
    }
  }
});

test('impor paket: hanya three (dependensi terdaftar di package.json)', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const re = /from\s*['"]([^./][^'"]*)['"]/g;
  for (const f of jsFiles) {
    let m;
    const src = readFileSync(f, 'utf8');
    while ((m = re.exec(src))) {
      const name = m[1].split('/')[0];
      ok(pkg.dependencies?.[name] || pkg.devDependencies?.[name], `${relative(ROOT, f)} memakai paket ${name} yang tidak ada di package.json`);
    }
  }
});

test('package.json: three dipin persis (tanpa ^ atau ~)', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  ok(/^\d+\.\d+\.\d+$/.test(pkg.dependencies.three), 'versi three tidak dipin: ' + pkg.dependencies.three);
});

// ------------------------------------------------------------------ HTML <-> JS
test('index.html: semua id yang dipakai main.js/ui.js ada', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const f of ['src/main.js', 'src/ui/ui.js']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/\$\('([^']+)'\)/g)) {
      ok(ids.has(m[1]), `${f}: id "${m[1]}" tidak ada di index.html`);
    }
  }
  for (const s of ['loading', 'menu', 'create', 'settings', 'pause', 'error']) {
    ok(ids.has('screen-' + s), `layar screen-${s} tidak ada`);
  }
});

test('index.html: semua aset yang dirujuk ada di public/', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    ok(existsSync(join(ROOT, 'public', m[1])), `aset hilang: ${m[1]}`);
  }
  const css = readFileSync(join(ROOT, 'src/ui/styles.css'), 'utf8');
  for (const m of css.matchAll(/url\('(\/assets\/[^']+)'\)/g)) {
    ok(existsSync(join(ROOT, 'public', m[1])), `aset CSS hilang: ${m[1]}`);
  }
});

test('config: PRELOAD_IMAGES ada di disk dan di manifest', () => {
  const cfg = readFileSync(join(ROOT, 'src/core/config.js'), 'utf8');
  const list = [...cfg.matchAll(/'(images\/[^']+)'/g)].map((m) => m[1]);
  ok(list.length >= 6, 'daftar preload terlalu pendek');
  const manifest = JSON.parse(readFileSync(join(ROOT, 'public/assets/manifest.json'), 'utf8'));
  const files = new Set(manifest.assets.map((a) => a.file));
  for (const p of list) {
    ok(existsSync(join(ROOT, 'public/assets', p)), `file tidak ada: ${p}`);
    ok(files.has(p), `tidak ada di manifest: ${p}`);
  }
});

test('kontrol: id elemen joystick/tombol sesuai yang dipakai Game', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  for (const id of ['stage', 'joy', 'knob', 'btn-jump', 'btn-run', 'btn-act', 'btn-pause', 'hud', 'toast', 'prompt']) {
    ok(html.includes(`id="${id}"`), `id ${id} hilang`);
  }
});

// ------------------------------------------------------------------ materi tidak berubah
test('materi: kedua JSON pelajaran valid dan ID kosakata unik', () => {
  for (const f of ['bab2-hewan.json', 'bab3-penyakit.json']) {
    const data = JSON.parse(readFileSync(join(ROOT, 'src/data/lessons', f), 'utf8'));
    const ids = [];
    (function collect(o) {
      if (Array.isArray(o)) o.forEach(collect);
      else if (o && typeof o === 'object') {
        if (typeof o.id === 'string' && /^b[23]-v\d+$/.test(o.id)) ids.push(o.id);
        Object.values(o).forEach(collect);
      }
    })(data);
    ok(ids.length > 0, `${f}: tidak ada ID kosakata ditemukan`);
    eq(new Set(ids).size, ids.length, `${f}: ID kosakata duplikat;`);
  }
});

// ------------------------------------------------------------------ logika murni
const terrain = await imp('src/core/terrain.js');
const collision = await imp('src/core/collision.js');
const movement = await imp('src/core/movement.js');
const quality = await imp('src/core/quality.js');
const cam = await imp('src/game/camera-rig.js');
const layout = await imp('src/worlds/layout.js');
const config = await imp('src/core/config.js');

test('terrain: titik awal, rumah, dan papan rata (tinggi 0) dan bukan air', () => {
  for (const [name, p] of [['spawn', layout.SPAWN], ['hut', layout.HUT], ['sign', layout.SIGN]]) {
    near(terrain.heightAt(p.x, p.z), 0, 1e-9, name);
    ok(!terrain.isWater(p.x, p.z), `${name} berada di air`);
  }
});

test('terrain: kolam adalah air; tepi dunia menanjak', () => {
  ok(terrain.isWater(terrain.POND.x, terrain.POND.z), 'pusat kolam bukan air');
  ok(terrain.heightAt(config.WORLD_RADIUS, 0) > 3, 'tepi dunia tidak menanjak');
});

test('terrain: deterministik dan berhingga di seluruh area', () => {
  for (let x = -60; x <= 60; x += 3) {
    for (let z = -60; z <= 60; z += 3) {
      const h = terrain.heightAt(x, z);
      ok(Number.isFinite(h), `NaN di ${x},${z}`);
      eq(h, terrain.heightAt(x, z), 'tidak deterministik;');
    }
  }
});

test('layout: 5 bintang, semua di darat, di dalam dunia, dan tidak di dalam penghalang', () => {
  eq(layout.STAR_POSITIONS.length, 5, 'jumlah bintang');
  for (const s of layout.STAR_POSITIONS) {
    ok(!terrain.isWater(s.x, s.z), `bintang di air: ${s.x},${s.z}`);
    ok(Math.hypot(s.x, s.z) < config.WORLD_RADIUS - 3, `bintang di luar dunia: ${s.x},${s.z}`);
    for (const c of layout.FIXED_COLLIDERS) {
      ok(Math.hypot(s.x - c.x, s.z - c.z) > c.r + config.PLAYER.radius + 0.8, `bintang ${s.x},${s.z} terlalu dekat ${c.id}`);
    }
  }
});

test('layout: kolam FIXED_COLLIDERS selaras dengan terrain.POND', () => {
  const pond = layout.FIXED_COLLIDERS.find((c) => c.id === 'pond');
  eq(pond.x, terrain.POND.x, 'x kolam');
  eq(pond.z, terrain.POND.z, 'z kolam');
});

test('layout: titik awal tidak menempel penghalang tetap', () => {
  for (const c of layout.FIXED_COLLIDERS) {
    ok(Math.hypot(layout.SPAWN.x - c.x, layout.SPAWN.z - c.z) > c.r + config.PLAYER.radius + 1, `spawn terlalu dekat ${c.id}`);
  }
});

test('collision: pemain didorong keluar dari lingkaran', () => {
  const p = { x: 0.2, z: 0 };
  collision.resolveColliders(p, 0.4, [{ x: 0, z: 0, r: 1 }]);
  near(Math.hypot(p.x, p.z), 1.4, 1e-6, 'jarak setelah dorong');
});

test('collision: titik tepat di pusat tidak menghasilkan NaN', () => {
  const p = { x: 0, z: 0 };
  collision.resolveColliders(p, 0.4, [{ x: 0, z: 0, r: 1 }]);
  ok(Number.isFinite(p.x) && Number.isFinite(p.z), 'NaN');
});

test('collision: dua rintangan berdekatan tidak membuat pemain tembus', () => {
  const cs = [{ x: 0, z: 0, r: 1 }, { x: 1.5, z: 0, r: 1 }];
  const p = { x: 0.75, z: 0.1 };
  collision.resolveColliders(p, 0.4, cs);
  for (const c of cs) ok(Math.hypot(p.x - c.x, p.z - c.z) >= c.r + 0.4 - 0.15, 'masih menembus rintangan');
});

test('collision: clampToWorld menahan di tepi dunia', () => {
  const p = { x: 100, z: 0 };
  collision.clampToWorld(p, 0.4, 38);
  near(Math.hypot(p.x, p.z), 37.6, 1e-9);
  const q = { x: 5, z: 5 };
  collision.clampToWorld(q, 0.4, 38);
  eq(q.x, 5);
});

test('movement: maju (my=1) pada yaw 0 menuju -Z; kanan menuju +X', () => {
  const f = movement.moveDirection(0, 0, 1);
  near(f.x, 0, 1e-9);
  near(f.z, -1, 1e-9);
  const r = movement.moveDirection(0, 1, 0);
  near(r.x, 1, 1e-9);
  near(r.z, 0, 1e-9);
});

test('movement: arah mengikuti kamera saat yaw berubah 90°', () => {
  const f = movement.moveDirection(Math.PI / 2, 0, 1);
  near(f.x, -1, 1e-9);
  near(f.z, 0, 1e-9);
});

test('movement: arah kamera ke target selalu = arah maju', () => {
  for (const yaw of [0, 0.7, 2.1, -1.4, 3.0]) {
    const off = cam.cameraOffset(yaw, 0.4, 5);
    const toTarget = { x: -off.x, z: -off.z };
    const len = Math.hypot(toTarget.x, toTarget.z);
    const f = movement.moveDirection(yaw, 0, 1);
    near(f.x, toTarget.x / len, 1e-9, `x yaw ${yaw}`);
    near(f.z, toTarget.z / len, 1e-9, `z yaw ${yaw}`);
  }
});

test('movement: lerpAngle lewat jalur terpendek dan terjepit 0..1', () => {
  near(movement.lerpAngle(3.0, -3.0, 1), -3.0 + Math.PI * 2, 1e-9);
  near(movement.lerpAngle(0, 1, 0), 0);
  near(movement.lerpAngle(0, 1, 5), 1); // t > 1 dijepit
});

test('movement: joystick — zona mati, arah maju, dan batas 1', () => {
  const dead = movement.joystickVector(2, 2, 50);
  eq(dead.x + dead.y, 0, 'zona mati');
  const up = movement.joystickVector(0, -50, 50);
  near(up.x, 0, 1e-9);
  near(up.y, 1, 1e-9);
  const far = movement.joystickVector(300, 0, 50);
  near(Math.hypot(far.x, far.y), 1, 1e-9);
  eq(movement.joystickVector(0, 0, 50).x, 0);
});

test('kamera: pitch dijepit dan offset berjarak tepat', () => {
  eq(cam.clampPitch(-5), cam.CAMERA.minPitch);
  eq(cam.clampPitch(5), cam.CAMERA.maxPitch);
  const o = cam.cameraOffset(1.1, 0.5, 7.5);
  near(Math.hypot(o.x, o.y, o.z), 7.5, 1e-9);
});

test('grafis: tiga level ada; gameplay sama (preset hanya visual)', () => {
  eq(quality.QUALITY_LEVELS.join(), 'low,medium,high');
  for (const l of quality.QUALITY_LEVELS) {
    const p = quality.QUALITY_PRESETS[l];
    ok(p && typeof p.maxPixelRatio === 'number' && typeof p.shadows === 'boolean', `preset ${l} rusak`);
  }
  eq(quality.QUALITY_PRESETS.low.shadows, false);
  eq(quality.pixelRatioFor('low', 3), 1);
  eq(quality.pixelRatioFor('high', 3), 2);
  eq(quality.pixelRatioFor('medium', 1), 1);
  eq(quality.pixelRatioFor('nonsense', 1), 1);
});

test('grafis: deteksi level awal masuk akal', () => {
  eq(quality.detectDefaultQuality({ hardwareConcurrency: 2 }), 'low');
  eq(quality.detectDefaultQuality({ deviceMemory: 2 }), 'low');
  eq(quality.detectDefaultQuality({ hardwareConcurrency: 8, deviceMemory: 8, touch: true }), 'medium');
  eq(quality.detectDefaultQuality({ hardwareConcurrency: 16, deviceMemory: 8, touch: false }), 'high');
  eq(quality.detectDefaultQuality({}), 'medium');
});

test('config: 6 warna baju, hex valid dan unik', () => {
  eq(config.SHIRT_COLORS.length, 6);
  const set = new Set(config.SHIRT_COLORS.map((c) => c.hex));
  eq(set.size, 6, 'warna tidak unik;');
  for (const c of config.SHIRT_COLORS) ok(/^#[0-9a-f]{6}$/i.test(c.hex), 'hex tidak valid ' + c.hex);
});

// ------------------------------------------------------------------ laporan
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'LULUS ' : 'GAGAL '} ${r.name}${r.ok ? '' : '\n        → ' + r.err}`);
console.log(`\n${results.length - failed.length}/${results.length} lulus`);
console.log('CATATAN: ini uji Node (logika + konsistensi). Tidak menguji WebGL, tampilan, sentuhan, atau FPS.');
process.exit(failed.length ? 1 : 0);
