# CHANGELOG

## 2026-11-01 — PHASE 2 tahap B: Sickness Kingdom "Kota Sehat" (sesi 6) — BELUM DIUJI DI BROWSER

### Ditambahkan
- Dunia Sickness Kingdom (radius 100, tanpa air): hub + 5 wilayah (Rumah Sakit, Apotek, Taman Kepala, Taman Perut, Taman Flu dan Demam), jalan setapak, 5 bintang, pedestal 14 kosakata inti Bab 3 dengan gambar kosakata.
- `src/worlds/sickness-{kingdom,layout,plan,art}.js`, `src/core/terrain-sickness.js`, `src/worlds/world-kit.js`, `tests/phase2b.mjs` (`npm run test:phase2b`), `docs/PHASE2_TAHAP_B.md`.
- Keputusan D-037 s/d D-041.

### Diubah
- `src/game/game.js`: opsi `worldId` menerima `'sickness'`; dunia boleh membawa `atmosphere` (warna langit/kabut). Jalur starter dan animal tidak diubah.
- `src/main.js`: parameter `?world=sickness`; label versi per dunia.
- `package.json`: skrip `test:phase2b`.

### Diketahui
- Sandbox: `test:phase2b` 19/19 (data minimal di sandbox) + uji alur dengan tiruan Three.js. `npm install`/`npm run build` TIDAK dijalankan sesi ini (three asli tak bisa dipasang di sandbox). Ini bukan uji WebGL.
- `test:smoke` dan `test:phase2` tidak dijalankan ulang sesudah `game.js`/`main.js` diubah.
- Pengguna melaporkan lisan (2026-11-01) tahap B "sudah aman" di Xiaomi Pad 7. Tidak ada rincian dan tidak ada angka FPS; FPS terukur dan uji rinci BELUM ada.
- `HANDOFF.md`, `TASKS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `DECISIONS.md`, `NEXT_SESSION_PROMPT.md` diperbarui.

## 2026-10-31 — PHASE 2 tahap A: Animal Kingdom (dilaporkan "sudah bagus")

### Ditambahkan (commit 4eb920c, `develop`)
- Dunia Animal Kingdom (radius 100): hub + 6 wilayah, jalan setapak, 6 bintang, pedestal 21 kosakata inti + 1 tambahan.
- `src/worlds/animal-{kingdom,layout,plan}.js`, `src/core/{terrain-animal,budget}.js`, `tests/phase2.mjs` (`npm run test:phase2`), `docs/PHASE2_TAHAP_A.md`.
- Keputusan D-032 s/d D-036.

### Diketahui
- Pengguna melaporkan lisan "sudah bagus". FPS, perangkat target (Xiaomi Pad 7 Pro), dan uji rinci belum dilaporkan.
- Sandbox: `test:smoke` 28/28, `test:phase2` 17/17, `npm run build` berhasil (vite 7.3.7). Ini bukan uji WebGL.
- Dokumen ini diperbarui sesi 5; `main` belum berisi kode PHASE 1/2.

## 2026-10-31 — PHASE 1 dijalankan pengguna di PC (laporan lisan "aman")

### Ditambahkan
- `package-lock.json` (commit 7d626f0 di `develop`): three 0.187.0, vite 7.3.7. Dibuat oleh `npm install` di PC Windows pengguna.

### Diubah
- `HANDOFF.md`, `TASKS.md`, `CHANGELOG.md`, `NEXT_SESSION_PROMPT.md`: PHASE 1 ditandai selesai berdasarkan laporan lisan pengguna.

### Diketahui
- Tabel 20 uji di `TEST_REPORT.md` sengaja tidak diisi (keputusan pengguna). Satu-satunya bukti uji browser adalah laporan lisan "aman".
- Tidak dilaporkan/belum diuji: FPS, layar sentuh, Xiaomi Pad 7 Pro, `npm run test:smoke` dan `npm run build` di PC.

## 2026-10-31 — PHASE 1 Foundation: kode ditulis (sesi 3) — BELUM DIUJI DI BROWSER

### Ditambahkan
- Proyek Vite + Three.js: `package.json` (three 0.187.0), `vite.config.js` (base `./`), `index.html`, `.gitignore`.
- `src/main.js` (loading → menu → buat karakter → game, pengaturan, jeda, layar galat WebGL).
- `src/ui/ui.js`, `src/ui/styles.css` (ukuran mengikuti layar agar terbaca di monitor besar; kontrol sentuh).
- `src/core/`: `config`, `storage`, `quality`, `terrain`, `collision`, `movement`, `input`.
- `src/game/`: `game` (renderer, loop, pemain, kamera, interaksi, bintang), `camera-rig`.
- `src/characters/hero.js` (pemain prosedural laki-laki/perempuan berhijab).
- `src/worlds/`: `layout` (tata letak murni), `starter-area` ("Lembah Awal").
- `tests/smoke.mjs` (`npm run test:smoke`): 28 uji Node.
- Keputusan D-026 s/d D-031.

### Diubah
- `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `README.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
- `develop` di-fast-forward ke `main` (50bcc7f) lebih dulu: pembaruan dokumen sesi 2 lewat `put_file` ternyata masuk `main`.

### Tidak diubah (sesuai aturan)
- `src/data/lessons/*.json` dan seluruh ID kosakata; aset di `public/assets/`.

### Diketahui
- `npm install`, `vite build`, dan menjalankan di browser **belum pernah berhasil dijalankan Claude** (registry npm 403 di sandbox). Tidak ada `package-lock.json` (kemudian dibuat pengguna di PC, lihat entri di atas).

## 2026-10-31 — Intake aset Flow kedua (sesi 2): PHASE 0 dilengkapi

### Ditambahkan
- 68 ilustrasi di `public/assets/images/`: `animals/` (+11), `health/` (14), `sky/` (2), `textures/` (10), `ui/` (15 ikon + 10 lencana), `story/` (6).
- Aset inti kini lengkap: 108 dari 108.

### Diubah
- `public/assets/manifest.json` (schema 1.1): 108 entri; bagian `missing` dikosongkan; ringkasan memuat `remake_suggested` dan `not_to_spec`.
- `TASKS.md`, `HANDOFF.md`, `TEST_REPORT.md`.
- Konvensi mengikuti D-023/D-024: potongan = WebP alpha; ikon/lencana 256×256 (spec 128/256); tekstur 512×512 JPG; langit dan panel cerita JPG 1376×768; bingkai putih `story_06` dipangkas.

### Catatan
- `ASSET_REQUIREMENTS.md` bagian 8 (status intake) adalah catatan lama "40 dari 108"; sumber kebenaran terbaru adalah `public/assets/manifest.json`.

## 2026-10-31 — Intake aset Flow (sesi 1, lanjutan)

### Ditambahkan
- 40 ilustrasi di `public/assets/images/` (brand, characters, accessories, npcs, pets, animals) + `public/assets/manifest.json`.
- Keputusan D-018 s/d D-025 di `DECISIONS.md`.
- Branch `develop`.

### Diubah
- `TASKS.md`, `HANDOFF.md`, `TEST_REPORT.md`, `DECISIONS.md` (T-01–T-05 selesai, status aset).

## 2026-10-31 — PHASE 0 (sesi 1)

### Ditambahkan
- Repository awal (sebelumnya kosong).
- `README.md`, `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md` (termasuk master prompt Google Flow), `TASKS.md`.
- `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
- `src/data/lessons/bab2-hewan.json` (21 kosakata inti + 2 tambahan, dialog, pola, 6 latihan).
- `src/data/lessons/bab3-penyakit.json` (14 kosakata inti, 2 dialog, teks bacaan, pola, 9 latihan).

### Diubah / dihapus
- Tidak ada (repo kosong sebelumnya).

### Diketahui belum ada
- Kode game, aset visual, audio, branch `develop`.
