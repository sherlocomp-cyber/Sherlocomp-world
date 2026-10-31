# HANDOFF

Diperbarui: 2026-10-31 (sesi 2, setelah intake aset kedua)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 0 selesai pada semua deliverable:** dokumen, database materi, keputusan T-01–T-05, dan **seluruh 108 aset inti** (intake 1 = 40, intake 2 = 68). **Satu hal tersisa sebelum PHASE 1: pengguna belum menulis persetujuan eksplisit "mulai PHASE 1".** Jangan membangun kode game sebelum itu.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: 100% pada pekerjaan; menunggu hanya persetujuan eksplisit (hak pengguna).
- Proyek keseluruhan: **sekitar 5% (perkiraan)** — perencanaan, data materi, 108 aset gambar; nol baris kode game.

## 4. Selesai
- Repo (awalnya kosong), baca seluruh halaman kedua PDF, database materi Bab 2 dan Bab 3 (JSON tervalidasi).
- Dokumen PHASE 0 + master prompt Flow + keputusan + laporan uji.
- Intake 108 aset (hapus latar magenta, ubah ukuran, WebP/JPG/PNG, `public/assets/manifest.json` schema 1.1 terverifikasi untuk 68 aset baru).
- Branch `develop` dibuat dari `main`.

## 5. Belum selesai
- Persetujuan eksplisit memulai PHASE 1.
- **Commit 68 aset baru ke repo** bila belum (paket ZIP intake 2 harus di-commit dengan git; `put_file` tidak dapat mengirim biner).
- Ulang di Flow (opsional, tidak memblokir): `acc_headband`, `health_wasfa` (lingkaran merah berpalang → tanda tambah hijau), `story_02` (konsistensi tokoh), skybox sejati, tekstur `tex_roof_tile` dan `tex_wood` agar tileable.
- Verifikasi guru atas 47 entri `verify` (antrean Teacher Mode, D-020) dan pemetaan gambar kosakata baru.
- Audio (D-019 menentukan arsitektur; belum dibangun).
- PHASE 1–10.

## 6. File dibuat
Dokumen: `README.md`, `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
Data: `src/data/lessons/bab2-hewan.json`, `bab3-penyakit.json`.
Aset: 108 file di `public/assets/images/{brand,characters,accessories,npcs,pets,animals,health,sky,textures,ui,story}/` + `public/assets/manifest.json`.

## 7. File diubah (sesi 2)
`public/assets/manifest.json`, `TASKS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`. Catatan: `ASSET_REQUIREMENTS.md` bagian 8 masih menyebut "40 dari 108" — sumber kebenaran terbaru adalah manifest.

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
public/assets/images/animals/      (animal_*.webp, 23)
public/assets/images/health/       (health_*.webp, 14)
public/assets/images/sky/          (sky_animal.jpg, sky_sickness.jpg)
public/assets/images/textures/     (tex_*.jpg, 10; 512x512)
public/assets/images/ui/           (icon_*.webp 15, badge_*.webp 10; 256x256)
public/assets/images/story/        (story_01..06.jpg; 1376x768)
```

## 9. Commit terakhir
Periksa dengan `git log -1`. Sebelum intake 2, `main` berada di `ac72f67` (aset + manifest awal); pembaruan dokumen sesi 1 menyusul.

## 10. Branch aktif
`main` dan `develop` (develop dibuat dari main). Sesi berikutnya bekerja di `develop`; gabung ke `main` hanya untuk keadaan stabil dan teruji.

## 11. Bug / catatan kualitas
- `acc_headband.webp` terlihat seperti gelang hijau.
- `health_wasfa.webp` memuat lingkaran merah berpalang putih (bertentangan dengan D-014).
- `story_02.jpg` memuat tokoh yang tidak cocok dengan Faris/Amira; `story_01/03/04` perlu dicek konsistensinya.
- `sky_*` bukan equirectangular; `tex_roof_tile` dan `tex_wood` sambungannya terlihat.
- Pasangan pet/animal (kelinci, kura-kura) adalah asumsi dari tampilan.
- Masalah materi: `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
`TEST_REPORT.md`: validasi JSON, dua intake aset, dan manifest lulus. Tidak ada uji game/perangkat.

## 13. Ketergantungan
Belum ada yang dipasang. Usulan: Vite, Three.js (versi dipin), Capacitor, font Arab OFL.

## 14. Langkah berikutnya (spesifik)
1. Pastikan 68 aset baru sudah di-commit ke `develop`.
2. Pengguna menulis "mulai PHASE 1" (atau minta perubahan).
3. PHASE 1 di `develop`: Vite + Three.js dengan base path relatif; menu utama; loading; character creation (memakai `hero_*_portrait.webp`); scene 3D low-poly prosedural; kamera orang ketiga; jalan/lari/lompat; joystick + keyboard; grafis Low/Medium/High; satu area kecil playable; uji di browser; isi `TEST_REPORT.md`.

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu. Satu fase per sesi. Dorong dengan git (repo harus didaftarkan ke sesi lewat tool add_repo dengan akses push; push biner lewat alat put_file tidak praktis).

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan ganti aset yang sudah ada tanpa alasan; jangan taruh teks Arab di dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
