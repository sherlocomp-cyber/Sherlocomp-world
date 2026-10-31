// Pembantu DOM: pindah layar, toast, kontrol segmen, pilihan warna.

import { QUALITY_LEVELS, QUALITY_LABELS } from '../core/quality.js';

export const $ = (id) => document.getElementById(id);

const SCREENS = ['loading', 'menu', 'create', 'settings', 'pause', 'error'];

/** Tampilkan satu layar (atau semua tersembunyi bila name = null). */
export function showScreen(name) {
  for (const s of SCREENS) {
    const el = $('screen-' + s);
    if (el) el.hidden = s !== name;
  }
}

let toastTimer = 0;
export function toast(text, ms = 3600) {
  const el = $('toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), ms);
}

export function hideToast() {
  clearTimeout(toastTimer);
  $('toast').hidden = true;
}

/** Bangun semua kontrol segmen kualitas grafis dan sinkronkan nilainya. */
export function setupQualitySegments(getValue, onChange) {
  const segs = document.querySelectorAll('[data-seg="quality"]');
  const refresh = () => {
    segs.forEach((seg) => {
      seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.value === getValue())));
    });
  };
  segs.forEach((seg) => {
    seg.setAttribute('role', 'radiogroup');
    seg.setAttribute('aria-label', 'Kualitas grafis');
    seg.replaceChildren();
    for (const level of QUALITY_LEVELS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.value = level;
      b.setAttribute('role', 'radio');
      b.textContent = QUALITY_LABELS[level];
      b.addEventListener('click', () => {
        onChange(level);
        refresh();
      });
      seg.appendChild(b);
    }
  });
  refresh();
  return refresh;
}

export function buildSwatches(container, colors, selectedHex, onPick) {
  container.replaceChildren();
  const buttons = colors.map((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.style.background = c.hex;
    b.dataset.hex = c.hex;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-label', c.label);
    b.title = c.label;
    b.addEventListener('click', () => onPick(c.hex));
    container.appendChild(b);
    return b;
  });
  const select = (hex) => buttons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.hex === hex)));
  select(selectedHex);
  return select;
}

export function toggleFullscreen() {
  const doc = document;
  const root = doc.documentElement;
  try {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
    } else {
      (root.requestFullscreen || root.webkitRequestFullscreen)?.call(root);
    }
  } catch {
    /* layar penuh tidak didukung: abaikan */
  }
}
