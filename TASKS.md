# TASKS

Legenda: `[x]` selesai dan terbukti · `[ ]` belum · `[~]` sebagian.

## PHASE 0 — Project Discovery — SELESAI DAN DISETUJUI (2026-10-31)

- [x] Periksa repository (awalnya kosong)
- [x] Baca seluruh halaman kedua PDF (Bab 2: 16 hlm, Bab 3: 19 hlm)
- [x] Ekstrak materi → `src/data/lessons/*.json`, divalidasi (`TEST_REPORT.md`)
- [x] `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`
- [x] Master prompt Google Flow
- [x] File handoff (`HANDOFF.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `NEXT_SESSION_PROMPT.md`)
- [x] Struktur folder aset fisik; folder kode dibuat saat PHASE 1
- [x] Branch `develop` (D-025)
- [x] Aset Flow: seluruh 108 aset inti di-intake dan di-push pengguna ke repo
- [x] **Persetujuan eksplisit memulai PHASE 1**: pengguna menulis "Tahap 1" (2026-10-31)

## Pertanyaan T-01 s/d T-05 — SELESAI (D-018 s/d D-022)

## Aset Flow — sisa non-blokir

- [ ] Verifikasi jumlah file di repo = 108 (`git ls-files public/assets/images | find /c "/"`)
- [ ] Dibuat ulang di Flow: `acc_headband`, `health_wasfa` (D-014), `story_02`; opsional skybox sejati dan tekstur tileable (`tex_roof_tile`, `tex_wood`)
- [ ] Konfirmasi pengguna: pasangan pet/animal (kelinci, kura-kura)

## PHASE 1 — Foundation (BELUM DIMULAI; sesi 2 dihentikan karena kuota ≈14%)

- [ ] Inisialisasi proyek Vite + Three.js, base path relatif
- [ ] Main menu, loading, character creation sederhana
- [ ] Scene 3D, kamera orang ketiga, gerak/lompat/lari
- [ ] Joystick virtual + keyboard
- [ ] Grafis Low/Medium/High
- [ ] Satu area kecil playable; uji di browser; isi `TEST_REPORT.md`

## PHASE 2–10

Lihat `ROADMAP.md`. Belum dimulai.
