// ANIMAL KINGDOM (PHASE 2): dunia luas dengan hub, 6 wilayah, jalan setapak, danau.
// Prosedural low-poly (D-003). Dekor banyak dirender lewat InstancedMesh agar draw call sedikit.
// Data posisi berasal dari animal-layout.js / animal-plan.js (murni, teruji di Node).
// BELUM diuji di WebGL/perangkat nyata — lihat TEST_REPORT.md.

import * as THREE from 'three';
import bab2 from '../data/lessons/bab2-hewan.json';
import { heightAt, WATER_LEVEL } from '../core/terrain-animal.js';
import {
  WORLD, SPAWN, HUB, MONUMENT, HUB_SIGN, HUB_MESSAGE, ZONES, LAKE, STATIONS, ZONE_SIGNS,
  STAR_POSITIONS, FIXED_COLLIDERS, distToPath, zoneAt,
} from './animal-layout.js';
import { buildPlan, mulberry32 } from './animal-plan.js';
import { animalImageFile, animalSize, ANIMAL_PEDESTAL_TOP } from './animal-art.js';
import { ASSET_BASE } from '../core/config.js';

export { SPAWN, zoneAt };

const STARS_KEY = 'p2.animal.stars';

const lambert = (hex, extra = {}) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true, ...extra });
const WHITE = '#ffffff';

function shadowed(mesh, cast = true, receive = false) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

/** Satu InstancedMesh = satu draw call. Warna per instance lewat `c`. */
function instanced(geometry, list, { cast = true, receive = false, material } = {}) {
  if (!list.length) return null;
  const mesh = new THREE.InstancedMesh(geometry, material || lambert(WHITE), list.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const col = new THREE.Color();
  list.forEach((it, i) => {
    e.set(it.rx || 0, it.ry || 0, it.rz || 0);
    q.setFromEuler(e);
    p.set(it.x, heightAt(it.x, it.z) + (it.oy || 0), it.z);
    s.set(it.sx ?? 1, it.sy ?? 1, it.sz ?? 1);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, col.set(it.c || WHITE));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

function geo(g, ty = 0) {
  if (ty) g.translate(0, ty, 0);
  return g;
}

function buildGround() {
  const seg = 128;
  const size = WORLD.radius * 2 + 24;
  const g = new THREE.PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const grassA = new THREE.Color('#6cc25a');
  const grassB = new THREE.Color('#58a84c');
  const hillC = new THREE.Color('#4a9446');
  const stone = new THREE.Color('#bdb7a6');
  const dirt = new THREE.Color('#c9a56b');
  const sand = new THREE.Color('#dcc78e');
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
    if (dHub < HUB.r + 2) tmp.lerp(stone, Math.min(1, (HUB.r + 2 - dHub) / 4) * 0.85);
    const dp = distToPath(x, z);
    if (dp < 3.6) tmp.lerp(dirt, Math.min(1, (3.6 - dp) / 1.6) * 0.9);
    const dl = Math.hypot(x - LAKE.x, z - LAKE.z);
    if (dl < LAKE.colliderR + 3.5) tmp.lerp(sand, Math.min(1, (LAKE.colliderR + 3.5 - dl) / 3.5));
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

function starShape(outer = 0.42, inner = 0.18) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

/** Landmark tiap wilayah + tugu hub. Setiap fungsi mengembalikan Group. */
function landmark(kind, zone) {
  const g = new THREE.Group();
  const y = heightAt(zone.x, zone.z);
  g.position.set(zone.x, y, zone.z);
  if (kind === 'savana') {
    const rockM = lambert('#9c8f78');
    const a = shadowed(new THREE.Mesh(new THREE.DodecahedronGeometry(2.6, 0), rockM), true, true);
    a.scale.set(1, 0.9, 1);
    a.position.y = 1.7;
    const b = shadowed(new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 0), rockM), true, true);
    b.position.set(0.6, 4.1, -0.3);
    const c = shadowed(new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), rockM), true, true);
    c.position.set(-1.9, 1.0, 1.2);
    g.add(a, b, c);
  } else if (kind === 'hutan') {
    const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 6.5, 8), lambert('#6a4528')));
    trunk.position.y = 3.25;
    const crownM = lambert('#2c6e36');
    const c1 = shadowed(new THREE.Mesh(new THREE.IcosahedronGeometry(4.4, 0), crownM));
    c1.position.y = 8.2;
    const c2 = shadowed(new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 0), lambert('#35803f')));
    c2.position.set(2.6, 6.4, 1.2);
    g.add(trunk, c1, c2);
  } else if (kind === 'peternakan') {
    g.rotation.y = -0.4;
    const walls = shadowed(new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.4, 5), lambert('#c2493a')), true, true);
    walls.position.y = 1.7;
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(4.9, 2.2, 4), lambert('#5a4636')));
    roof.position.y = 3.4 + 1.1;
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.8;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.3, 0.12), lambert('#f1e7d0'));
    door.position.set(0, 1.15, 2.53);
    g.add(walls, roof, door);
  } else if (kind === 'gurun') {
    const mesa = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.6, 5.2, 6), lambert('#c98f58')), true, true);
    mesa.position.y = 2.6;
    const top = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.4, 0.7, 6), lambert('#d9a76c')));
    top.position.y = 5.4;
    g.add(mesa, top);
  } else if (kind === 'taman-burung') {
    const baseM = lambert('#e8dcc4');
    const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.3, 12), baseM), false, true);
    base.position.y = 0.15;
    g.add(base);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const post = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 6), lambert('#f5efe0')));
      post.position.set(Math.cos(a) * 2.1, 1.6, Math.sin(a) * 2.1);
      g.add(post);
    }
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.6, 6), lambert('#b074e0')));
    roof.position.y = 3.7;
    g.add(roof);
  }
  return g;
}

