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
- [ ] **Branch `develop`**: belum dibuat (alat repo yang dipakai sesi ini hanya dapat commit ke `main`). Buat saat sesi dengan akses git/CLI.
- [ ] **Persetujuan pengguna atas hasil PHASE 0**
- [ ] **Aset Google Flow dihasilkan pengguna dan diunggah** (minimal Batch 1–3 untuk PHASE 1–3)

## Pertanyaan terbuka untuk pengguna (hanya yang benar-benar diperlukan)

- **T-01 Halaman hilang.** Mohon sediakan Bab 2 hlm 29 (pembuka bab), 43–44 (qira'ah + soal 1–2), dan Bab 3 hlm 74+ jika ada.
- **T-02 Sumber audio.** PDF hanya berisi QR code, tanpa audio. Pilih: (a) rekaman suara guru/penutur asli, (b) suara sintetis (TTS) Arab, (c) kombinasi — TTS dulu, rekaman menyusul.
- **T-03 Verifikasi materi.** Guru Bahasa Arab perlu memeriksa 47 entri `verify` (lihat `MATERIAL_INDEX.md` bagian 7), terutama arti kata `general_knowledge` dan terjemah dialog `draft_unverified`.
- **T-04 App ID Android.** Usulan: `com.sherlocomp.arabiaworld`. Setuju atau ganti?
- **T-05 Visibilitas repository.** Repo ini publik dan memuat teks buku. Tetap publik, atau dijadikan private (GitHub Pages dari repo private memerlukan paket GitHub berbayar)?

## PHASE 1 — Foundation (belum dimulai; menunggu persetujuan PHASE 0)

- [ ] Inisialisasi proyek Vite + Three.js, base path relatif
- [ ] Main menu, loading, character creation sederhana
- [ ] Scene 3D, kamera orang ketiga, gerak/lompat/lari
- [ ] Joystick virtual + keyboard
- [ ] Grafis Low/Medium/High
- [ ] Satu area kecil playable; uji di browser; isi `TEST_REPORT.md`

## PHASE 2–10

Lihat `ROADMAP.md`. Belum dimulai.
