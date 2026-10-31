// Inti permainan: renderer, scene, pemain, kamera orang ketiga, interaksi, bintang.
// PHASE 1: dunia "starter" (Lembah Awal). PHASE 2: dunia "animal" (Animal Kingdom), dipilih lewat opsi worldId.

import * as THREE from 'three';
import { PLAYER, WORLD_RADIUS } from '../core/config.js';
import { heightAt as starterHeightAt } from '../core/terrain.js';
import { resolveColliders, clampToWorld } from '../core/collision.js';
import { moveDirection, lerpAngle } from '../core/movement.js';
import { Input } from '../core/input.js';
import { QUALITY_PRESETS, pixelRatioFor } from '../core/quality.js';
import { checkBudget } from '../core/budget.js';
import { load, save } from '../core/storage.js';
import { createHero } from '../characters/hero.js';
import { buildStarterArea, SPAWN as STARTER_SPAWN } from '../worlds/starter-area.js';
import { buildAnimalKingdom } from '../worlds/animal-kingdom.js';
import { CAMERA, clampPitch, cameraOffset, occludeScale } from './camera-rig.js';

const STARS_KEY = 'p1.stars';

export class Game {
  /**
   * @param {{stage:HTMLElement, controls:object, profile:{gender:string,color:string,name:string},
   *          quality:string, antialias:boolean, worldId?:'starter'|'animal',
   *          callbacks:{onStars:Function,onToast:Function,onPrompt:Function,onAutoPause:Function,onEscape:Function}}} opts
   */
  constructor({ stage, controls, profile, quality, antialias, worldId = 'starter', callbacks }) {
    this.stage = stage;
    this.cb = callbacks;
    this.profile = profile;
    this.quality = quality;
    this.paused = false;
    this.disposed = false;
    this.time = 0;
    this.stats = { fps: 0, frames: 0 };
    this._fpsAcc = 0;
    this._fpsFrames = 0;
    this._lastPrompt = null;
    this._zoneId = undefined;

    // --- renderer ---
    this.renderer = new THREE.WebGLRenderer({ antialias, powerPreference: 'high-performance' });
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.canvas = this.renderer.domElement;
    this.canvas.className = 'game-canvas';
    stage.appendChild(this.canvas);

    // --- scene ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#9fd8f5');
    this.scene.fog = new THREE.Fog('#bfe3f2', 28, 90);

    this.camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 220);

    this.hemi = new THREE.HemisphereLight('#e6f4ff', '#6e8c5c', 1.5);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#fff3d6', 2.0);
    this.sun.position.set(26, 40, 18);
    this.sun.shadow.camera.left = -26;
    this.sun.shadow.camera.right = 26;
    this.sun.shadow.camera.top = 26;
    this.sun.shadow.camera.bottom = -26;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 120;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.04;
    this.scene.add(this.sun, this.sun.target);

    // --- dunia ---
    this.worldId = worldId === 'animal' ? 'animal' : 'starter';
    this.starsKey = this.worldId === 'animal' ? 'p2.animal.stars' : STARS_KEY;
    const collected = load(this.starsKey, []);
    const collectedIds = Array.isArray(collected) ? collected : [];
    this.world = this.worldId === 'animal' ? buildAnimalKingdom({ collectedIds }) : buildStarterArea({ collectedIds });
    this.heightAt = this.world.heightAt || starterHeightAt;
    this.worldRadius = this.world.radius || WORLD_RADIUS;
    const spawn = this.world.spawn || STARTER_SPAWN;
    this.scene.add(this.world.group);

    // --- pemain ---
    this.hero = createHero({ gender: profile.gender, color: profile.color });
    this.blob = this.hero.group.getObjectByName('blob-shadow');
    this.scene.add(this.hero.group);
    this.pos = new THREE.Vector3(spawn.x, this.heightAt(spawn.x, spawn.z), spawn.z);
    this.vel = { x: 0, z: 0 };
    this.vy = 0;
    this.grounded = true;
    this.coyote = PLAYER.coyote;
    this.facing = Math.PI; // menghadap -Z (arah kamera awal)
    this.hSpeed = 0;

    // --- kamera ---
    this.yaw = 0;
    this.pitch = CAMERA.startPitch;
    this._dt = 1 / 60;
    this._placeCamera(true);

    // --- input ---
    this.input = new Input(controls, { onEscape: () => this.cb.onEscape?.() });
    this.input.attach();

    this.applyQuality(quality);
    this._onResize = () => this._resize();
    this._ro = new ResizeObserver(this._onResize);
    this._ro.observe(stage);
    this._resize();