function buildMonument() {
  const g = new THREE.Group();
  g.position.set(MONUMENT.x, heightAt(MONUMENT.x, MONUMENT.z), MONUMENT.z);
  const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 10), lambert('#cfc8b6')), true, true);
  base.position.y = 0.25;
  const pillar = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 3.2, 8), lambert('#e9e2cf')));
  pillar.position.y = 2.1;
  g.add(base, pillar);
  return g;
}

function buildClouds(rng) {
  const blobs = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rng();
    const cx = Math.cos(a) * (60 + rng() * 40);
    const cz = Math.sin(a) * (60 + rng() * 40);
    const cy = 36 + rng() * 12;
    const speed = 0.4 + rng() * 0.5;
    const n = 3 + Math.floor(rng() * 3);
    for (let k = 0; k < n; k++) {
      blobs.push({ x: cx + k * 2.6 - n * 1.3, y: cy + rng() * 0.8, z: cz + rng() * 1.6, s: 2 + rng() * 1.8, speed });
    }
  }
  const mesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshLambertMaterial({ color: '#ffffff', flatShading: true }),
    blobs.length,
  );
  mesh.name = 'clouds';
  mesh.frustumCulled = false; // posisi digeser tiap frame
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const write = () => {
    blobs.forEach((b, i) => {
      p.set(b.x, b.y, b.z);
      s.set(b.s, b.s * 0.6, b.s);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  write();
  return {
    mesh,
    update(dt) {
      for (const b of blobs) {
        b.x += b.speed * dt;
        if (b.x > 150) b.x = -150;
      }
      write();
    },
  };
}

export function buildAnimalKingdom({ collectedIds = [] } = {}) {
  const rng = mulberry32(20261101);
  const group = new THREE.Group();
  group.name = 'animal-kingdom';
  const plan = buildPlan();
  const colliders = [...FIXED_COLLIDERS, ...plan.colliders]; // landmark-danau = penghalang air danau

  group.add(buildGround());

  // ---- air danau
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(LAKE.waterR, 32),
    new THREE.MeshLambertMaterial({ color: '#3f9de0', transparent: true, opacity: 0.85 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(LAKE.x, WATER_LEVEL + 0.04, LAKE.z);
  water.name = 'water';
  group.add(water);

  // ---- landmark + tugu
  group.add(buildMonument());
  for (const zone of ZONES) {
    if (zone.id === 'danau') continue;
    group.add(landmark(zone.id, zone));
  }

  // ---- dekor instanced
  const I = plan.items;
  const add = (m) => m && group.add(m);
  add(instanced(geo(new THREE.CylinderGeometry(0.12, 0.2, 1, 6), 0.5), I.trunk));
  add(instanced(new THREE.IcosahedronGeometry(1, 0), I.crown));
  add(instanced(new THREE.IcosahedronGeometry(1, 0), I.canopy));
  add(instanced(new THREE.DodecahedronGeometry(1, 0), I.rock, { receive: true }));
  add(instanced(geo(new THREE.ConeGeometry(0.12, 0.5, 4), 0.25), I.tuft, { cast: false }));
  add(instanced(geo(new THREE.ConeGeometry(0.05, 1.2, 4), 0.6), I.reed, { cast: false }));
  add(instanced(new THREE.IcosahedronGeometry(0.13, 0), I.flower, { cast: false }));
  add(instanced(geo(new THREE.CylinderGeometry(0.3, 0.35, 1, 7), 0.5), I.cactus));
  add(instanced(geo(new THREE.CylinderGeometry(0.2, 0.22, 1, 6), 0.5), I.arm));
  add(instanced(geo(new THREE.BoxGeometry(0.14, 1, 0.14), 0.5), I.post));
  add(instanced(new THREE.BoxGeometry(1.5, 0.08, 0.06), I.rail));
  add(instanced(new THREE.CylinderGeometry(0.6, 0.6, 0.9, 8), I.hay));
  add(instanced(new THREE.IcosahedronGeometry(1, 0), I.bush, { cast: false }));

  // ---- pedestal tempat hewan (hewan sungguhan = PHASE 3) + papan wilayah
  const pedestals = STATIONS.map((s) => ({ x: s.x, z: s.z, oy: 0.18, sx: 1, sy: 1, sz: 1, c: '#d9d2bf' }));
  const rings = STATIONS.map((s) => ({ x: s.x, z: s.z, oy: 0.4, sx: 1, sy: 1, sz: 1, c: ZONES.find((z) => z.id === s.zoneId).color }));
  add(instanced(new THREE.CylinderGeometry(0.7, 0.85, 0.36, 10), pedestals, { receive: true }));
  add(instanced(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 10), rings, { cast: false }));
  // ---- gambar hewan di atas pedestal (billboard; selalu menghadap kamera). Hewan 3D = PHASE 3.
  const loader = new THREE.TextureLoader();
  const animalSprites = [];
  for (const s of STATIONS) {
    const file = animalImageFile(s.vocabId);
    if (!file) continue;
    const mat = new THREE.SpriteMaterial({ transparent: true, alphaTest: 0.35, fog: true });
    loader.load(ASSET_BASE + 'images/animals/' + file, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.needsUpdate = true;
    });
    const size = animalSize(s.vocabId);
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(0.5, 0); // alas gambar tepat di atas pedestal
    sprite.scale.set(size, size, 1);
    sprite.position.set(s.x, heightAt(s.x, s.z) + ANIMAL_PEDESTAL_TOP, s.z);
    sprite.name = 'animal-' + s.vocabId;
    group.add(sprite);
    animalSprites.push(sprite);
  }

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

  // ---- objek interaktif: papan, tugu peta, tempat hewan
  const names = Object.fromEntries([...bab2.vocab, ...(bab2.extra_vocab || [])].map((v) => [v.id, v.id_text]));
  const interactables = [
    { id: 'hub-sign', x: HUB_SIGN.x, z: HUB_SIGN.z, radius: 2.6, prompt: 'Baca peta', message: HUB_MESSAGE },
    ...ZONE_SIGNS.map((s) => {
      const zone = ZONES.find((z) => z.id === s.zoneId);
      const list = zone.vocab.map((v) => names[v]).filter(Boolean).join(', ');
      return { id: 'sign-' + zone.id, x: s.x, z: s.z, radius: 2.6, prompt: 'Baca papan', message: `${zone.name}: tempat tinggal ${list}.` };
    }),
    ...STATIONS.map((s) => ({
      id: 'station-' + s.vocabId,
      x: s.x,
      z: s.z,
      radius: 2.2,
      prompt: 'Lihat tempat',
      message: `Ini ${names[s.vocabId] || 'hewan'}!`,
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
    id: 'animal',
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
  };
}
