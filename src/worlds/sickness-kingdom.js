// SICKNESS KINGDOM "Kota Sehat" (PHASE 2 tahap B): hub, 5 wilayah, jalan setapak. Tanpa air.
// Prosedural low-poly (D-003). Dekor banyak dirender lewat InstancedMesh agar draw call sedikit.
// Data posisi berasal dari sickness-layout.js / sickness-plan.js (murni, teruji di Node).
// BELUM diuji di WebGL/perangkat nyata — lihat TEST_REPORT.md.

import * as THREE from 'three';
import bab3 from '../data/lessons/bab3-penyakit.json';
import { heightAt } from '../core/terrain-sickness.js';
import {
  WORLD, SPAWN, HUB, MONUMENT, HUB_SIGN, HUB_MESSAGE, ZONES, STATIONS, ZONE_SIGNS,
  STAR_POSITIONS, FIXED_COLLIDERS, distToPath, zoneAt, entranceAngle,
} from './sickness-layout.js';
import { buildPlan, mulberry32 } from './sickness-plan.js';
import { healthImageFile, healthSize, HEALTH_PEDESTAL_TOP } from './sickness-art.js';
import { lambert, shadowed, instanced as inst, geo, starShape, buildClouds } from './world-kit.js';
import { ASSET_BASE } from '../core/config.js';

export { SPAWN, zoneAt };

const STARS_KEY = 'p2.sickness.stars';
const PLUS_GREEN = '#2fae5f'; // tanda tambah HIJAU (D-014): bukan simbol merah
const instanced = (...args) => inst(heightAt, ...args);

function buildGround() {
  const seg = 128;
  const size = WORLD.radius * 2 + 24;
  const g = new THREE.PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const grassA = new THREE.Color('#7ccf6c');
  const grassB = new THREE.Color('#68bb5e');
  const hillC = new THREE.Color('#58a653');
  const paving = new THREE.Color('#d9d4c4');
  const walk = new THREE.Color('#d8cfae');
  const zoneCols = ZONES.map((z) => new THREE.Color(z.ground));
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, heightAt(x, z));
    const n = (Math.sin(x * 1.7) * Math.cos(z * 1.3) + 1) / 2;
    tmp.copy(grassA).lerp(grassB, n);
    const r = Math.hypot(x, z);
    tmp.lerp(hillC, Math.min(1, Math.max(0, (r - 30) / 40)));
    ZONES.forEach((zone, k) => {
      const d = Math.hypot(x - zone.x, z - zone.z);
      const w = 1 - Math.min(1, Math.max(0, (d - zone.r * 0.75) / (zone.r * 0.5)));
      if (w > 0) tmp.lerp(zoneCols[k], w * (0.55 + 0.45 * n));
    });
    const dHub = Math.hypot(x - HUB.x, z - HUB.z);
    if (dHub < HUB.r + 2) tmp.lerp(paving, Math.min(1, (HUB.r + 2 - dHub) / 4) * 0.85);
    const dp = distToPath(x, z);
    if (dp < 3.6) tmp.lerp(walk, Math.min(1, (3.6 - dp) / 1.6) * 0.9);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const ground = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  ground.receiveShadow = true;
  ground.name = 'ground';
  return ground;
}

/** Tanda tambah hijau (dua balok). Menghadap +Z lokal. */
function plusSign(size, depth = 0.12) {
  const g = new THREE.Group();
  const m = lambert(PLUS_GREEN);
  g.add(new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.28, depth), m));
  g.add(new THREE.Mesh(new THREE.BoxGeometry(size * 0.28, size, depth), m));
  return g;
}

function box(w, h, d, color, x, y, z, opts = {}) {
  const mesh = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), opts.material || lambert(color)), opts.cast ?? true, opts.receive ?? false);
  mesh.position.set(x, y, z);
  return mesh;
}

