# HANDOFF

Diperbarui: 2026-10-31 (akhir sesi 1, setelah intake aset)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 0 selesai secara dokumen, data, keputusan, dan intake aset batch pertama.** Pengguna sudah mengunggah aset Flow (40 dari 108) dan mendelegasikan T-01–T-05 (diputuskan, lihat `DECISIONS.md` D-018–D-022). **Satu hal tersisa sebelum PHASE 1: pengguna belum menulis persetujuan eksplisit "mulai PHASE 1".** Jangan membangun kode game sebelum itu.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: ±95% (kurang hanya persetujuan eksplisit; 68 aset menyusul tidak memblokir PHASE 1).
- Proyek keseluruhan: **sekitar 4%** (perencanaan, data materi, 40 aset gambar; nol baris kode game).

## 4. Selesai
- Repo (awalnya kosong), baca seluruh halaman kedua PDF, database materi Bab 2 dan Bab 3 (JSON tervalidasi).
- Dokumen PHASE 0 + master prompt Flow + keputusan + laporan uji.
- Intake 40 aset (hapus latar magenta, ubah ukuran, WebP/JPG/PNG, `public/assets/manifest.json` terverifikasi).
- Branch `develop` dibuat dari `main`.

## 5. Belum selesai
- Persetujuan eksplisit memulai PHASE 1.
- 68 aset Flow (daftar di `public/assets/manifest.json` bagian `missing`); ulang `acc_headband`.
- Verifikasi guru atas 47 entri `verify` (masuk antrean Teacher Mode, D-020).
- Audio (D-019 menentukan arsitektur; belum dibangun).
- PHASE 1–10.

## 6. File dibuat
Dokumen: `README.md`, `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
Data: `src/data/lessons/bab2-hewan.json`, `bab3-penyakit.json`.
Aset: 40 file di `public/assets/images/{brand,characters,accessories,npcs,pets,animals}/` + `public/assets/manifest.json`.

## 7. File diubah
`TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `ASSET_REQUIREMENTS.md`, `HANDOFF.md` (pembaruan setelah intake).

## 8. Struktur repository terbaru
```
*.md (dokumen PHASE 0)
src/data/lessons/{bab2-hewan,bab3-penyakit}.json
public/assets/manifest.json
public/assets/images/brand/        (splash_art.jpg, menu_bg_animal.jpg, menu_bg_sickness.jpg, logo_mark.png, app_icon.png)
public/assets/images/characters/   (hero_{boy,girl}_{portrait,full}.webp)
public/assets/images/accessories/  (acc_*.webp, 8)
public/assets/images/npcs/         (npc_*.webp, 8)
public/assets/images/pets/         (pet_{rabbit,pigeon,turtle}.webp)
public/assets/images/animals/      (animal_*.webp, 12)
```

## 9. Commit terakhir
Periksa dengan `git log -1`. Sebelum pembaruan dokumen ini, `main` berada di `ac72f67` (aset + manifest).

## 10. Branch aktif
`main` dan `develop` (develop dibuat dari main). Sesi berikutnya bekerja di `develop`; gabung ke `main` hanya untuk keadaan stabil dan teruji.

## 11. Bug / catatan kualitas
- `acc_headband.webp` terlihat seperti gelang hijau.
- Pasangan pet/animal (kelinci, kura-kura) adalah asumsi dari tampilan.
- Masalah materi: `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
`TEST_REPORT.md`: validasi JSON, intake aset, dan manifest lulus. Tidak ada uji game/perangkat.

## 13. Ketergantungan
Belum ada yang dipasang. Usulan: Vite, Three.js (versi dipin), Capacitor, font Arab OFL.

## 14. Langkah berikutnya (spesifik)
1. Pengguna menulis "mulai PHASE 1" (atau minta perubahan).
2. PHASE 1 di `develop`: Vite + Three.js dengan base path relatif; menu utama; loading; character creation (memakai `hero_*_portrait.webp`); scene 3D low-poly prosedural; kamera orang ketiga; jalan/lari/lompat; joystick + keyboard; grafis Low/Medium/High; satu area kecil playable; uji di browser; isi `TEST_REPORT.md`.
3. Lanjutkan intake aset sisa saat pengguna mengunggah (manifest dahulu, lalu proses; skrip intake bukan bagian repo—tulis ulang bila perlu: magenta chroma-key dengan flood fill dari tepi + komponen besar, despill tepi, WebP kualitas 90).

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu. Satu fase per sesi. Dorong dengan git (repo harus didaftarkan ke sesi lewat tool add_repo dengan akses push; push biner lewat alat put_file tidak praktis).

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan ganti aset yang sudah ada tanpa alasan; jangan taruh teks Arab di dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
