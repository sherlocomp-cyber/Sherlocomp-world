// Perkakas render bersama untuk dunia prosedural (Three.js). Dipakai Sickness Kingdom.
// animal-kingdom.js sengaja TIDAK diubah (sudah dilaporkan "bagus"); menyatukannya = tugas rapi-rapi nanti.

import * as THREE from 'three';

export const WHITE = '#ffffff';

export const lambert = (hex, extra = {}) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true, ...extra });

export function shadowed(mesh, cast = true, receive = false) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

/** Geser geometri ke atas agar alasnya berada di y=0. */
export function geo(g, ty = 0) {
  if (ty) g.translate(0, ty, 0);
  return g;
}

/** Satu InstancedMesh = satu draw call. Warna per instance lewat `c`. `heightAt` = fungsi tinggi medan dunia. */
export function instanced(heightAt, geometry, list, { cast = true, receive = false, material } = {}) {
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

export function starShape(outer = 0.42, inner = 0.18) {
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

export function buildClouds(rng) {
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