/** Landmark tiap wilayah. Sisi depan (+Z lokal) menghadap hub. */
function landmark(zone) {
  const g = new THREE.Group();
  g.position.set(zone.x, heightAt(zone.x, zone.z), zone.z);
  g.rotation.y = Math.PI / 2 - entranceAngle(zone);

  if (zone.id === 'rumah-sakit') {
    g.add(box(10.4, 4.6, 5.6, '#f2efe6', 0, 2.3, 0, { receive: true }));
    g.add(box(10.8, 0.5, 6.0, '#5fbf9f', 0, 4.85, 0));
    g.add(box(3.0, 1.2, 2.6, '#e8f4ee', 0, 5.7, 0));
    g.add(box(2.0, 2.6, 0.12, '#7fc8e8', 0, 1.3, 2.86, { cast: false }));
    for (const x of [-4.1, -2.5, 2.5, 4.1]) g.add(box(1.3, 1.1, 0.1, '#9fd6ee', x, 2.6, 2.83, { cast: false }));
    const plus = plusSign(1.4);
    plus.position.set(0, 3.75, 2.86);
    g.add(plus);
  } else if (zone.id === 'apotek') {
    g.add(box(7.0, 3.6, 5.0, '#f6efe0', 0, 1.8, 0, { receive: true }));
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(5.2, 2.0, 4), lambert('#4d9e86')));
    roof.position.y = 3.6 + 1.0;
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.8;
    g.add(roof);
    g.add(box(1.6, 2.3, 0.12, '#8ec9a8', 0.6, 1.15, 2.56, { cast: false }));
    g.add(box(3.2, 0.15, 1.2, PLUS_GREEN, 0.6, 2.6, 3.0));
    g.add(box(1.2, 1.0, 0.1, '#9fd6ee', 2.6, 2.0, 2.53, { cast: false }));
    const plus = plusSign(1.1);
    plus.position.set(-2.3, 2.3, 2.56);
    g.add(plus);
  } else if (zone.id === 'taman-kepala') {
    const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 0.4, 10), lambert('#cfc8b6')), true, true);
    base.position.y = 0.2;
    const shaft = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 5.0, 8), lambert('#efe6d0')));
    shaft.position.y = 2.9;
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.12, 16), lambert('#ffffff'));
    face.rotation.x = Math.PI / 2;
    face.position.set(0, 4.6, 1.34);
    const handA = box(0.08, 0.55, 0.06, '#40464f', 0, 4.72, 1.42, { cast: false });
    const handB = box(0.45, 0.08, 0.06, '#40464f', 0.2, 4.6, 1.42, { cast: false });
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.8, 8), lambert('#e0a93a')));
    roof.position.y = 5.4 + 0.9;
    g.add(base, shaft, face, handA, handB, roof);
  } else if (zone.id === 'taman-perut') {
    const floor = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.25, 12), lambert('#e8dcc4')), false, true);
    floor.position.y = 0.125;
    g.add(floor);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const post = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.6, 6), lambert('#f5efe0')));
      post.position.set(Math.cos(a) * 2.3, 1.55, Math.sin(a) * 2.3);
      g.add(post);
    }
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.5, 6), lambert('#e08a4a')));
    roof.position.y = 2.85 + 0.75;
    g.add(roof);
  } else if (zone.id === 'taman-flu') {
    const glass = new THREE.MeshLambertMaterial({ color: '#bfeee0', transparent: true, opacity: 0.45, flatShading: true });
    g.add(box(5.4, 2.6, 3.8, '#bfeee0', 0, 1.3, 0, { material: glass, cast: false }));
    // atap prisma: sumbu panjang sepanjang X, puncak ke atas
    const prism = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 5.4, 3), glass);
    prism.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    prism.position.y = 2.6 + 1.1;
    g.add(prism);
    g.add(box(1.2, 2.0, 0.1, '#6fb08a', 0, 1.0, 1.92, { cast: false }));
    for (const [x, z] of [[-1.5, -0.6], [0.2, 0.5], [1.6, -0.4]]) {
      const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), lambert('#4aa050'));
      plant.position.set(x, 0.5, z);
      g.add(plant);
    }
  }
  return g;
}

function buildMonument() {
  const g = new THREE.Group();
  g.position.set(MONUMENT.x, heightAt(MONUMENT.x, MONUMENT.z), MONUMENT.z);
  const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 10), lambert('#cfc8b6')), true, true);
  base.position.y = 0.25;
  const pillar = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 3.0, 8), lambert('#e9e2cf')));
  pillar.position.y = 2.0;
  const plus = plusSign(1.0, 0.3);
  plus.position.set(0, 4.0, 0);
  g.add(base, pillar, plus);
  return g;
}

