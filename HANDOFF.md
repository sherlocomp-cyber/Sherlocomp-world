# HANDOFF

Diperbarui: 2026-10-31 (sesi 3, PHASE 1 — kode ditulis, belum diuji di browser)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 1 (Foundation): KODE SUDAH DITULIS, BELUM TERBUKTI JALAN.** PHASE 0 selesai dan disetujui (2026-10-31). PHASE 1 **tidak boleh dianggap selesai** sebelum pengguna menjalankannya dan tabel uji manual di `TEST_REPORT.md` terisi (syarat ROADMAP: "Playable + TEST_REPORT terisi hasil nyata").

Mengapa belum diuji: sandbox sesi 3 tidak bisa `npm install` — registry npm dijawab **403 oleh kebijakan egress** (D-031). Claude tidak mencari jalan memutar. Jadi tidak ada `package-lock.json`, dan Vite/Three.js tidak pernah dijalankan oleh Claude.

Proses: pengguna memilih "langsung mulai" (skill brainstorming selesai); tidak ada dokumen desain terpisah.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: 100%, disetujui.
- PHASE 1: kode ±100% ditulis untuk daftar di bagian 14; **terbukti** hanya sebatas uji Node 28/28 (logika murni + konsistensi). Perilaku WebGL/sentuh/FPS: **0% terbukti**.
- Proyek keseluruhan: **sekitar 12% (perkiraan)**.

## 4. Selesai
- Semua PHASE 0 (dokumen, JSON materi, 108 aset + manifest).
- PHASE 1 (ditulis): proyek Vite + three 0.187.0; loading → menu → buat karakter → game; pengaturan; jeda; layar galat WebGL; grafis Rendah/Sedang/Tinggi; dunia prosedural "Lembah Awal" (medan, kolam, pohon/palem, batu, rumah, papan, pagar, bunga, awan, 5 bintang); pemain prosedural (laki-laki / perempuan berhijab, 6 warna baju); kamera orang ketiga; jalan/lari/lompat; tabrakan; joystick + tombol sentuh + keyboard + geser kamera; interaksi (papan, rumah); bintang tersimpan di LocalStorage; `tests/smoke.mjs`.
- `develop` di-fast-forward ke `main` (50bcc7f) sebelum bekerja.

## 5. Belum selesai
- **Uji PHASE 1 oleh pengguna** (tabel 20 baris di `TEST_REPORT.md`) lalu perbaiki bug yang muncul.
- `npm install` → commit `package-lock.json`; verifikasi versi `vite` (D-026).
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

## 7. File diubah (sesi 3)
`TASKS.md`, `DECISIONS.md` (D-026–D-031), `CHANGELOG.md`, `TEST_REPORT.md`, `README.md`, `HANDOFF.md`, `NEXT_SESSION_PROMPT.md`. Tidak diubah: `src/data/lessons/*.json`, `public/assets/*`.

## 8. Struktur repository terbaru
```
*.md (dokumen)           index.html  package.json  vite.config.js  .gitignore
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
Cabang `develop`. Commit kode PHASE 1: lihat `git log` (pesan diawali `feat(phase1)`). Dokumen sesi 3 di commit `docs:` sesudahnya. **Status push dicatat di akhir sesi dalam balasan Claude; periksa `git log origin/develop` untuk memastikan.** `main` belum berisi kode PHASE 1 dan **jangan digabung** sebelum PHASE 1 teruji dan disetujui.

Peringatan lama: alat `put_file` (MCP My_github) menulis ke `main`, bukan `develop` (itulah mengapa dokumen sesi 2 ada di `main`). Pakai git untuk `develop`.

## 10. Branch aktif
`main` dan `develop`. Kerjakan di `develop`.

## 11. Bug / catatan kualitas
- Belum ada bug yang dikonfirmasi (belum dijalankan). Risiko dari tinjauan kode: lihat bagian terakhir `TEST_REPORT.md` (pencahayaan perkiraan, antialias tetap per sesi, kamera menembus dedaunan, orientasi daun palem).
- Aset: `acc_headband` tampak seperti gelang; `health_wasfa` bertentangan D-014; `story_02` tidak cocok character bible; `sky_*` bukan equirectangular (PHASE 1 memakai warna langit prosedural, bukan gambar); `tex_roof_tile`/`tex_wood` sambungan terlihat (PHASE 1 tidak memakai tekstur).
- Masalah materi: `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
`TEST_REPORT.md` bagian "Sesi 3": uji Node 28/28 + 3 uji negatif lulus; **semua uji browser/perangkat = BELUM DIUJI**.

## 13. Ketergantungan
`three` 0.187.0 (dipin; keberadaan dicek lewat ecosyste.ms), `vite ^7.0.0` (rentang; belum diverifikasi). Belum ada: Capacitor, font Arab (PHASE 3), service worker.

## 14. Langkah berikutnya (spesifik)
1. **Pengguna** di komputer dengan internet: `git checkout develop && git pull`, `npm install`, `npm run test:smoke` (harus 28/28), `npm run dev` → buka `http://localhost:5173/?debug=1`, mainkan, isi kolom "Hasil" di `TEST_REPORT.md`. Commit `package-lock.json`. Laporkan bug ke Claude (salin pesan galat konsol browser bila ada).
2. **Sesi berikutnya** (idealnya di lingkungan dengan akses npm, mis. Claude Code lokal): perbaiki bug dari uji; jalankan `npm run build`; bila ada browser tanpa kepala, tambahkan uji otomatis; ukur FPS; baru minta persetujuan PHASE 1.
3. Setelah PHASE 1 disetujui → PHASE 2 (World Design: Animal Kingdom penuh dulu). Jangan mulai sebelum persetujuan.

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu (`git fetch` kedua cabang). Satu fase per sesi. Jangan klaim "teruji" tanpa menjalankannya; jika sandbox tak bisa `npm install`, katakan terus terang.

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan ganti aset yang sudah ada tanpa alasan; jangan taruh teks Arab di dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
- Jangan menulis ulang kode PHASE 1 dari nol: perbaiki yang ada. Jangan melewati kebijakan egress sandbox (D-031).
