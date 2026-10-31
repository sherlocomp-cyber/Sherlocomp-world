// Masukan: keyboard (WASD/Spasi/Shift/E/Esc/panah), joystick virtual, tombol sentuh,
// dan geser layar untuk memutar kamera (sentuh atau mouse).

import { joystickVector } from './movement.js';

const LOOK_SENSITIVITY = 0.0055; // radian per piksel
const KEY_LOOK_SPEED = 1.9; // radian per detik (tombol panah)

export class Input {
  /**
   * @param {{stage:HTMLElement, joy:HTMLElement, knob:HTMLElement,
   *          btnJump:HTMLElement, btnRun:HTMLElement, btnAct:HTMLElement}} els
   * @param {{onEscape:()=>void}} handlers
   */
  constructor(els, handlers = {}) {
    this.els = els;
    this.handlers = handlers;
    this.keys = new Set();
    this.joy = { x: 0, y: 0, id: null };
    this.look = { dx: 0, dy: 0, id: null, lastX: 0, lastY: 0 };
    this.jumpQueued = false;
    this.interactQueued = false;
    this.runToggle = false;
    this.enabled = true;
    this._cleanup = [];
  }

  attach() {
    const { stage, joy, btnJump, btnRun, btnAct } = this.els;

    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      this._cleanup.push(() => target.removeEventListener(type, fn, opts));
    };

    // --- keyboard ---
    on(window, 'keydown', (e) => {
      if (isTypingTarget(e.target)) return;
      const k = e.code;
      if (k === 'Escape') {
        if (!e.repeat) this.handlers.onEscape?.(); // aktif juga saat jeda: tombol Esc = buka/tutup jeda
        return;
      }
      if (!this.enabled) return;
      if (GAME_KEYS.has(k)) e.preventDefault();
      if (k === 'Space' && !e.repeat) this.jumpQueued = true;
      if (k === 'KeyE' && !e.repeat) this.interactQueued = true;
      this.keys.add(k);
    });
    on(window, 'keyup', (e) => this.keys.delete(e.code));
    on(window, 'blur', () => this.reset());

    // --- joystick virtual ---
    on(joy, 'pointerdown', (e) => {
      if (!this.enabled || this.joy.id !== null) return;
      this.joy.id = e.pointerId;
      joy.setPointerCapture(e.pointerId);
      this._updateJoy(e);
      e.preventDefault();
    });
    on(joy, 'pointermove', (e) => {
      if (e.pointerId === this.joy.id) this._updateJoy(e);
    });
    const endJoy = (e) => {
      if (e.pointerId !== this.joy.id) return;
      this.joy.id = null;
      this.joy.x = 0;
      this.joy.y = 0;
      this.els.knob.style.transform = 'translate(-50%, -50%)';
    };
    on(joy, 'pointerup', endJoy);
    on(joy, 'pointercancel', endJoy);

    // --- tombol sentuh ---
    on(btnJump, 'pointerdown', (e) => {
      if (this.enabled) this.jumpQueued = true;
      e.preventDefault();
    });
    on(btnAct, 'pointerdown', (e) => {
      if (this.enabled) this.interactQueued = true;
      e.preventDefault();
    });
    on(btnRun, 'pointerdown', (e) => {
      this.runToggle = !this.runToggle;
      btnRun.classList.toggle('on', this.runToggle);
      btnRun.setAttribute('aria-pressed', String(this.runToggle));
      e.preventDefault();
    });

    // --- putar kamera dengan geser ---
    on(stage, 'pointerdown', (e) => {
      if (!this.enabled || this.look.id !== null) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      this.look.id = e.pointerId;
      this.look.lastX = e.clientX;
      this.look.lastY = e.clientY;
      stage.setPointerCapture(e.pointerId);
    });
    on(stage, 'pointermove', (e) => {
      if (e.pointerId !== this.look.id) return;
      this.look.dx += e.clientX - this.look.lastX;
      this.look.dy += e.clientY - this.look.lastY;
      this.look.lastX = e.clientX;
      this.look.lastY = e.clientY;
    });
    const endLook = (e) => {
      if (e.pointerId === this.look.id) this.look.id = null;
    };
    on(stage, 'pointerup', endLook);
    on(stage, 'pointercancel', endLook);
    on(stage, 'contextmenu', (e) => e.preventDefault());
  }

  detach() {
    for (const off of this._cleanup) off();
    this._cleanup = [];
    this.reset();
  }

  reset() {
    this.keys.clear();
    this.joy = { x: 0, y: 0, id: null };
    this.look = { dx: 0, dy: 0, id: null, lastX: 0, lastY: 0 };
    this.jumpQueued = false;
    this.interactQueued = false;
    if (this.els.knob) this.els.knob.style.transform = 'translate(-50%, -50%)';
  }

  _updateJoy(e) {
    const rect = this.els.joy.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const v = joystickVector(dx, dy, radius);
    this.joy.x = v.x;
    this.joy.y = v.y;
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, radius / len) * 0.6;
    this.els.knob.style.transform = `translate(calc(-50% + ${dx * k}px), calc(-50% + ${dy * k}px))`;
  }

  /** Arah gerak gabungan keyboard + joystick: x kanan+, y maju+, panjang ≤ 1. */
  getMove() {
    let x = this.joy.x;
    let y = this.joy.y;
    const k = this.keys;
    const kx = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    const ky = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    if (kx || ky) {
      const len = Math.hypot(kx, ky);
      x = kx / len;
      y = ky / len;
    }
    const m = Math.hypot(x, y);
    if (m > 1) {
      x /= m;
      y /= m;
    }
    return { x, y };
  }

  isRunning() {
    return this.runToggle || this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
  }

  consumeJump() {
    const v = this.jumpQueued;
    this.jumpQueued = false;
    return v;
  }

  consumeInteract() {
    const v = this.interactQueued;
    this.interactQueued = false;
    return v;
  }

  /** Perubahan sudut kamera sejak panggilan terakhir. */
  consumeLook(dt) {
    let yaw = -this.look.dx * LOOK_SENSITIVITY;
    let pitch = this.look.dy * LOOK_SENSITIVITY;
    this.look.dx = 0;
    this.look.dy = 0;
    const k = this.keys;
    yaw += ((k.has('ArrowLeft') ? 1 : 0) - (k.has('ArrowRight') ? 1 : 0)) * KEY_LOOK_SPEED * dt;
    pitch += ((k.has('ArrowDown') ? 1 : 0) - (k.has('ArrowUp') ? 1 : 0)) * KEY_LOOK_SPEED * dt;
    return { yaw, pitch };
  }
}

const GAME_KEYS = new Set([
  'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'ShiftLeft', 'ShiftRight',
]);

function isTypingTarget(t) {
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}