export function buildSicknessKingdom({ collectedIds = [] } = {}) {
  const rng = mulberry32(20261031);
  const group = new THREE.Group();
  group.name = 'sickness-kingdom';
  const plan = buildPlan();
  const colliders = [...FIXED_COLLIDERS, ...plan.colliders];

  group.add(buildGround());

  // ---- landmark + tugu
  group.add(buildMonument());
  for (const zone of ZONES) group.add(landmark(zone));

  // ---- dekor instanced
  const I = plan.items;
  const add = (m) => m && group.add(m);
  add(instanced(geo(new THREE.CylinderGeometry(0.12, 0.2, 1, 6), 0.5), I.trunk));
  add(instanced(new THREE.IcosahedronGeometry(1, 0), I.crown));
  add(instanced(new THREE.IcosahedronGeometry(1, 0), I.bush, { cast: false }));
  add(instanced(new THREE.IcosahedronGeometry(0.13, 0), I.flower, { cast: false }));
  add(instanced(geo(new THREE.ConeGeometry(0.12, 0.5, 4), 0.25), I.tuft, { cast: false }));
  add(instanced(new THREE.DodecahedronGeometry(1, 0), I.rock, { receive: true }));
  add(instanced(geo(new THREE.BoxGeometry(1.6, 0.55, 0.6), 0.275), I.bench));
  add(instanced(geo(new THREE.BoxGeometry(1.5, 0.5, 0.8), 0.25), I.planter));
  add(instanced(new THREE.IcosahedronGeometry(0.2, 0), I.lampHead, { cast: false, material: lambert('#ffffff', { emissive: '#8a7a30' }) }));

  // ---- pedestal tempat kata + gambar kosakata di atasnya (billboard; selalu menghadap kamera)
  const pedestals = STATIONS.map((s) => ({ x: s.x, z: s.z, oy: 0.18, sx: 1, sy: 1, sz: 1, c: '#d9d2bf' }));
  const rings = STATIONS.map((s) => ({ x: s.x, z: s.z, oy: 0.4, sx: 1, sy: 1, sz: 1, c: ZONES.find((z) => z.id === s.zoneId).color }));
  add(instanced(new THREE.CylinderGeometry(0.7, 0.85, 0.36, 10), pedestals, { receive: true }));
  add(instanced(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 10), rings, { cast: false }));

  const loader = new THREE.TextureLoader();
  for (const s of STATIONS) {
    const file = healthImageFile(s.vocabId);
    if (!file) continue;
    const mat = new THREE.SpriteMaterial({ transparent: true, alphaTest: 0.35, fog: true });
    loader.load(ASSET_BASE + 'images/health/' + file, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.needsUpdate = true;
    });
    const size = healthSize(s.vocabId);
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(0.5, 0); // alas gambar tepat di atas pedestal
    sprite.scale.set(size, size, 1);
    sprite.position.set(s.x, heightAt(s.x, s.z) + HEALTH_PEDESTAL_TOP, s.z);
    sprite.name = 'health-' + s.vocabId;
    group.add(sprite);
  }

  // ---- papan wilayah + papan hub
  const signList = [...ZONE_SIGNS, { zoneId: 'hub', x: HUB_SIGN.x, z: HUB_SIGN.z, ry: 0.3 }];
  add(instanced(geo(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 6), 0.75), signList.map((s) => ({ x: s.x, z: s.z, ry: s.ry, c: '#7a5232' }))));
  add(
    instanced(
      geo(new THREE.BoxGeometry(1.4, 0.64, 0.08), 1.4),
      signList.map((s) => ({ x: s.x, z: s.z, ry: s.ry, c: s.zoneId === 'hub' ? '#d9a35c' : ZONES.find((z) => z.id === s.zoneId).color })),
    ),
  );

  // ---- awan
  const clouds = buildClouds(rng);
  group.add(clouds.mesh);

  // ---- bintang koleksi (satu per wilayah)
  const starGeo = new THREE.ExtrudeGeometry(starShape(), { depth: 0.14, bevelEnabled: false });
  starGeo.translate(0, 0, -0.07);
  const starMat = new THREE.MeshLambertMaterial({ color: '#ffd23f', emissive: '#a67800', flatShading: true });
  const stars = STAR_POSITIONS.map((p, id) => {
    const mesh = new THREE.Mesh(starGeo, starMat);
    const baseY = heightAt(p.x, p.z) + 1.0;
    mesh.position.set(p.x, baseY, p.z);
    mesh.castShadow = true;
    const star = { id, x: p.x, z: p.z, baseY, mesh, collected: collectedIds.includes(id) };
    mesh.visible = !star.collected;
    group.add(mesh);
    return star;
  });

  // ---- objek interaktif: papan, tugu peta, tempat kata (Indonesia saja; teks Arab = PHASE 3)
  const names = Object.fromEntries([...bab3.vocab].map((v) => [v.id, v.id_text]));
  const interactables = [
    { id: 'hub-sign', x: HUB_SIGN.x, z: HUB_SIGN.z, radius: 2.6, prompt: 'Baca peta', message: HUB_MESSAGE },
    ...ZONE_SIGNS.map((s) => {
      const zone = ZONES.find((z) => z.id === s.zoneId);
      const list = zone.vocab.map((v) => names[v]).filter(Boolean).join(', ');
      return { id: 'sign-' + zone.id, x: s.x, z: s.z, radius: 2.6, prompt: 'Baca papan', message: `${zone.name}: belajar kata ${list}.` };
    }),
    ...STATIONS.map((s) => ({
      id: 'station-' + s.vocabId,
      x: s.x,
      z: s.z,
      radius: 2.2,
      prompt: 'Lihat tempat',
      message: `Kata baru: ${names[s.vocabId] || '...'}`,
    })),
  ];

  function update(dt, t) {
    for (const s of stars) {
      if (s.collected) continue;
      s.mesh.rotation.y = t * 1.8;
      s.mesh.position.y = s.baseY + Math.sin(t * 2.2 + s.id) * 0.15;
    }
    clouds.update(dt);
  }

  return {
    id: 'sickness',
    group,
    colliders,
    stars,
    interactables,
    clouds: clouds.mesh,
    update,
    heightAt,
    radius: WORLD.radius,
    spawn: SPAWN,
    zoneAt,
    starsKey: STARS_KEY,
    atmosphere: { background: '#a8e0e8', fog: '#c8ecee' },
  };
}
