# HANDOFF

Diperbarui: 2026-10-31 (PHASE 1 dijalankan pengguna di PC; selesai berdasarkan laporan lisan)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 1 (Foundation): SELESAI berdasarkan laporan lisan pengguna.** PHASE 0 selesai dan disetujui (2026-10-31).

Pengguna menjalankan `git pull`, `npm install`, dan `npm run dev` di PC Windows, membuka game di browser, dan melaporkan "aman". `package-lock.json` sudah di-commit dan di-push ke `develop` (commit 7d626f0; berisi three 0.187.0 dan vite 7.3.7).

**Catatan jujur tentang bukti:**
- Pengguna memutuskan TIDAK mengisi tabel 20 uji di `TEST_REPORT.md`. Ini pengecualian atas syarat ROADMAP ("Playable + TEST_REPORT terisi hasil nyata").
- Satu-satunya bukti hasil uji browser adalah laporan lisan "aman". Tidak ada rincian per fitur.
- Tidak dilaporkan, jadi JANGAN diklaim: FPS, perilaku layar sentuh/joystick di HP atau tablet, uji di Xiaomi Pad 7 Pro, hasil `npm run test:smoke` di PC, `npm run build`.

Proses: pengguna memilih "langsung mulai" (skill brainstorming selesai); tidak ada dokumen desain terpisah.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: 100%, disetujui.
- PHASE 1: selesai menurut laporan lisan pengguna. Terbukti: uji Node 28/28 (sesi 3, di sandbox), `npm install` berhasil di PC (ada `package-lock.json`), game dibuka di browser dan dilaporkan "aman". Tidak terbukti: FPS, sentuh, perangkat target, build produksi.
- Proyek keseluruhan: **sekitar 12% (perkiraan)**.

## 4. Selesai
- Semua PHASE 0 (dokumen, JSON materi, 108 aset + manifest).
- PHASE 1 (ditulis): proyek Vite + three 0.187.0; loading → menu → buat karakter → game; pengaturan; jeda; layar galat WebGL; grafis Rendah/Sedang/Tinggi; dunia prosedural "Lembah Awal" (medan, kolam, pohon/palem, batu, rumah, papan, pagar, bunga, awan, 5 bintang); pemain prosedural (laki-laki / perempuan berhijab, 6 warna baju); kamera orang ketiga; jalan/lari/lompat; tabrakan; joystick + tombol sentuh + keyboard + geser kamera; interaksi (papan, rumah); bintang tersimpan di LocalStorage; `tests/smoke.mjs`.
- PHASE 1 (dijalankan pengguna): `npm install` berhasil di PC, `package-lock.json` di-commit dan di-push ke `develop` (7d626f0), game dibuka di browser dan dilaporkan "aman".
- `develop` di-fast-forward ke `main` (50bcc7f) sebelum bekerja pada sesi 3.

## 5. Belum selesai
- (Opsional, tidak diwajibkan pengguna) Isi `TEST_REPORT.md` bagian uji manual.
- Verifikasi versi `vite` terpasang 7.3.7 (dari `package-lock.json`); catat di DECISIONS.md D-026 bila perlu.
- Ukur FPS nyata di HP, Xiaomi Pad 7 Pro, laptop (`?debug=1`); tetapkan anggaran poligon/draw call.
- Uji sub-path GitHub Pages (`dist/` di folder `Sherlocomp-world/`).
- Tidak memblokir: ulang aset di Flow (`acc_headband`, `health_wasfa` D-014, `story_02`; skybox sejati; `tex_roof_tile`, `tex_wood` tileable); verifikasi guru atas 47 entri `verify` (D-020); konfirmasi pasangan pet/animal (kelinci, kura-kura).
- Audio (D-019), PHASE 2–10.

## 6. File dibuat (sesi 3)
`package.json`, `vite.config.js`, `index.html`, `.gitignore`, `tests/smoke.mjs`,
`src/main.js`,
`src/ui/{ui.js,styles.css}`,
`src/core/{config,storage,quality,terrain,collision,movement,input}.js`,
`src/game/{game,camera-rig}.js`,
`src/characters/hero.js`,
`src/worlds/{layout,starter-area}.js`.
Dibuat pengguna di PC: `package-lock.json`.

