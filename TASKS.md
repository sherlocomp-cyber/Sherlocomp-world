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
- [~] Struktur folder: terdokumentasi di `PROJECT_SPEC.md` bagian 8; folder fisik dibuat saat PHASE 1 (Git tidak melacak folder kosong)
- [x] Branch `develop` dibuat dari `main` (D-025)
- [ ] **Persetujuan eksplisit memulai PHASE 1** (pengguna sudah mengunggah aset dan mendelegasikan T-01–T-05; menunggu kata "mulai PHASE 1")
- [x] Aset Google Flow Batch 1–4 diterima dan di-intake (40 dari 108; sisa 68)

## Pertanyaan T-01 s/d T-05 — SELESAI (diputuskan 2026-10-31)

Pengguna: "halaman hilang abaikan saja, T-01–T-05 ambil keputusan sendiri". Keputusan: lihat `DECISIONS.md` D-018 s/d D-022.

- [x] T-01 Halaman hilang: diabaikan (D-018)
- [x] T-02 Audio: file rekaman bila ada → Web Speech `ar-SA` → teks saja (D-019)
- [x] T-03 Verifikasi materi: antrean verifikasi di Teacher Mode (D-020)
- [x] T-04 App ID `com.sherlocomp.arabiaworld` (D-021)
- [x] T-05 Repo tetap publik (D-022)

## Aset Flow (intake sesi 1)

- [x] 40 gambar diterima, diproses, dimasukkan ke `public/assets/images/` + `public/assets/manifest.json`
- [ ] Belum ada (68): 11 kartu hewan (hirba, karkadann, qird, tuban, namir, timsah, baqarah, hamamah, samak, namlah, dajajah), 14 kartu kesehatan, 2 langit, 10 tekstur, 15 ikon UI, 10 lencana, 6 panel cerita
- [ ] Disarankan dibuat ulang di Flow: `acc_headband` (terlihat seperti gelang hijau)
- [ ] Konfirmasi pengguna: asumsi pasangan pet/animal (kelinci dan kura-kura) di `manifest.json`

## PHASE 1 — Foundation (belum dimulai; menunggu persetujuan PHASE 0)

- [ ] Inisialisasi proyek Vite + Three.js, base path relatif
- [ ] Main menu, loading, character creation sederhana
- [ ] Scene 3D, kamera orang ketiga, gerak/lompat/lari
- [ ] Joystick virtual + keyboard
- [ ] Grafis Low/Medium/High
- [ ] Satu area kecil playable; uji di browser; isi `TEST_REPORT.md`

## PHASE 2–10

Lihat `ROADMAP.md`. Belum dimulai.
