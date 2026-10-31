# CHANGELOG

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