## 7. File diubah
Sesi 3: `TASKS.md`, `DECISIONS.md` (D-026–D-031), `CHANGELOG.md`, `TEST_REPORT.md`, `README.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`.
Sesi 4 (status PHASE 1 selesai): `HANDOFF.md`, `TASKS.md`, `CHANGELOG.md`, `NEXT_SESSION_PROMPT.md`.
Tidak diubah: `src/data/lessons/*.json`, `public/assets/*`.

## 8. Struktur repository terbaru
```
*.md (dokumen)           index.html  package.json  package-lock.json  vite.config.js  .gitignore
src/main.js
src/ui/          ui.js styles.css
src/core/        config storage quality terrain collision movement input   (semua murni, tanpa Three.js)
src/game/        game.js (Three.js)  camera-rig.js (murni)
src/characters/  hero.js (Three.js)
src/worlds/      layout.js (murni)  starter-area.js (Three.js)
src/data/lessons/{bab2-hewan,bab3-penyakit}.json     <- jangan diubah
tests/smoke.mjs
public/assets/manifest.json + images/{brand,characters,accessories,npcs,pets,animals,health,sky,textures,ui,story}  (108 file)
```
Arsitektur (D-027): logika murni dipisah dari Three.js agar teruji di Node; Three.js dimuat lewat `import()`.

## 9. Commit terakhir dan status GitHub
Cabang `develop`, commit terakhir yang diketahui: 7d626f0 "chore: tambah package-lock.json" (terverifikasi di remote). `main` belum berisi kode PHASE 1; jangan digabung sebelum pengguna memutuskan.

Pembaruan dokumen status PHASE 1 ini ditulis lewat `put_file` ke `main` (alat itu tidak bisa memilih cabang), lalu perlu disalin ke `develop` oleh pengguna dengan `git checkout origin/main -- HANDOFF.md TASKS.md CHANGELOG.md NEXT_SESSION_PROMPT.md`. Pastikan `develop` berisi versi ini.

Peringatan lama: alat `put_file` (MCP My_github) menulis ke `main`, bukan `develop` (itulah mengapa dokumen sesi 2 ada di `main`). Pakai git untuk `develop`.

## 10. Branch aktif
`main` dan `develop`. Kerjakan di `develop`.

## 11. Bug / catatan kualitas
- Belum ada bug yang dilaporkan pengguna. Risiko dari tinjauan kode: lihat bagian terakhir `TEST_REPORT.md` (pencahayaan perkiraan, antialias tetap per sesi, kamera menembus dedaunan, orientasi daun palem).
- Aset: `acc_headband` tampak seperti gelang; `health_wasfa` bertentangan D-014; `story_02` tidak cocok character bible; `sky_*` bukan equirectangular (PHASE 1 memakai warna langit prosedural, bukan gambar); `tex_roof_tile`/`tex_wood` sambungan terlihat (PHASE 1 tidak memakai tekstur).
- Masalah materi: `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
`TEST_REPORT.md` bagian "Sesi 3": uji Node 28/28 + 3 uji negatif lulus (di sandbox). Uji browser: hanya laporan lisan pengguna ("aman"); tabel 20 uji sengaja tidak diisi atas keputusan pengguna. Uji perangkat dan FPS: BELUM DIUJI.

## 13. Ketergantungan
`three` 0.187.0 (dipin), `vite ^7.0.0` di `package.json` (terkunci di `package-lock.json` pada 7.3.7). Belum ada: Capacitor, font Arab (PHASE 3), service worker.

## 14. Langkah berikutnya (spesifik)
1. Tanyakan pengguna apakah langsung mulai PHASE 2 (World Design: Animal Kingdom penuh dulu, baru Sickness Kingdom). Baca `ROADMAP.md` PHASE 2 sebelum mulai.
2. Syarat selesai PHASE 2 mencakup FPS terukur di Xiaomi Pad 7 Pro. Game belum pernah diuji di perangkat itu; rencanakan pengukuran lewat `?debug=1`.
3. Bila ada bug dari pemakaian pengguna, perbaiki di kode yang ada; jangan tulis ulang dari nol.

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu (`git fetch` kedua cabang). Satu fase per sesi. Jangan klaim "teruji" tanpa menjalankannya; jika sandbox tak bisa `npm install`, katakan terus terang.

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan ganti aset yang sudah ada tanpa alasan; jangan taruh teks Arab di dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
- Jangan menulis ulang kode PHASE 1 dari nol: perbaiki yang ada. Jangan melewati kebijakan egress sandbox (D-031).
