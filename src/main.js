// Titik masuk: loading → menu → buat karakter → game. Satu fase = Foundation (PHASE 1).

import { APP_VERSION, PRELOAD_IMAGES, SHIRT_COLORS, asset } from './core/config.js';
import { load, save } from './core/storage.js';
import { QUALITY_LEVELS, detectDefaultQuality, isValidQuality } from './core/quality.js';
import { $, showScreen, toast, hideToast, setupQualitySegments, buildSwatches, toggleFullscreen } from './ui/ui.js';

const state = {
  profile: load('profile', null), // {name, gender, color}
  settings: load('settings', null), // {quality}
  game: null,
  draft: { gender: 'boy', color: SHIRT_COLORS[1].hex },
  returnTo: 'menu', // layar tujuan tombol "Selesai" di Pengaturan
};

function isTouchDevice() {
  return window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;
}

function ensureSettings() {
  if (!state.settings || !isValidQuality(state.settings.quality)) {
    const quality = detectDefaultQuality({
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      touch: isTouchDevice(),
    });
    state.settings = { quality };
    save('settings', state.settings);
  }
}

// ---------------------------------------------------------------- loading
async function preload() {
  const bar = $('load-bar');
  const text = $('load-text');
  let done = 0;
  const total = PRELOAD_IMAGES.length;
  const failed = [];
  const tick = () => {
    done++;
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + '%';
    text.textContent = `Memuat… ${pct}%`;
  };
  await Promise.all(
    PRELOAD_IMAGES.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = (ev) => {
            if (ev.type === 'error') failed.push(path);
            tick();
            resolve();
          };
          img.src = asset(path);
        }),
    ),
  );
  if (failed.length) console.warn('[Arabia World] aset gagal dimuat:', failed);
  return failed;
}

// ---------------------------------------------------------------- menu
function refreshMenu() {
  const has = !!state.profile;
  $('m-play').textContent = has ? `Lanjutkan (${state.profile.name})` : 'Mulai Petualangan';
  $('m-new').hidden = !has;
}

function openCreate() {
  const p = state.profile;
  state.draft = {
    gender: p?.gender || 'boy',
    color: p?.color || SHIRT_COLORS[1].hex,
  };
  $('c-name').value = p?.name || '';
  syncCreate();
  showScreen('create');
}

let selectSwatch = () => {};
function syncCreate() {
  document.querySelectorAll('.char-card').forEach((c) => c.setAttribute('aria-checked', String(c.dataset.gender === state.draft.gender)));
  selectSwatch(state.draft.color);
}

function cleanName(raw) {
  const n = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 12);
  return n || 'Pemain';
}

// ---------------------------------------------------------------- game
async function startGame() {
  showScreen(null);
  hideToast();
  $('hud').hidden = false;
  $('hud-name').textContent = state.profile.name;
  document.body.classList.toggle('touch', isTouchDevice());

  try {
    const { Game } = await import('./game/game.js'); // Three.js dimuat saat dibutuhkan
    const controls = {
      stage: $('stage'),
      joy: $('joy'),
      knob: $('knob'),
      btnJump: $('btn-jump'),
      btnRun: $('btn-run'),
      btnAct: $('btn-act'),
    };
    const touch = isTouchDevice();
    state.game = new Game({
      stage: $('stage'),
      controls,
      profile: state.profile,
      quality: state.settings.quality,
      antialias: state.settings.quality !== 'low',
      callbacks: {
        onStars: (n, total) => ($('hud-stars').textContent = `${n}/${total}`),
        onToast: (msg) => toast(msg),
        onPrompt: (text) => {
          const prompt = $('prompt');
          const act = $('btn-act');
          act.classList.toggle('ready', !!text);
          act.textContent = text || 'Aksi';
          prompt.hidden = !text || touch;
          if (text) prompt.textContent = `E · ${text}`;
        },
        onAutoPause: () => pauseGame(),
        onEscape: () => (state.game?.paused ? resumeGame() : pauseGame()),
      },
    });
    window.__AW = { get state() { return state.game?.debugState(); }, game: state.game };
    startFpsMeter();
  } catch (err) {
    console.error(err);
    $('hud').hidden = true;
    $('error-text').textContent =
      'Perangkat atau browser ini tidak dapat menampilkan grafis 3D (WebGL). ' +
      'Coba buka di Chrome terbaru, atau pilih kualitas grafis Rendah. Rincian: ' +
      (err?.message || err);
    showScreen('error');
  }
}

let fpsTimer = 0;
function startFpsMeter() {
  clearInterval(fpsTimer);
  const el = $('hud-fps');
  const debug = new URLSearchParams(location.search).has('debug');
  el.hidden = !debug;
  if (!debug) return;
  fpsTimer = setInterval(() => {
    const g = state.game;
    if (g) el.textContent = `${g.stats.fps} FPS · ${g.quality}`;
  }, 500);
}

function pauseGame() {
  const g = state.game;
  if (!g || g.paused) return;
  g.setPaused(true);
  showScreen('pause');
}

function resumeGame() {
  const g = state.game;
  if (!g) return;
  showScreen(null);
  g.setPaused(false);
}

function leaveGame() {
  clearInterval(fpsTimer);
  if (state.game) {
    state.game.dispose();
    state.game = null;
  }
  window.__AW = undefined;
  $('hud').hidden = true;
  $('prompt').hidden = true;
  hideToast();
  refreshMenu();
  showScreen('menu');
}

// ---------------------------------------------------------------- boot
function wire() {
  $('version').textContent = `v${APP_VERSION} · PHASE 1 Foundation`;

  // menu
  $('m-play').addEventListener('click', () => (state.profile ? startGame() : openCreate()));
  $('m-new').addEventListener('click', openCreate);
  $('m-settings').addEventListener('click', () => {
    state.returnTo = 'menu';
    showScreen('settings');
  });
  $('m-full').addEventListener('click', toggleFullscreen);

  // buat karakter
  document.querySelectorAll('.char-card').forEach((card) =>
    card.addEventListener('click', () => {
      state.draft.gender = card.dataset.gender;
      syncCreate();
    }),
  );
  selectSwatch = buildSwatches($('c-colors'), SHIRT_COLORS, state.draft.color, (hex) => {
    state.draft.color = hex;
    syncCreate();
  });
  $('c-back').addEventListener('click', () => showScreen('menu'));
  $('c-go').addEventListener('click', () => {
    state.profile = { name: cleanName($('c-name').value), gender: state.draft.gender, color: state.draft.color };
    save('profile', state.profile);
    startGame();
  });
  $('c-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('c-go').click();
  });

  // pengaturan + jeda: kualitas grafis
  setupQualitySegments(
    () => state.settings.quality,
    (level) => {
      if (!QUALITY_LEVELS.includes(level)) return;
      state.settings.quality = level;
      save('settings', state.settings);
      state.game?.applyQuality(level);
    },
  );
  $('s-back').addEventListener('click', () => showScreen(state.returnTo));

  // jeda
  $('btn-pause').addEventListener('click', pauseGame);
  $('p-resume').addEventListener('click', resumeGame);
  $('p-full').addEventListener('click', toggleFullscreen);
  $('p-menu').addEventListener('click', leaveGame);

  // error
  $('e-back').addEventListener('click', leaveGame);
}

async function boot() {
  showScreen('loading');
  ensureSettings();
  wire();
  await preload();
  refreshMenu();
  showScreen('menu');
}

boot();
