// Karakter pemain prosedural low-poly (D-003): tanpa model eksternal.
// Gaya mengikuti potret hero_boy / hero_girl: anak laki-laki berambut hitam dengan rompi,
// anak perempuan berhijab dengan tunik panjang. Model menghadap +Z.

import * as THREE from 'three';

const SKIN = '#f0b896';
const TROUSERS = '#3b4a63';
const SHOES = '#2a2a33';
const HAIR = '#15151c';
const VEST = '#cbbfa8';

function lambert(hex) {
  return new THREE.MeshLambertMaterial({ color: hex, flatShading: true });
}

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

/**
 * @param {{gender:'boy'|'girl', color:string}} opts
 * @returns {{group:THREE.Group, setColor:(hex:string)=>void, update:(dt:number, speed:number, airborne:boolean)=>void}}
 */
export function createHero({ gender = 'boy', color = '#3f7fd8' } = {}) {
  const isGirl = gender === 'girl';
  const group = new THREE.Group();
  group.name = 'hero';

  const shirtMat = lambert(color);
  const skinMat = lambert(SKIN);
  const trouserMat = lambert(TROUSERS);
  const shoeMat = lambert(SHOES);

  const body = new THREE.Group(); // bergoyang naik-turun saat berjalan
  group.add(body);

  // --- kaki (pivot di pinggul) ---
  const legs = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.1, 0.5, 0);
    pivot.add(mesh(new THREE.BoxGeometry(0.16, 0.5, 0.18), trouserMat, 0, -0.25, 0));
    pivot.add(mesh(new THREE.BoxGeometry(0.18, 0.1, 0.26), shoeMat, 0, -0.47, 0.04));
    group.add(pivot);
    legs.push(pivot);
  }

  // --- badan ---
  if (isGirl) {
    // tunik panjang: kerucut terpancung menutupi pinggul sampai lutut
    const tunic = mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.78, 8), shirtMat, 0, 0.62, 0);
    body.add(tunic);
  } else {
    body.add(mesh(new THREE.BoxGeometry(0.46, 0.5, 0.28), shirtMat, 0, 0.75, 0));
    for (const side of [-1, 1]) {
      body.add(mesh(new THREE.BoxGeometry(0.17, 0.42, 0.31), lambert(VEST), side * 0.15, 0.76, 0));
    }
  }

  // --- lengan (pivot di bahu) ---
  const arms = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.3, 0.97, 0);
    pivot.add(mesh(new THREE.BoxGeometry(0.12, 0.4, 0.12), shirtMat, 0, -0.2, 0));
    pivot.add(mesh(new THREE.SphereGeometry(0.07, 6, 5), skinMat, 0, -0.43, 0));
    body.add(pivot);
    arms.push(pivot);
  }

  // --- kepala ---
  const headY = 1.15;
  const head = new THREE.Group();
  head.position.set(0, headY, 0);
  head.add(mesh(new THREE.SphereGeometry(0.26, 10, 8), skinMat));

  const eyeMat = lambert('#14141c');
  for (const side of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.032, 6, 5), eyeMat, side * 0.095, 0.02, 0.235);
    eye.castShadow = false;
    head.add(eye);
  }

  if (isGirl) {
    // hijab: bola sedikit di belakang kepala sehingga wajah menyembul di depan
    const hijabMat = shirtMat;
    head.add(mesh(new THREE.SphereGeometry(0.31, 12, 10), hijabMat, 0, 0.01, -0.07));
    head.add(mesh(new THREE.CylinderGeometry(0.26, 0.36, 0.24, 10), hijabMat, 0, -0.27, -0.03));
  } else {
    const hair = mesh(new THREE.SphereGeometry(0.285, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.56), lambert(HAIR), 0, 0.025, -0.01);
    head.add(hair);
    head.add(mesh(new THREE.BoxGeometry(0.34, 0.07, 0.1), lambert(HAIR), 0.02, 0.17, 0.2)); // poni
  }
  body.add(head);

  // bayangan lembut di tanah (tetap tampil di grafis Rendah tanpa shadow map)
  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.34, 14),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.02;
  blob.name = 'blob-shadow';
  group.add(blob);

  let phase = 0;

  function update(dt, speed, airborne) {
    const moving = speed > 0.15 && !airborne;
    if (moving) phase += dt * (3 + speed * 1.15);
    const swing = moving ? Math.sin(phase) * Math.min(0.9, 0.35 + speed * 0.08) : 0;

    if (airborne) {
      arms[0].rotation.x = -2.2;
      arms[1].rotation.x = -2.2;
      legs[0].rotation.x = -0.35;
      legs[1].rotation.x = 0.45;
    } else {
      arms[0].rotation.x = swing;
      arms[1].rotation.x = -swing;
      legs[0].rotation.x = -swing;
      legs[1].rotation.x = swing;
    }
    body.position.y = moving ? Math.abs(Math.sin(phase)) * 0.04 : 0;
  }

  function setColor(hex) {
    shirtMat.color.set(hex);
  }

  return { group, setColor, update };
}
