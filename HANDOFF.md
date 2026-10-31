# HANDOFF

Diperbarui: 2026-10-31 (akhir sesi 2, dihentikan karena sisa kuota ≈14%)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 0 selesai dan DISETUJUI.** Pengguna menulis "Tahap 1" (2026-10-31) sebagai persetujuan memulai PHASE 1. **PHASE 1 BELUM DIMULAI: nol baris kode game ditulis.** Sesi dihentikan karena kuota ≈14% (di bawah ambang 20%).

Catatan proses: skill `superpowers:brainstorming` mewajibkan satu putaran tanya-jawab sebelum membangun (HARD-GATE). Pengguna belum menjawab pertanyaan pembuka dan belum memilih "langsung mulai". Sesi berikutnya: tawarkan lagi pilihan "langsung mulai"; bila dipilih, pakai spesifikasi PHASE 1 di `ROADMAP.md` dan `PROJECT_SPEC.md`.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: 100%, disetujui.
- Proyek keseluruhan: **sekitar 5% (perkiraan)** — perencanaan, data materi, 108 aset gambar; nol baris kode game.

## 4. Selesai
- Repo, baca kedua PDF, database materi Bab 2 dan Bab 3 (JSON tervalidasi).
- Dokumen PHASE 0, master prompt Flow, keputusan D-001–D-025, laporan uji.
- Intake 108 aset (40 + 68); `public/assets/manifest.json` schema 1.1. Pengguna sudah commit dan push 68 aset ke repo (manifest baru terbaca di repo; `icon_pause.webp` terbukti WebP valid; jumlah 108 file belum dihitung oleh Claude).
- Branch `develop` dari `main`.

## 5. Belum selesai
- **PHASE 1 seluruhnya** (lihat bagian 14).
- Verifikasi pengguna: `git ls-files public/assets/images | find /c "/"` harus 108.
- Ulang di Flow (opsional, tidak memblokir): `acc_headband`, `health_wasfa` (lingkaran merah berpalang → tanda tambah hijau, D-014), `story_02` (tokoh tidak cocok Faris/Amira), skybox sejati, `tex_roof_tile` dan `tex_wood` tileable.
- Verifikasi guru atas 47 entri `verify` (antrean Teacher Mode, D-020) dan pemetaan gambar kosakata baru.
- Konfirmasi pasangan pet/animal (kelinci, kura-kura).
- Audio (D-019), PHASE 2–10.

## 6. File dibuat
Dokumen: `README.md`, `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
Data: `src/data/lessons/bab2-hewan.json`, `bab3-penyakit.json`.
Aset: 108 file di `public/assets/images/{brand,characters,accessories,npcs,pets,animals,health,sky,textures,ui,story}/` + `public/assets/manifest.json`.

## 7. File diubah (sesi 2)
`public/assets/manifest.json`, `TASKS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`. `ASSET_REQUIREMENTS.md` bagian 8 masih menyebut "40 dari 108"; sumber kebenaran = manifest. `DECISIONS.md` tidak diubah (persetujuan PHASE 0 dicatat di sini dan di `TASKS.md`).

## 8. Struktur repository terbaru
```
*.md (dokumen PHASE 0)
src/data/lessons/{bab2-hewan,bab3-penyakit}.json
public/assets/manifest.json
public/assets/images/brand/        (5)
public/assets/images/characters/   (hero_{boy,girl}_{portrait,full}.webp)
public/assets/images/accessories/  (8)
public/assets/images/npcs/         (8)
public/assets/images/pets/         (3)
public/assets/images/animals/      (23)
public/assets/images/health/       (14)
public/assets/images/sky/          (sky_animal.jpg, sky_sickness.jpg)
public/assets/images/textures/     (10; 512x512 JPG)
public/assets/images/ui/           (icon_* 15, badge_* 10; 256x256)
public/assets/images/story/        (story_01..06.jpg; 1376x768)
```

## 9. Commit terakhir
Periksa dengan `git log -1`. Commit lokal pengguna: "feat: intake aset Flow kedua (68 aset, manifest 108 entri)" di `develop`. Pembaruan dokumen sesi ini dikirim lewat alat `put_file`; cabang tujuannya tidak dapat dipilih dari sisi Claude, jadi **cek `git log` dan `git branch` bahwa pembaruan ini masuk ke `develop`, bukan `main`**.

## 10. Branch aktif
`main` dan `develop`. Kerjakan di `develop`; gabung ke `main` hanya untuk keadaan stabil dan teruji.

## 11. Bug / catatan kualitas
- `acc_headband`: tampak seperti gelang. `health_wasfa`: lingkaran merah berpalang putih (bertentangan D-014). `story_02`: tokoh tidak cocok character bible; `story_01/03/04` perlu dicek.
- `sky_*` bukan equirectangular; `tex_roof_tile`, `tex_wood` sambungan terlihat.
- Pasangan pet/animal adalah asumsi. Masalah materi: `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
`TEST_REPORT.md`: validasi JSON, dua intake aset, manifest lulus. Tidak ada uji game/perangkat.

## 13. Ketergantungan
Belum ada yang dipasang. Usulan: Vite, Three.js (versi dipin), Capacitor, font Arab OFL.

## 14. Langkah berikutnya (spesifik)
1. Mulai sesi baru dengan `NEXT_SESSION_PROMPT.md`.
2. PHASE 1 di `develop`: Vite + Three.js dengan base path relatif; menu utama; loading; character creation (pakai `hero_*_portrait.webp`); scene 3D low-poly prosedural; kamera orang ketiga; jalan/lari/lompat; joystick + keyboard; grafis Low/Medium/High; satu area kecil playable; uji di browser; isi `TEST_REPORT.md`.
3. Keterbatasan alat Claude di sesi ini: sandbox tanpa internet (tidak bisa `npm install`/menjalankan Vite untuk uji) dan `put_file` hanya untuk teks. Rencanakan: kode ditulis lalu pengguna menjalankan `npm install` dan `npm run dev` lokal, atau pakai sesi yang punya akses git/npm (mis. Claude Code). Jangan klaim "teruji" tanpa menjalankannya.

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu. Satu fase per sesi.

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan ganti aset yang sudah ada tanpa alasan; jangan taruh teks Arab di dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
