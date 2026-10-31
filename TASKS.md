# TASKS

Legenda: `[x]` selesai dan terbukti · `[ ]` belum · `[~]` sebagian.

## PHASE 0 — Project Discovery

- [x] Periksa repository: `sherlocomp-cyber/Sherlocomp-world` **kosong** (tidak ada kode sebelumnya)
- [x] Baca seluruh halaman kedua PDF (Bab 2: 16 hlm, Bab 3: 19 hlm)
- [x] Ekstrak kosakata, kalimat, dialog, pola, latihan → `src/data/lessons/*.json`
- [x] Validasi JSON (parse, ID unik, referensi utuh) — lihat `TEST_REPORT.md`
- [x] `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`
- [x] Master prompt Google Flow (di `ASSET_REQUIREMENTS.md` bagian 6)
- [x] File handoff (`HANDOFF.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `NEXT_SESSION_PROMPT.md`)
- [x] Struktur folder aset dibuat fisik (`public/assets/images/*`); folder kode dibuat saat PHASE 1 (lihat `PROJECT_SPEC.md` bagian 8)
- [x] Branch `develop` dibuat dari `main` (D-025)
- [x] Aset Google Flow: **seluruh 108 aset inti** diterima dan di-intake (40 pada intake pertama + 68 pada intake kedua)
- [ ] **Persetujuan eksplisit memulai PHASE 1** (hanya pengguna yang dapat memberikan; menunggu kata "mulai PHASE 1")

## Pertanyaan T-01 s/d T-05 — SELESAI (diputuskan 2026-10-31)

Pengguna: "halaman hilang abaikan saja, T-01–T-05 ambil keputusan sendiri". Keputusan: lihat `DECISIONS.md` D-018 s/d D-022.

- [x] T-01 Halaman hilang: diabaikan (D-018)
- [x] T-02 Audio: file rekaman bila ada → Web Speech `ar-SA` → teks saja (D-019)
- [x] T-03 Verifikasi materi: antrean verifikasi di Teacher Mode (D-020)
- [x] T-04 App ID `com.sherlocomp.arabiaworld` (D-021)
- [x] T-05 Repo tetap publik (D-022)

## Aset Flow

- [x] Intake 1: 40 gambar (brand, karakter, aksesori, NPC, pet, 12 hewan)
- [x] Intake 2: 68 gambar (11 hewan, 14 kartu kesehatan, 2 langit, 10 tekstur, 15 ikon UI, 10 lencana, 6 panel cerita) → `public/assets/manifest.json` kini 108 entri, `still_missing` = 0
- [ ] Disarankan dibuat ulang di Flow (tidak memblokir PHASE 1):
  - `acc_headband` (terlihat seperti gelang hijau)
  - `health_wasfa` (ada lingkaran merah berpalang putih; D-014 meminta tanda tambah hijau)
  - `story_02` (tokoh tidak cocok dengan Faris/Amira; anak perempuan tidak berhijab)
  - `sky_animal`, `sky_sickness` bila ingin skybox sejati (kini panorama 1376×768, bukan equirectangular)
  - Perbaikan tileable: `tex_roof_tile`, `tex_wood` (sambungan terlihat)
- [ ] Konfirmasi pengguna: asumsi pasangan pet/animal (kelinci dan kura-kura) di `manifest.json`

## PHASE 1 — Foundation (belum dimulai; menunggu persetujuan eksplisit)

- [ ] Inisialisasi proyek Vite + Three.js, base path relatif
- [ ] Main menu, loading, character creation sederhana
- [ ] Scene 3D, kamera orang ketiga, gerak/lompat/lari
- [ ] Joystick virtual + keyboard
- [ ] Grafis Low/Medium/High
- [ ] Satu area kecil playable; uji di browser; isi `TEST_REPORT.md`

## PHASE 2–10

Lihat `ROADMAP.md`. Belum dimulai.