    this._onVisibility = () => {
      if (document.hidden) this.cb.onAutoPause?.();
    };
    document.addEventListener('visibilitychange', this._onVisibility);

    this.cb.onStars?.(this.starsCollected(), this.world.stars.length);
    this._lastTs = performance.now();
    this.renderer.setAnimationLoop((ts) => this._tick(ts));
  }

  starsCollected() {
    return this.world.stars.filter((s) => s.collected).length;
  }

  setPaused(p) {
    this.paused = p;
    this.input.enabled = !p;
    if (p) this.input.reset();
  }

  /** Terapkan preset grafis. Gameplay tidak berubah (PROJECT_SPEC bagian 7). */
  applyQuality(level) {
    const preset = QUALITY_PRESETS[level] || QUALITY_PRESETS.medium;
    this.quality = level;
    this.renderer.setPixelRatio(pixelRatioFor(level, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = preset.shadows;
    this.sun.castShadow = preset.shadows;
    if (preset.shadows) {
      const size = preset.shadowMapSize;
      if (this.sun.shadow.mapSize.x !== size) {
        this.sun.shadow.mapSize.set(size, size);
        if (this.sun.shadow.map) {
          this.sun.shadow.map.dispose();
          this.sun.shadow.map = null;
        }
      }
    }
    this.scene.fog.far = preset.fogFar;
    this.world.clouds.visible = preset.clouds;
    this.blob.visible = !preset.shadows; // bayangan bulat hanya bila shadow map mati
    this.scene.traverse((o) => {
      const m = o.material;
      if (!m) return;
      if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true));
      else m.needsUpdate = true;
    });
    this._resize();
  }

  _resize() {
    const w = Math.max(1, this.stage.clientWidth);
    const h = Math.max(1, this.stage.clientHeight);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.fov = this.camera.aspect < 1 ? 74 : 60;
    this.camera.updateProjectionMatrix();
  }

  _placeCamera(snap) {
    const target = {
      x: this.pos.x,
      y: this.pos.y + CAMERA.height,
      z: this.pos.z,
    };
    const off = cameraOffset(this.yaw, this.pitch);
    const sc = occludeScale(target, off, this.world.colliders);
    off.x *= sc;
    off.y *= sc;
    off.z *= sc;
    const desired = new THREE.Vector3(target.x + off.x, target.y + off.y, target.z + off.z);
    const minY = this.heightAt(desired.x, desired.z) + CAMERA.minAboveGround;
    if (desired.y < minY) desired.y = minY;
    if (snap) this.camera.position.copy(desired);
    else this.camera.position.lerp(desired, 1 - Math.exp(-14 * this._dt));
    this.camera.lookAt(target.x, target.y, target.z);
  }

  _tick(ts) {
    if (this.disposed) return;
    const dt = Math.min(0.05, Math.max(0.0001, (ts - this._lastTs) / 1000));
    this._lastTs = ts;
    this._dt = dt;

    // FPS terukur (rata-rata per 0,5 detik) — dipakai untuk TEST_REPORT.md
    this._fpsAcc += dt;
    this._fpsFrames++;
    if (this._fpsAcc >= 0.5) {
      this.stats.fps = Math.round(this._fpsFrames / this._fpsAcc);
      this._fpsAcc = 0;
      this._fpsFrames = 0;
    }
    this.stats.frames++;

    if (!this.paused) {
      this.time += dt;
      this._update(dt);
    }
    this.renderer.render(this.scene, this.camera);
  }

  _update(dt) {
    const input = this.input;

    // kamera
    const look = input.consumeLook(dt);
    this.yaw += look.yaw;
    this.pitch = clampPitch(this.pitch + look.pitch);

    // gerak horizontal
    const mv = input.getMove();
    const mag = Math.hypot(mv.x, mv.y);
    const top = input.isRunning() ? PLAYER.runSpeed : PLAYER.walkSpeed;
    let tx = 0;
    let tz = 0;
    if (mag > 0.001) {
      const d = moveDirection(this.yaw, mv.x, mv.y);
      const len = Math.hypot(d.x, d.z) || 1;
      const s = top * Math.min(1, mag);
      tx = (d.x / len) * s;
      tz = (d.z / len) * s;
    }
    const k = Math.min(1, PLAYER.accel * dt);
    this.vel.x += (tx - this.vel.x) * k;
    this.vel.z += (tz - this.vel.z) * k;

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    resolveColliders(this.pos, PLAYER.radius, this.world.colliders);
    clampToWorld(this.pos, PLAYER.radius, this.worldRadius);
    this.hSpeed = Math.hypot(this.vel.x, this.vel.z);

    // vertikal
    const ground = this.heightAt(this.pos.x, this.pos.z);
    if (this.grounded) {
      this.coyote = PLAYER.coyote;
      // menempel ke lereng turun yang landai
      if (this.pos.y - ground < 0.3) this.pos.y = ground;
    } else {
      this.coyote -= dt;
    }
    const wantJump = input.consumeJump();
    if (wantJump && this.coyote > 0) {
      this.vy = PLAYER.jumpSpeed;
      this.coyote = 0;
      this.grounded = false;
    }
    this.vy -= PLAYER.gravity * dt;
    this.pos.y += this.vy * dt;
    if (this.pos.y <= ground) {
      this.pos.y = ground;
      this.vy = 0;
      this.grounded = true;
    } else if (this.pos.y - ground > 0.05) {
      this.grounded = false;
    }

    // tampilan pemain
    if (this.hSpeed > 0.3) {
      const target = Math.atan2(this.vel.x, this.vel.z);
      this.facing = lerpAngle(this.facing, target, Math.min(1, 14 * dt));
    }
    this.hero.group.position.copy(this.pos);
    this.hero.group.rotation.y = this.facing;
    this.hero.update(dt, this.hSpeed, !this.grounded);
    this.blob.position.y = ground - this.pos.y + 0.03;

    // matahari mengikuti pemain agar bayangan tajam di sekitarnya
    this.sun.target.position.copy(this.pos);
    this.sun.position.set(this.pos.x + 26, this.pos.y + 40, this.pos.z + 18);

    this.world.update(dt, this.time);
    this._trackZone();
    this._collectStars();
    this._handleInteraction(input.consumeInteract());
    this._placeCamera(false);
  }

  /** Beri sapaan saat pemain masuk wilayah baru (hanya dunia yang punya zoneAt). */
  _trackZone() {
    if (!this.world.zoneAt) return;
    const zone = this.world.zoneAt(this.pos.x, this.pos.z);
    const id = zone ? zone.id : null;
    if (id !== this._zoneId) {
      this._zoneId = id;
      if (zone) this.cb.onToast?.(zone.welcome);
    }
  }

  _collectStars() {
    let changed = false;
    for (const s of this.world.stars) {
      if (s.collected) continue;
      const dx = s.x - this.pos.x;
      const dz = s.z - this.pos.z;
      const dy = s.mesh.position.y - (this.pos.y + 0.8);
      if (dx * dx + dz * dz < 1.3 * 1.3 && Math.abs(dy) < 1.7) {
        s.collected = true;
        s.mesh.visible = false;
        changed = true;
      }
    }
    if (changed) {
      const ids = this.world.stars.filter((s) => s.collected).map((s) => s.id);
      save(this.starsKey, ids);
      const n = ids.length;
      const total = this.world.stars.length;
      this.cb.onStars?.(n, total);
      this.cb.onToast?.(n === total ? 'Hebat! Semua bintang terkumpul! ⭐' : `Bintang ${n} dari ${total}! ⭐`);
    }
  }

  _handleInteraction(pressed) {
    let near = null;
    let best = Infinity;
    for (const it of this.world.interactables) {
      const d = Math.hypot(it.x - this.pos.x, it.z - this.pos.z);
      if (d < it.radius && d < best) {
        best = d;
        near = it;
      }
    }
    const promptText = near ? near.prompt : null;
    if (promptText !== this._lastPrompt) {
      this._lastPrompt = promptText;
      this.cb.onPrompt?.(promptText);
    }
    if (pressed && near) this.cb.onToast?.(near.message);
  }

  /** Beban render frame terakhir (draw call, segitiga) dibanding anggaran PHASE 2. */
  renderInfo() {
    const r = this.renderer.info.render;
    const info = { calls: r.calls, triangles: r.triangles, geometries: this.renderer.info.memory.geometries };
    return { ...info, budget: checkBudget(info, this.quality) };
  }

  /** Untuk uji manual / otomatis di browser. */
  debugState() {
    return {
      x: +this.pos.x.toFixed(2),
      y: +this.pos.y.toFixed(2),
      z: +this.pos.z.toFixed(2),
      grounded: this.grounded,
      fps: this.stats.fps,
      frames: this.stats.frames,
      quality: this.quality,
      world: this.worldId,
      zone: this._zoneId ?? null,
      render: this.renderInfo(),
      stars: this.starsCollected(),
      paused: this.paused,
    };
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.input.detach();
    this._ro.disconnect();
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { if (x.map) x.map.dispose(); x.dispose(); });
    });
    this.renderer.dispose();
    this.canvas.remove();
  }
}
