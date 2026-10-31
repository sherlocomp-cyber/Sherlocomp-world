// Konstanta global PHASE 1. Tidak mengimpor Three.js agar bisa diuji di Node.

export const APP_NAME = 'Arabia World';
export const APP_VERSION = '0.1.0';

// Base path relatif (cocok dengan vite base './').
export const ASSET_BASE = './assets/';
export const asset = (path) => ASSET_BASE + path;

export const WORLD_RADIUS = 38;

export const PLAYER = {
  radius: 0.4,
  walkSpeed: 4.2,
  runSpeed: 7.4,
  accel: 12,
  jumpSpeed: 8.6,
  gravity: 22,
  coyote: 0.1,
};

export const SHIRT_COLORS = [
  { id: 'putih', label: 'Putih', hex: '#e9edf5' },
  { id: 'biru', label: 'Biru', hex: '#3f7fd8' },
  { id: 'hijau', label: 'Hijau', hex: '#3fae6a' },
  { id: 'kuning', label: 'Kuning', hex: '#f0bd2e' },
  { id: 'oranye', label: 'Oranye', hex: '#ec7b2c' },
  { id: 'ungu', label: 'Ungu', hex: '#8a5bd0' },
];

// Aset yang dipakai PHASE 1 (relatif terhadap public/assets/).
export const PRELOAD_IMAGES = [
  'images/brand/logo_mark.png',
  'images/brand/menu_bg_animal.jpg',
  'images/characters/hero_boy_portrait.webp',
  'images/characters/hero_girl_portrait.webp',
  'images/ui/icon_star.webp',
  'images/ui/icon_pause.webp',
  'images/ui/icon_gold.webp',
  'images/ui/icon_sound.webp',
];
