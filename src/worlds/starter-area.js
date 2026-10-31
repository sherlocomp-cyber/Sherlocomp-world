// Area bermain kecil PHASE 1 ("Lembah Awal" Animal Kingdom): medan, pohon, kolam, rumah,
// papan petunjuk, dan 5 bintang koleksi. Semua prosedural low-poly (D-003).
// Tata letak deterministik (RNG berbenih) agar hasil uji bisa diulang.

import * as THREE from 'three';
import { WORLD_RADIUS } from '../core/config.js';
import { heightAt, POND, WATER_LEVEL } from '../core/terrain.js';
import { SPAWN, HUT, SIGN, STAR_POSITIONS } from './layout.js';

export { SPAWN, HUT, SIGN, STAR_POSITIONS };

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lambert = (hex, extra = {}) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true, ...extra });

function shadowed(m, cast = true, receive = false) {
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function buildGround() {
  const size = WORLD_RADIUS * 2 + 24;
  const geo = new THREE.PlaneGeometry(size, size, 80, 80);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const grassA = new THREE.Color('#6cc25a');
  const grassB = new THREE.Color('#58a84c');
  const hillC = new THREE.Color('#4a9446');
  const sand = new THREE.Color('#dcc78e');
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = heightAt(x, z);
    pos.setY(i, y);
    const n = (Math.sin(x * 1.7) * Math.cos(z * 1.3) + 1) / 2; // variasi rumput
    tmp.copy(grassA).lerp(grassB, n);
    const r = Math.hypot(x, z);
    tmp.lerp(hillC, Math.min(1, Math.max(0, (r - 26) / 18)));
    const dPond = Math.hypot(x - POND.x, z - POND.z);
    if (dPond < POND.radius + 1.4) tmp.lerp(sand, Math.min(1, (POND.radius + 1.4 - dPond) / 2.2));
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  ground.receiveShadow = true;
  ground.name = 'ground';
  return ground;
}

function buildStarShape(outer = 0.42, inner = 0.18) {
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

/**
 * @param {{collectedIds?:number[]}} [opts]
 */
export function buildStarterArea({ collectedIds = [] } = {}) {
  const rng = mulberry32(20261031);
  const group = new THREE.Group();
  group.name = 'starter-area';
  const colliders = [];
  const placed = []; // lingkaran terpakai untuk penempatan dekor

  group.add(buildGround());

  // --- air kolam ---
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(POND.radius + 2, 24),
    new THREE.MeshLambertMaterial({ color: '#4aa8e0', transparent: true, opacity: 0.85 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(POND.x, WATER_LEVEL + 0.04, POND.z);
  water.name = 'water';
  group.add(water);
  colliders.push({ x: POND.x, z: POND.z, r: 3.7 });
  placed.push({ x: POND.x, z: POND.z, r: POND.radius + 2.5 });

  // zona terlarang untuk dekor acak
  placed.push({ x: SPAWN.x, z: SPAWN.z, r: 5 });
  placed.push({ x: HUT.x, z: HUT.z, r: 4 });
  placed.push({ x: SIGN.x, z: SIGN.z, r: 2 });
  for (const s of STAR_POSITIONS) placed.push({ x: s.x, z: s.z, r: 1.6 });

  function place(minR, maxR, clearance) {
    for (let i = 0; i < 40; i++) {
      const a = rng() * Math.PI * 2;
      const r = minR + rng() * (maxR - minR);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (placed.every((p) => Math.hypot(p.x - x, p.z - z) > p.r + clearance)) {
        placed.push({ x, z, r: clearance });
        return { x, z };
      }
    }
    return null;
  }

  // --- pohon bulat & palem ---
  const trunkMat = lambert('#7a5232');
  const leafMats = [lambert('#3f9d4a'), lambert('#4fae52'), lambert('#34894a')];
  const palmLeafMat = lambert('#3da552');
  for (let i = 0; i < 38; i++) {
    const p = place(12, WORLD_RADIUS - 3, 1.2);
    if (!p) continue;
    const y = heightAt(p.x, p.z);
    const tree = new THREE.Group();
    tree.position.set(p.x, y, p.z);
    tree.rotation.y = rng() * Math.PI * 2;
    if (rng() < 0.4) {
      const h = 3 + rng() * 1.2;
      const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, h, 6), trunkMat));
      trunk.position.y = h / 2;
      trunk.rotation.z = (rng() - 0.5) * 0.18;
      tree.add(trunk);
      for (let k = 0; k < 6; k++) {
        const leaf = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.28, 2, 4), palmLeafMat));
        leaf.position.y = h;
        leaf.rotation.order = 'YXZ';
        leaf.rotation.y = (k / 6) * Math.PI * 2;
        leaf.rotation.x = Math.PI / 2.4; // menjulur keluar & agak turun
        leaf.translateY(0.95);
        tree.add(leaf);
      }
    } else {
      const h = 1.1 + rng() * 0.6;
      const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, h, 6), trunkMat));
      trunk.position.y = h / 2;
      tree.add(trunk);
      const s = 1 + rng() * 0.5;
      const crown = shadowed(new THREE.Mesh(new THREE.IcosahedronGeometry(1.15 * s, 0), leafMats[i % leafMats.length]));
      crown.position.y = h + 0.8 * s;
      tree.add(crown);
    }
    group.add(tree);
    colliders.push({ x: p.x, z: p.z, r: 0.45 });
  }

  // --- batu ---
  const rockMat = lambert('#8c8f98');
  for (let i = 0; i < 14; i++) {
    const p = place(8, WORLD_RADIUS - 4, 0.9);
    if (!p) continue;
    const s = 0.5 + rng() * 0.8;
    const rock = shadowed(new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), rockMat), true, true);
    rock.scale.set(1, 0.7 + rng() * 0.4, 1);
    rock.position.set(p.x, heightAt(p.x, p.z) + s * 0.4, p.z);
    rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    group.add(rock);
    colliders.push({ x: p.x, z: p.z, r: s * 0.85 });
  }

  // --- rumah ---
  {
    const g = new THREE.Group();
    const gy = heightAt(HUT.x, HUT.z);
    g.position.set(HUT.x, gy, HUT.z);
    g.rotation.y = -0.5;
    const walls = shadowed(new THREE.Mesh(new THREE.BoxGeometry(HUT.half * 2, 2.1, HUT.half * 2), lambert('#ead6a8')), true, true);
    walls.position.y = 1.05;
    g.add(walls);
    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(HUT.half * 1.65, 1.5, 4), lambert('#b8553a')));
    roof.position.y = 2.1 + 0.75;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.1), lambert('#6a4326'));
    door.position.set(0, 0.65, HUT.half + 0.03);
    g.add(door);
    for (const side of [-1, 1]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), lambert('#8fd0ee'));
      win.position.set(side * 1.0, 1.35, HUT.half + 0.03);
      g.add(win);
    }
    group.add(g);
    colliders.push({ x: HUT.x, z: HUT.z, r: HUT.half * 1.38 });
  }

  // --- papan petunjuk ---
  {
    const g = new THREE.Group();
    g.position.set(SIGN.x, heightAt(SIGN.x, SIGN.z), SIGN.z);
    g.rotation.y = 0.4;
    const post = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 6), lambert('#7a5232')));
    post.position.y = 0.75;
    g.add(post);
    const board = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.62, 0.08), lambert('#d9a35c')));
    board.position.y = 1.4;
    g.add(board);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.09), lambert('#7a5232'));
    stripe.position.set(0, 1.4, 0.01);
    g.add(stripe);
    group.add(g);
    colliders.push({ x: SIGN.x, z: SIGN.z, r: 0.25 });
  }

  // --- pagar kecil di dekat rumah ---
  {
    const postMat = lambert('#8a5f38');
    const x0 = HUT.x - 7;
    const z0 = HUT.z + 3;
    for (let i = 0; i < 7; i++) {
      const x = x0 + i * 1.0;
      const z = z0 + Math.sin(i * 0.6) * 0.2;
      const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.14), postMat));
      post.position.set(x, heightAt(x, z) + 0.45, z);
      group.add(post);
      colliders.push({ x, z, r: 0.2 });
      if (i < 6) {
        const rail = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.06), postMat));
        rail.position.set(x + 0.5, heightAt(x + 0.5, z) + 0.62, z);
        group.add(rail);
      }
    }
    placed.push({ x: x0 + 3, z: z0, r: 4.2 });
  }

  // --- bunga (satu InstancedMesh) ---
  {
    const N = 90;
    const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.13, 0), lambert('#ffffff'), N);
    const palette = ['#ff7aa8', '#ffd54a', '#ffffff', '#b58cff', '#ff9a4a'].map((c) => new THREE.Color(c));
    const m = new THREE.Matrix4();
    let n = 0;
    for (let i = 0; i < N * 3 && n < N; i++) {
      const a = rng() * Math.PI * 2;
      const r = 3 + rng() * 26;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = heightAt(x, z);
      if (y < WATER_LEVEL + 0.3) continue;
      if (Math.hypot(x - POND.x, z - POND.z) < POND.radius + 1.5) continue;
      m.makeTranslation(x, y + 0.14, z);
      flowers.setMatrixAt(n, m);
      flowers.setColorAt(n, palette[n % palette.length]);
      n++;
    }
    flowers.count = n;
    flowers.instanceMatrix.needsUpdate = true;
    if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
    group.add(flowers);
  }

  // --- awan ---
  const clouds = new THREE.Group();
  clouds.name = 'clouds';
  {
    const cloudMat = new THREE.MeshLambertMaterial({ color: '#ffffff', flatShading: true });
    for (let i = 0; i < 7; i++) {
      const c = new THREE.Group();
      const blobs = 3 + Math.floor(rng() * 3);
      for (let k = 0; k < blobs; k++) {
        const b = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + rng() * 1.8, 0), cloudMat);
        b.position.set(k * 2.6 - blobs * 1.3, rng() * 0.8, rng() * 1.6);
        b.scale.y = 0.6;
        c.add(b);
      }
      const a = (i / 7) * Math.PI * 2 + rng();
      c.position.set(Math.cos(a) * 55, 32 + rng() * 10, Math.sin(a) * 55);
      c.userData.speed = 0.4 + rng() * 0.5;
      clouds.add(c);
    }
    group.add(clouds);
  }

  // --- bintang koleksi ---
  const starGeo = new THREE.ExtrudeGeometry(buildStarShape(), { depth: 0.14, bevelEnabled: false });
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

  // --- objek yang bisa diajak berinteraksi (tombol E / tombol sentuh) ---
  const interactables = [
    {
      id: 'sign',
      x: SIGN.x,
      z: SIGN.z,
      radius: 2.4,
      prompt: 'Baca papan',
      message: 'Selamat datang di Kerajaan Hewan! Kumpulkan 5 bintang di lembah ini.',
    },
    {
      id: 'hut',
      x: HUT.x,
      z: HUT.z,
      radius: 3.4,
      prompt: 'Ketuk pintu',
      message: 'Tok tok tok… Rumah ini masih kosong. Penghuninya akan datang nanti.',
    },
  ];

  function update(dt, t) {
    for (const s of stars) {
      if (s.collected) continue;
      s.mesh.rotation.y = t * 1.8;
      s.mesh.position.y = s.baseY + Math.sin(t * 2.2 + s.id) * 0.15;
    }
    for (const c of clouds.children) {
      c.position.x += c.userData.speed * dt;
      if (c.position.x > 70) c.position.x = -70;
    }
  }

  return { group, colliders, stars, interactables, clouds, update };
}
